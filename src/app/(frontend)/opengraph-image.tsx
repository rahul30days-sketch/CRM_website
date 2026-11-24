import { ImageResponse } from 'next/og'

/**
 * Site-wide social / search preview image (1200×630). Next automatically wires
 * this into og:image and twitter:image for every frontend page, so shares and
 * rich results show a branded card. Pure inline styles — no external fonts or
 * images to fetch.
 */

export const alt = 'EZCRM — the sales command center for Indian teams'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: 'linear-gradient(135deg, #ffffff 0%, #eef4ff 55%, #dce8fb 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#0f1a33',
            }}
          >
            <span>EZ</span>
            <span style={{ color: '#2b5ce6' }}>CRM</span>
          </div>
          <div
            style={{
              marginLeft: 8,
              fontSize: 18,
              color: '#54607a',
              fontFamily: 'monospace',
              letterSpacing: '0.12em',
            }}
          >
            FOR INDIAN SALES TEAMS
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#0f1a33',
              maxWidth: 1000,
            }}
          >
            Run your entire sales floor from one screen.
          </div>
          <div style={{ fontSize: 30, color: '#54607a', maxWidth: 900, lineHeight: 1.35 }}>
            Leads, WhatsApp, quotations and pipelines — captured in seconds, routed in
            seconds, and quoted with correct GST.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {['IndiaMART', 'JustDial', 'WhatsApp', 'Facebook', 'Razorpay', 'GST quotations'].map(
            (chip) => (
              <div
                key={chip}
                style={{
                  display: 'flex',
                  fontSize: 22,
                  color: '#2b5ce6',
                  background: '#ffffff',
                  border: '1px solid #e2e9f5',
                  borderRadius: 999,
                  padding: '10px 22px',
                  fontWeight: 600,
                }}
              >
                {chip}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    { ...size },
  )
}
