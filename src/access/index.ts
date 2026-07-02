import type { Access, FieldAccess } from 'payload'

/**
 * Access policy, per the security spec:
 * - Anonymous/public API users have zero read/update/delete access to every
 *   collection. The public site reads content through Payload's Local API
 *   on the server, never through open REST endpoints.
 * - Public form submissions (demo requests, newsletter) are created by
 *   Server Actions via the Local API after validation + rate limiting —
 *   the REST `create` endpoints stay closed.
 * - `media` files are the one public-read surface: they are the site's own
 *   marketing imagery and are served through Payload's file endpoint.
 */

export const isAdmin: Access = ({ req: { user } }) => user?.role === 'admin'

export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return { id: { equals: user.id } }
}

export const nobody: Access = () => false

export const anyone: Access = () => true

export const isAdminField: FieldAccess = ({ req: { user } }) => user?.role === 'admin'
