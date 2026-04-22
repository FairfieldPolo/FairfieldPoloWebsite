/** Decorative field graphic for /learn/* hero headers */
export function PoloFieldSilhouette({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 200" fill="currentColor" aria-hidden>
      <ellipse cx="200" cy="120" rx="180" ry="50" className="opacity-40" />
      <path
        d="M40 100 Q200 40 360 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        className="opacity-50"
      />
    </svg>
  )
}
