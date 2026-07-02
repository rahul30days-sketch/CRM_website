import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionAfterLoginHook,
  CollectionAfterLogoutHook,
  CollectionBeforeOperationHook,
  PayloadRequest,
} from 'payload'

type AuditEntry = {
  action: 'login' | 'login-attempt' | 'logout' | 'create' | 'update' | 'delete'
  collectionSlug?: string
  documentId?: string
  summary?: string
}

/**
 * Writes one row to `audit-logs`. Failures are logged but never block the
 * underlying operation — a broken audit sink must not take the CMS down.
 * IP and user agent come from the request; user is snapshotted by email so
 * the trail survives account deletion.
 */
async function record(req: PayloadRequest, entry: AuditEntry): Promise<void> {
  try {
    await req.payload.create({
      collection: 'audit-logs',
      overrideAccess: true,
      data: {
        ...entry,
        userEmail: req.user?.email ?? entry.summary?.match(/^attempt:(.+)$/)?.[1] ?? 'anonymous',
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown',
        userAgent: req.headers.get('user-agent')?.slice(0, 256) ?? 'unknown',
      },
    })
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'audit-log write failed' })
  }
}

export const auditAfterChange: CollectionAfterChangeHook = async ({
  req,
  doc,
  operation,
  collection,
}) => {
  await record(req, {
    action: operation === 'create' ? 'create' : 'update',
    collectionSlug: collection.slug,
    documentId: String(doc.id),
  })
  return doc
}

export const auditAfterDelete: CollectionAfterDeleteHook = async ({ req, id, collection }) => {
  await record(req, {
    action: 'delete',
    collectionSlug: collection.slug,
    documentId: String(id),
  })
}

export const auditAfterLogin: CollectionAfterLoginHook = async ({ req, user }) => {
  await record(req, {
    action: 'login',
    collectionSlug: 'users',
    documentId: String(user.id),
    summary: `login:${user.email}`,
  })
  return user
}

export const auditAfterLogout: CollectionAfterLogoutHook = async ({ req }) => {
  await record(req, { action: 'logout', collectionSlug: 'users' })
}

/**
 * Logs every login *attempt* (success or failure) so repeated failures are
 * visible in the audit trail alongside Payload's built-in account lockout.
 */
export const auditLoginAttempt: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  if (operation === 'login') {
    const email = typeof args.data?.email === 'string' ? args.data.email.slice(0, 128) : 'unknown'
    await record(req, {
      action: 'login-attempt',
      collectionSlug: 'users',
      summary: `attempt:${email}`,
    })
  }
  return args
}
