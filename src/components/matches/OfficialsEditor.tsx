'use client'

export interface OfficialRow {
  _key: string
  name: string
  role: string
}

export function OfficialsEditor({
  officials,
  onChange,
}: {
  officials: OfficialRow[]
  onChange: (next: OfficialRow[]) => void
}) {
  const add = () =>
    onChange([...officials, { _key: `o_${Date.now()}`, name: '', role: '' }])

  const update = (idx: number, patch: Partial<OfficialRow>) => {
    onChange(officials.map((o, i) => (i === idx ? { ...o, ...patch } : o)))
  }

  const remove = (idx: number) => onChange(officials.filter((_, i) => i !== idx))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-polo-green">Officials</h3>
        <button type="button" onClick={add} className="btn-outline px-3 py-1.5 text-sm">
          Add official
        </button>
      </div>
      {officials.map((o, idx) => (
        <div key={o._key} className="flex flex-wrap gap-2">
          <input
            className="min-w-[140px] flex-1 rounded border border-polo-green-mid/30 px-2 py-1.5 text-sm"
            placeholder="Name"
            value={o.name}
            onChange={(e) => update(idx, { name: e.target.value })}
          />
          <input
            className="min-w-[120px] flex-1 rounded border border-polo-green-mid/30 px-2 py-1.5 text-sm"
            placeholder="Role"
            value={o.role}
            onChange={(e) => update(idx, { role: e.target.value })}
          />
          <button type="button" onClick={() => remove(idx)} className="text-sm text-red-700">
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}
