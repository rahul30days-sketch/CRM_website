import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Media moves to Vercel Blob in production; next/image refuses to
    // optimize a remote host that isn't allowlisted here.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  // NOTE: no `experimental.serverActions.bodySizeLimit` override here.
  // Payload's admin drives editing through Server Actions, and its form-state
  // payloads for block/rich-text docs exceed a small cap — a 100kb limit made
  // the admin uneditable. We keep Next's default (1mb) and same-origin policy.
  // Public form-submission size is bounded separately in src/middleware.ts.
}

export default withPayload(nextConfig)
