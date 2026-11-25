/**
 * Turns a sample Workflow (linear node list) into a run plan for the
 * visualizer: the main path, an optional condition with Yes / No lanes,
 * the executed sequence for the chosen branch, and simulated timing labels.
 *
 * Convention in the sample data: nodes after a condition belong to its Yes
 * branch; the No branch is the condition's `branches.no` outcome, rendered
 * here as a single synthesized action node.
 */

import type { FlowNode, Workflow } from '@/demo/sample-data'

export type Lane = 'main' | 'yes' | 'no'
export type Branch = 'yes' | 'no'
export type NodeStatus = 'queued' | 'running' | 'done' | 'skipped'

export interface PlanNode {
  key: string
  node: FlowNode
  lane: Lane
  /** Simulated offset from the trigger, e.g. "+0s", "after 2 hours (simulated)". */
  timing: string
}

export interface Plan {
  main: PlanNode[]
  condition?: PlanNode
  yes: PlanNode[]
  no: PlanNode[]
}

export function buildPlan(wf: Workflow): Plan {
  const ci = wf.nodes.findIndex((n) => n.kind === 'condition')
  const head = ci === -1 ? wf.nodes : wf.nodes.slice(0, ci + 1)
  const tail = ci === -1 ? [] : wf.nodes.slice(ci + 1)
  const cond = ci === -1 ? undefined : wf.nodes[ci]

  let secs = 0
  let after = ''
  const stamp = (n: FlowNode, i: number) => {
    if (i === 0) return '+0s'
    if (n.kind === 'wait') {
      const dur = n.title.replace(/^wait\s+/i, '')
      after = `+${dur}`
      secs = 0
      return `after ${dur} (simulated)`
    }
    secs += 1
    return after ? `${after}, ${secs}s` : `+${secs}s`
  }

  const main = head.map((n, i) => ({ key: n.id, node: n, lane: 'main' as Lane, timing: stamp(n, i) }))
  const condSecs = secs
  const lane = (nodes: FlowNode[], l: Lane) => {
    secs = condSecs
    return nodes.map((n) => ({ key: `${l}-${n.id}`, node: n, lane: l, timing: stamp(n, 1) }))
  }
  const yes = cond ? lane(tail, 'yes') : []
  const no = cond?.branches
    ? lane(
        [{ id: 'end', kind: 'action', title: cond.branches.no, detail: 'Taken when the answer is No' }],
        'no',
      )
    : []

  return {
    main: cond ? main.slice(0, -1) : main,
    condition: cond ? main[main.length - 1] : undefined,
    yes,
    no,
  }
}

/** Nodes in run order for the chosen branch, plus the keys of the lane not taken. */
export function runOrder(plan: Plan, branch: Branch) {
  const head = plan.condition ? [...plan.main, plan.condition] : plan.main
  const taken = branch === 'yes' ? plan.yes : plan.no
  const skipped = branch === 'yes' ? plan.no : plan.yes
  return { sequence: [...head, ...taken], skipped }
}
