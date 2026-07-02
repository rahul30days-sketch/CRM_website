import type { Config } from 'tailwindcss'

/**
 * EZCRM "Powder Room" theme — light only.
 *
 * Two token families share one palette:
 *  - New craft tokens (base/sky/mist/powder/brand/ink/slate/line) drive the
 *    redesigned surfaces.
 *  - Legacy semantic tokens (console/panel/raised/bright/fog/marigold/won…)
 *    are remapped onto the same light values so existing pages inherit the
 *    new look without a per-file rewrite. `marigold` now means brand-blue.
 */
const config: Config = {
  // Light only. No `dark:` variants, no toggle.
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── New system ──────────────────────────────────────────────
        base: 'rgb(var(--c-base) / <alpha-value>)',
        sky: 'rgb(var(--c-sky) / <alpha-value>)',
        mist: 'rgb(var(--c-mist) / <alpha-value>)',
        powder: 'rgb(var(--c-powder) / <alpha-value>)',
        brand: {
          DEFAULT: 'rgb(var(--c-brand) / <alpha-value>)',
          hi: 'rgb(var(--c-brand-hi) / <alpha-value>)',
        },
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        slate: 'rgb(var(--c-slate) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        // ── Legacy aliases (remapped to the light system) ───────────
        console: 'rgb(var(--c-base) / <alpha-value>)',
        panel: 'rgb(var(--c-panel) / <alpha-value>)',
        raised: 'rgb(var(--c-sky) / <alpha-value>)',
        bright: 'rgb(var(--c-ink) / <alpha-value>)',
        fog: 'rgb(var(--c-slate) / <alpha-value>)',
        marigold: {
          DEFAULT: 'rgb(var(--c-brand) / <alpha-value>)',
          deep: 'rgb(var(--c-brand-deep) / <alpha-value>)',
        },
        won: 'rgb(var(--c-won) / <alpha-value>)',
        info: 'rgb(var(--c-info) / <alpha-value>)',
        due: 'rgb(var(--c-due) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '1.25rem', // 20px
        chip: '0.625rem', // 10px
      },
      maxWidth: {
        shell: '80rem',
      },
      spacing: {
        13: '3.25rem', // 52px — large button / CTA height
      },
      boxShadow: {
        // Layered, blue-tinted — floats in a lit blue room.
        glass:
          '0 1px 2px rgba(15,26,51,.06), 0 24px 48px -12px rgba(43,92,230,.14)',
        float:
          '0 2px 4px rgba(15,26,51,.05), 0 40px 80px -20px rgba(43,92,230,.28)',
        soft: '0 1px 2px rgba(15,26,51,.08), 0 8px 20px -8px rgba(43,92,230,.16)',
        press: '0 1px 2px rgba(15,26,51,.12)',
      },
      keyframes: {
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'rise-in': 'rise-in 0.6s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
}

export default config
