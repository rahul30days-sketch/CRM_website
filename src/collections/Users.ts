import {
  APIError,
  type CollectionBeforeChangeHook,
  type CollectionBeforeOperationHook,
  type CollectionConfig,
} from 'payload'
import { isAdmin, isAdminOrSelf, isAdminField } from '@/access'
import { auditAfterLogin, auditAfterLogout, auditLoginAttempt } from '@/hooks/audit'

/**
 * Password policy: 8–128 chars, enforced *before* hashing. The upper bound
 * rejects over-length input outright (never truncates) to prevent
 * long-password bcrypt DoS. Keep the length in sync with the
 * `authentication:newPassword` label override in payload.config.ts.
 */
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 128

const enforcePasswordPolicy: CollectionBeforeOperationHook = ({ args, operation }) => {
  if (operation === 'create' || operation === 'update') {
    const password = (args.data as { password?: unknown } | undefined)?.password
    if (typeof password === 'string' && password.length > 0) {
      if (password.length > PASSWORD_MAX_LENGTH) {
        throw new APIError(`Password must be ${PASSWORD_MAX_LENGTH} characters or fewer.`, 400)
      }
      if (password.length < PASSWORD_MIN_LENGTH) {
        throw new APIError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`, 400)
      }
    }
  }
  return args
}

/**
 * The only unauthenticated create path is Payload's first-register screen
 * (REST create is admin-only). Whatever the role dropdown says there, the
 * first user must be an admin — otherwise the install locks itself out of
 * every admin-only action.
 */
const ensureFirstUserIsAdmin: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation === 'create' && !req.user) {
    data.role = 'admin'
  }
  return data
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Short-lived sessions: 2h token, rotated by Payload on refresh.
    tokenExpiration: 2 * 60 * 60,
    // Account lockout: 5 failed attempts locks the account for 10 minutes.
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    },
  },
  admin: {
    useAsTitle: 'email',
    group: 'System',
  },
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
    unlock: isAdmin,
  },
  hooks: {
    beforeOperation: [enforcePasswordPolicy, auditLoginAttempt],
    beforeChange: [ensureFirstUserIsAdmin],
    afterLogin: [auditAfterLogin],
    afterLogout: [auditAfterLogout],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      saveToJWT: true,
      access: {
        // Editors cannot promote themselves.
        create: isAdminField,
        update: isAdminField,
      },
    },
    {
      // MFA-ready: secrets live in their own group so enabling TOTP later is
      // an additive change, not a migration. Never exposed via the API.
      name: 'mfa',
      type: 'group',
      admin: {
        description: 'Reserved for TOTP rollout — no launch behavior depends on this shape.',
      },
      fields: [
        { name: 'totpEnabled', type: 'checkbox', defaultValue: false },
        {
          name: 'totpSecret',
          type: 'text',
          hidden: true,
          access: { read: () => false, update: isAdminField },
        },
      ],
    },
  ],
  timestamps: true,
}
