import type { Config } from 'tailwindcss'

/**
 * EZCRM theme — light only. Values live as RGB triplets in globals.css so
 * alpha modifiers work (`bg-brand/10`). Write colours through these names,
 * never `[rgb(var(--…))]` or hex literals.
 *
 * Motion tokens mirror src/lib/motion.ts (framer-motion reads that file).
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
          deep: 'rgb(var(--c-brand-deep) / <alpha-value>)',
        },
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        slate: 'rgb(var(--c-slate) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        'btn-ink': 'rgb(var(--btn-ink) / <alpha-value>)',
        // Deep navy for the dark, cinematic product sections.
        night: {
          DEFAULT: 'rgb(var(--c-night) / <alpha-value>)',
          raised: 'rgb(var(--c-night-raised) / <alpha-value>)',
          line: 'rgb(var(--c-night-line) / <alpha-value>)',
        },
        cyan: 'rgb(var(--c-cyan) / <alpha-value>)',
        // Status signals (AA ≥ 4.5:1 on white and sky for small text).
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
      transitionTimingFunction: {
        // The site's one easing curve — same as EASE in src/lib/motion.ts.
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '600ms',
      },
      keyframes: {
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'nav-progress': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(0.85)' },
        },
      },
      animation: {
        'rise-in': 'rise-in 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'nav-progress': 'nav-progress 2.4s cubic-bezier(0.22,1,0.36,1) forwards',
      },
    },
  },
  plugins: [],
}

export default config
