'use client'

/**
 * One trigger. An entire workflow in motion.
 *
 * A node-based visualizer for five example workflows (WORKFLOWS sample
 * data). A tablist picks the workflow; the selected panel runs a simulated
 * execution node by node with a pulse along each SVG connector, condition
 * lanes (Yes / No, visitor-chosen) and an execution log beside the graph.
 * These are examples of what can be built, not a list of shipped templates.
 *
 * Accessibility: WAI-ARIA tabs with roving tabindex (Left/Right/Up/Down,
 * Home/End; selection follows focus). All five panels are in the server
 * HTML; inactive ones use `hidden`. Pause / Replay controls in each panel;
 * reduced motion shows the completed run (see WorkflowPanel).
 */

import { useRef, useState, type KeyboardEvent } from 'react'
import { SampleBadge, SectionHeader } from '@/components/demo/kit'
import { WORKFLOWS } from '@/demo/sample-data'
import { WorkflowPanel } from '@/components/automation/workflow-panel'
import { cn } from '@/lib/utils'

export function AutomationWorkflow() {
  const [selected, setSelected] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  const focusTab = (i: number) => {
    const n = WORKFLOWS.length
    const next = (i + n) % n
    setSelected(next)
    tabs.current[next]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const map: Record<string, number> = {
      ArrowRight: i + 1,
      ArrowDown: i + 1,
      ArrowLeft: i - 1,
      ArrowUp: i - 1,
      Home: 0,
      End: WORKFLOWS.length - 1,
    }
    if (e.key in map) {
      e.preventDefault()
      focusTab(map[e.key])
    }
  }

  return (
    <section aria-labelledby="automation-heading" className="bg-night py-16 lg:py-24">
      <div className="shell">
        <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="automation-heading"
            tone="night"
            align="left"
            kicker="Workflow automation"
            title="One trigger. An entire workflow in motion."
            lede="Build workflows like these: a trigger starts the run, waits hold it, conditions choose the path and actions do the work. Pick an example and watch a simulated run."
          />
          <SampleBadge tone="night" label="Example workflows · simulated" />
        </div>

        <div className="mt-10 lg:mt-12">
          <div
            role="tablist"
            aria-label="Example workflows"
            aria-orientation="horizontal"
            className="flex flex-wrap gap-2 border-b border-night-line pb-4"
          >
            {WORKFLOWS.map((wf, i) => {
              const isSel = i === selected
              return (
                <button
                  key={wf.id}
                  ref={(el) => {
                    tabs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`wf-tab-${wf.id}`}
                  aria-selected={isSel}
                  aria-controls={`wf-panel-${wf.id}`}
                  tabIndex={isSel ? 0 : -1}
                  onClick={() => setSelected(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cn(
                    'inline-flex h-10 items-center rounded-full border px-4 text-sm font-semibold transition-colors duration-fast',
                    isSel
                      ? 'border-white bg-white text-night'
                      : 'border-night-line bg-night-raised text-white/75 hover:bg-white/10 hover:text-white',
                  )}
                >
                  {wf.name}
                </button>
              )
            })}
          </div>

          {WORKFLOWS.map((wf, i) => (
            <div
              key={wf.id}
              role="tabpanel"
              id={`wf-panel-${wf.id}`}
              aria-labelledby={`wf-tab-${wf.id}`}
              hidden={i !== selected}
              className="pt-6"
            >
              <p className="mb-5 max-w-2xl text-sm text-white/75">{wf.summary}</p>
              <WorkflowPanel workflow={wf} selected={i === selected} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
