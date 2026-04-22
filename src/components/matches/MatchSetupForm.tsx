'use client'

import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import type { PoloMatchDocument, PoloPlayer, PoloOvertimeType } from '@/types/poloMatch'
import type { MatchSetupInput } from '@/lib/match-actions'
import { TeamColorPicker } from '@/components/matches/TeamColorPicker'
import { PlayerRosterEditor } from '@/components/matches/PlayerRosterEditor'
import { OfficialsEditor, type OfficialRow } from '@/components/matches/OfficialsEditor'

function defaultPlayers(team?: { players?: PoloPlayer[] }): PoloPlayer[] {
  const p = team?.players
  if (p?.length) return p.map((x) => ({ ...x }))
  return [{ _key: `p_${Date.now()}`, name: '', position: '1', handicap: 0, isAlternate: false }]
}

function officialsFromDoc(doc: PoloMatchDocument): OfficialRow[] {
  return (doc.officials ?? []).map((o) => ({
    _key: o._key ?? `o_${Math.random()}`,
    name: o.name ?? '',
    role: o.role ?? '',
  }))
}

export function MatchSetupForm({ matchId, initial }: { matchId: string; initial: PoloMatchDocument }) {
  const [slug, setSlug] = useState(initial.slug?.current ?? '')
  const [title, setTitle] = useState(initial.title ?? '')
  const [eventName, setEventName] = useState(initial.eventName ?? '')
  const [clubName, setClubName] = useState(initial.clubName ?? '')
  const [matchDate, setMatchDate] = useState(initial.matchDate ?? '')
  const [matchTime, setMatchTime] = useState(initial.matchTime ?? '')
  const [location, setLocation] = useState(initial.location ?? '')
  const [matchType, setMatchType] = useState(initial.matchType ?? '')
  const [fieldType, setFieldType] = useState(initial.fieldType ?? '')
  const [numberOfChukkers, setNumberOfChukkers] = useState(initial.numberOfChukkers ?? 6)
  const [chukkerDurationSeconds, setChukkerDurationSeconds] = useState(initial.chukkerDurationSeconds ?? 420)
  const [overtimeEnabled, setOvertimeEnabled] = useState(Boolean(initial.overtimeEnabled))
  const [overtimeType, setOvertimeType] = useState<PoloOvertimeType>(initial.overtimeType ?? 'none')
  const [notes, setNotes] = useState(initial.notes ?? '')

  const [homeName, setHomeName] = useState(initial.homeTeam?.name ?? '')
  const [homeColor, setHomeColor] = useState(initial.homeTeam?.colorHex ?? '#1a3a2a')
  const [homeHcp, setHomeHcp] = useState(initial.homeTeam?.handicapTotal ?? 0)
  const [homeStart, setHomeStart] = useState(initial.homeTeam?.startingGoals ?? 0)
  const [homePlayers, setHomePlayers] = useState<PoloPlayer[]>(() => defaultPlayers(initial.homeTeam))

  const [awayName, setAwayName] = useState(initial.awayTeam?.name ?? '')
  const [awayColor, setAwayColor] = useState(initial.awayTeam?.colorHex ?? '#c9a84c')
  const [awayHcp, setAwayHcp] = useState(initial.awayTeam?.handicapTotal ?? 0)
  const [awayStart, setAwayStart] = useState(initial.awayTeam?.startingGoals ?? 0)
  const [awayPlayers, setAwayPlayers] = useState<PoloPlayer[]>(() => defaultPlayers(initial.awayTeam))

  const [officials, setOfficials] = useState<OfficialRow[]>(() => officialsFromDoc(initial))
  const [busy, setBusy] = useState(false)

  const setup = useMemo((): MatchSetupInput => {
    return {
      title,
      slug,
      eventName,
      clubName,
      matchDate: matchDate || undefined,
      matchTime,
      location,
      matchType,
      fieldType,
      numberOfChukkers,
      chukkerDurationSeconds,
      overtimeEnabled,
      overtimeType,
      notes,
      homeTeam: {
        name: homeName,
        colorHex: homeColor,
        handicapTotal: Number(homeHcp) || 0,
        startingGoals: Number(homeStart) || 0,
        players: homePlayers,
      },
      awayTeam: {
        name: awayName,
        colorHex: awayColor,
        handicapTotal: Number(awayHcp) || 0,
        startingGoals: Number(awayStart) || 0,
        players: awayPlayers,
      },
      officials: officials.map((o) => ({ name: o.name, role: o.role })),
    }
  }, [
    title,
    slug,
    eventName,
    clubName,
    matchDate,
    matchTime,
    location,
    matchType,
    fieldType,
    numberOfChukkers,
    chukkerDurationSeconds,
    overtimeEnabled,
    overtimeType,
    notes,
    homeName,
    homeColor,
    homeHcp,
    homeStart,
    homePlayers,
    awayName,
    awayColor,
    awayHcp,
    awayStart,
    awayPlayers,
    officials,
  ])

  async function saveDraft() {
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/matches/${matchId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setup }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? res.statusText)
      toast.success('Draft saved')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  async function publishLive() {
    setBusy(true)
    try {
      const resSave = await fetch(`/api/admin/matches/${matchId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setup }),
      })
      const saveData = await resSave.json().catch(() => ({}))
      if (!resSave.ok) throw new Error(saveData.error ?? resSave.statusText)

      const res = await fetch(`/api/admin/matches/${matchId}/actions`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish_live' }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? res.statusText)
      toast.success('Published live')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Publish failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-polo-green">Match title</span>
          <input className="mt-1 w-full rounded border border-polo-green-mid/30 px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-polo-green">URL slug</span>
          <input className="mt-1 w-full rounded border border-polo-green-mid/30 px-3 py-2 font-mono text-sm" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-polo-green">Event name</span>
          <input className="mt-1 w-full rounded border border-polo-green-mid/30 px-3 py-2" value={eventName} onChange={(e) => setEventName(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-polo-green">Club name</span>
          <input className="mt-1 w-full rounded border border-polo-green-mid/30 px-3 py-2" value={clubName} onChange={(e) => setClubName(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-polo-green">Date</span>
          <input type="date" className="mt-1 w-full rounded border border-polo-green-mid/30 px-3 py-2" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-polo-green">Time (display)</span>
          <input className="mt-1 w-full rounded border border-polo-green-mid/30 px-3 py-2" value={matchTime} onChange={(e) => setMatchTime(e.target.value)} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-polo-green">Location / field</span>
          <input className="mt-1 w-full rounded border border-polo-green-mid/30 px-3 py-2" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-polo-green">Match type</span>
          <input className="mt-1 w-full rounded border border-polo-green-mid/30 px-3 py-2" value={matchType} onChange={(e) => setMatchType(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-polo-green">Field type</span>
          <input className="mt-1 w-full rounded border border-polo-green-mid/30 px-3 py-2" value={fieldType} onChange={(e) => setFieldType(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-polo-green">Chukkers</span>
          <input
            type="number"
            min={1}
            max={8}
            className="mt-1 w-full rounded border border-polo-green-mid/30 px-3 py-2"
            value={numberOfChukkers}
            onChange={(e) => setNumberOfChukkers(Number(e.target.value))}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-polo-green">Chukker length (seconds)</span>
          <input
            type="number"
            className="mt-1 w-full rounded border border-polo-green-mid/30 px-3 py-2"
            value={chukkerDurationSeconds}
            onChange={(e) => setChukkerDurationSeconds(Number(e.target.value))}
          />
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={overtimeEnabled} onChange={(e) => setOvertimeEnabled(e.target.checked)} />
          <span className="text-sm font-medium text-polo-green">Overtime enabled</span>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-polo-green">Overtime type</span>
          <select
            className="mt-1 w-full rounded border border-polo-green-mid/30 px-3 py-2"
            value={overtimeType}
            onChange={(e) => setOvertimeType(e.target.value as PoloOvertimeType)}
          >
            <option value="none">None</option>
            <option value="sudden_death">Sudden death</option>
            <option value="extra_chukker">Extra chukker</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-polo-green">Notes</span>
          <textarea className="mt-1 w-full rounded border border-polo-green-mid/30 px-3 py-2" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-polo-green-mid/20 bg-white p-4 shadow-sm">
          <h2 className="font-display text-xl text-polo-green">Home team</h2>
          <label className="block">
            <span className="text-sm font-medium">Name</span>
            <input className="mt-1 w-full rounded border px-3 py-2" value={homeName} onChange={(e) => setHomeName(e.target.value)} />
          </label>
          <div>
            <span className="text-sm font-medium">Color</span>
            <TeamColorPicker value={homeColor} onChange={setHomeColor} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-xs font-medium">Team hcp</span>
              <input type="number" className="mt-1 w-full rounded border px-2 py-1.5" value={homeHcp} onChange={(e) => setHomeHcp(Number(e.target.value))} />
            </label>
            <label className="block">
              <span className="text-xs font-medium">Starting goals</span>
              <input type="number" className="mt-1 w-full rounded border px-2 py-1.5" value={homeStart} onChange={(e) => setHomeStart(Number(e.target.value))} />
            </label>
          </div>
          <PlayerRosterEditor players={homePlayers} onChange={setHomePlayers} label="Roster" />
        </div>

        <div className="space-y-4 rounded-xl border border-polo-green-mid/20 bg-white p-4 shadow-sm">
          <h2 className="font-display text-xl text-polo-green">Away team</h2>
          <label className="block">
            <span className="text-sm font-medium">Name</span>
            <input className="mt-1 w-full rounded border px-3 py-2" value={awayName} onChange={(e) => setAwayName(e.target.value)} />
          </label>
          <div>
            <span className="text-sm font-medium">Color</span>
            <TeamColorPicker value={awayColor} onChange={setAwayColor} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-xs font-medium">Team hcp</span>
              <input type="number" className="mt-1 w-full rounded border px-2 py-1.5" value={awayHcp} onChange={(e) => setAwayHcp(Number(e.target.value))} />
            </label>
            <label className="block">
              <span className="text-xs font-medium">Starting goals</span>
              <input type="number" className="mt-1 w-full rounded border px-2 py-1.5" value={awayStart} onChange={(e) => setAwayStart(Number(e.target.value))} />
            </label>
          </div>
          <PlayerRosterEditor players={awayPlayers} onChange={setAwayPlayers} label="Roster" />
        </div>
      </section>

      <OfficialsEditor officials={officials} onChange={setOfficials} />

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void saveDraft()} className="btn-primary">
          Save draft
        </button>
        <button type="button" disabled={busy} onClick={() => void publishLive()} className="btn-gold">
          Publish live
        </button>
      </div>
    </div>
  )
}
