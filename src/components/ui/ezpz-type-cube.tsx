'use client'

/*
MIT License

Copyright (c) 2026 EZPZ

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * Customize words, palette and fontFamily through props.
 * Place inside a width-constrained container; the SVG scales at 4:5.
 * Keep each line short. Use decorative when nearby text repeats the message.
 */

import { useId, type CSSProperties } from 'react'

export interface EZPZTypeCubeProps {
  /** Four short lines, fitted to every plane as native SVG text. */
  words?: readonly [string, string, string, string]
  background?: string
  topColor?: string
  leftColor?: string
  rightColor?: string
  fontFamily?: string
  className?: string
  style?: CSSProperties
  /** Override the accessible name; otherwise the words are read once. */
  label?: string
  decorative?: boolean
}

/** A responsive typographic cube. No images, canvas, animation, or font downloads. */
export default function EZPZTypeCube({
  words = ['MAKE', 'BOLD', 'IDEAS', 'EZPZ'],
  background = 'var(--color-background, #101113)',
  topColor = 'var(--color-primary, #ff594e)',
  leftColor = 'color-mix(in srgb, var(--color-primary, #ff594e) 77%, var(--color-background, #101113))',
  rightColor = 'var(--color-primary, #ff594e)',
  fontFamily = '"Helvetica Neue", Arial, sans-serif',
  className,
  style,
  label,
  decorative = false,
}: EZPZTypeCubeProps) {
  const id = useId()
  const planes = [
    { transform: 'matrix(.8660254 -.5 .8660254 .5 220 655)', color: topColor, weight: 700 },
    { transform: 'matrix(.8660254 .5 0 1 220 655)', color: leftColor, weight: 300 },
    { transform: 'matrix(.8660254 -.5 0 1 720 943.6751)', color: rightColor, weight: 700 },
  ]
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 1800"
      width="1440"
      height="1800"
      className={className}
      style={{ display: 'block', width: '100%', height: 'auto', ...style }}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-labelledby={decorative ? undefined : id}
      focusable="false"
    >
      {decorative ? null : <title id={id}>{label ?? words.join(' ')}</title>}
      <rect width="1440" height="1800" fill={background} />
      <g transform="translate(0 15)" fontFamily={fontFamily} aria-hidden="true">
        {planes.map((plane, p) => (
          <g key={p} transform={plane.transform} fill={plane.color} fontWeight={plane.weight}>
            {words.map((word, i) => (
              <text
                key={i}
                x="14"
                y={125 + i * 137}
                fontSize="158"
                textLength="549.3503"
                lengthAdjust="spacingAndGlyphs"
              >
                {word}
              </text>
            ))}
          </g>
        ))}
      </g>
    </svg>
  )
}
