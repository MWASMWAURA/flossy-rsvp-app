import type { SVGProps } from "react"

export function FlossyMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* A blooming check — petals around a checkmark, nodding to florals + RSVP */}
      <path
        d="M12 2c1.6 1.7 1.6 4.3 0 6-1.6-1.7-1.6-4.3 0-6Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M22 12c-1.7 1.6-4.3 1.6-6 0 1.7-1.6 4.3-1.6 6 0Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M2 12c1.7-1.6 4.3-1.6 6 0-1.7 1.6-4.3 1.6-6 0Z"
        fill="currentColor"
        opacity="0.55"
      />
      <circle cx="12" cy="12" r="6.5" fill="currentColor" opacity="0.14" />
      <path
        d="M8.6 12.2l2.3 2.3 4.5-4.8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
