'use client'

const PRESETS = ['#1a3a2a', '#c9a84c', '#1e40af', '#991b1b', '#ffffff', '#111827']

export function TeamColorPicker({
  value,
  onChange,
  id,
}: {
  value: string
  onChange: (hex: string) => void
  id?: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        id={id}
        type="color"
        value={value.startsWith('#') ? value : `#${value}`}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-14 cursor-pointer rounded border border-polo-green-mid/40 bg-white"
        aria-label="Team color"
      />
      <div className="flex gap-1">
        {PRESETS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className="h-8 w-8 rounded border border-polo-charcoal/20 shadow-sm"
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
      </div>
    </div>
  )
}
