import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, type RifleSummary } from "../api/client";
import { Crosshair, Target, Box as BoxIcon, ScanLine } from "lucide-react";
import SearchBar from "../components/SearchBar";

export default function RiflesList() {
  const [rifles, setRifles] = useState<RifleSummary[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRifles().then((r) => {
      setRifles(r);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (!search) return rifles;
    const q = search.toLowerCase();
    return rifles.filter(
      (r) =>
        r.barrel.caliber.toLowerCase().includes(q) ||
        (r.barrel.serialNumber ?? "").toLowerCase().includes(q) ||
        (r.action?.name ?? "").toLowerCase().includes(q)
    );
  }, [rifles, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, { actionId: string | null; name: string; serial?: string; rifles: RifleSummary[] }>();
    for (const r of filtered) {
      const key = r.action?.id ?? "__unassigned";
      if (!map.has(key)) {
        map.set(key, {
          actionId: r.action?.id ?? null,
          name: r.action?.name ?? "Unassigned",
          serial: r.action?.serialNumber,
          rifles: [],
        });
      }
      map.get(key)!.rifles.push(r);
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [filtered]);

  const totalRifles = rifles.length;
  const totalRounds = rifles.reduce((acc, r) => acc + r.roundCount, 0);
  const totalActiveBoxes = rifles.reduce((acc, r) => acc + r.activeBoxCount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="font-mono text-xs tracking-[0.25em] text-gun-500 uppercase">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-5xl tracking-widest text-gun-100 leading-none">RIFLES</h1>
            <p className="mt-1 text-[10px] font-mono text-gun-400 tracking-[0.25em] uppercase">
              Precision Tracking · Action + Barrel
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Stat label="Rifles" value={totalRifles} />
            <Stat label="Active Boxes" value={totalActiveBoxes} />
            <Stat label="Rounds Fired" value={totalRounds.toLocaleString()} accent />
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 px-3 py-2 rounded border border-brass/30 text-brass text-[11px] font-mono tracking-[0.18em] uppercase hover:bg-brass/10 transition-colors"
            >
              <ScanLine size={13} /> Scan
            </Link>
          </div>
        </div>
        <div className="mt-3 h-px bg-gun-700" />
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by caliber, action, or serial..."
      />

      {rifles.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gun-700 rounded">
          <p className="text-gun-500 text-sm font-mono mb-3">No rifles registered.</p>
          <Link
            to="/actions"
            className="text-[10px] font-mono text-brass hover:text-brass-light tracking-[0.2em] uppercase transition-colors"
          >
            Add an action →
          </Link>
        </div>
      ) : grouped.length === 0 ? (
        <p className="text-center text-gun-500 py-8 font-body">No rifles match that search.</p>
      ) : (
        <div className="space-y-10">
          {grouped.map((group) => (
            <section key={group.actionId ?? "unassigned"}>
              {/* Action header — feels like a data-plate label */}
              <div className="flex items-center gap-3 mb-4">
                <Crosshair size={13} className="text-brass shrink-0" />
                {group.actionId ? (
                  <Link
                    to={`/actions/${group.actionId}`}
                    className="font-display text-2xl tracking-[0.18em] text-gun-100 hover:text-brass transition-colors leading-none"
                  >
                    {group.name.toUpperCase()}
                  </Link>
                ) : (
                  <span className="font-display text-2xl tracking-[0.18em] text-gun-500 leading-none">
                    {group.name.toUpperCase()}
                  </span>
                )}
                {group.serial && (
                  <>
                    <div className="h-px flex-1 bg-gun-700" />
                    <span className="text-[10px] font-mono text-gun-500 tracking-[0.2em] uppercase">
                      SN {group.serial}
                    </span>
                  </>
                )}
                {!group.serial && <div className="h-px flex-1 bg-gun-700" />}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.rifles.map((r) => (
                  <RifleCard key={r.barrel.id} rifle={r} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-end leading-none">
      <span className={`font-mono text-xl font-semibold ${accent ? "text-brass-light" : "text-gun-100"}`}>
        {value}
      </span>
      <span className="mt-1 text-[9px] font-mono tracking-[0.2em] text-gun-500 uppercase">{label}</span>
    </div>
  );
}

function RifleCard({ rifle }: { rifle: RifleSummary }) {
  const { barrel, action, roundCount, activeBoxCount, lastUpdatedAt } = rifle;
  const live = activeBoxCount > 0;

  return (
    <Link
      to={`/rifles/${barrel.id}`}
      className={`group block bg-gun-800 border border-gun-700 rounded-lg overflow-hidden hover:bg-gun-750 hover:border-gun-600 hover:shadow-lg hover:shadow-black/40 transition-all ${
        live ? "border-l-2 border-l-brass" : ""
      }`}
    >
      {/* Headline strip */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-gun-500 tracking-[0.18em] uppercase">
            {action?.name ?? "Unassigned"}
          </span>
          {live ? (
            <span className="text-[9px] font-mono text-brass tracking-[0.18em] uppercase">● Live</span>
          ) : (
            <span className="text-[9px] font-mono text-gun-400 tracking-[0.18em] uppercase">○ Idle</span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl tracking-widest text-gun-100 leading-none group-hover:text-brass-light transition-colors">
            {barrel.caliber || "—"}
          </span>
          {barrel.barrelLength && (
            <span className="font-mono text-sm text-gun-400 leading-none">
              {barrel.barrelLength}"
            </span>
          )}
        </div>
      </div>

      {/* Hairline */}
      <div className="h-px bg-gun-700" />

      {/* Spec strip */}
      <div className="grid grid-cols-3 divide-x divide-gun-700 text-center">
        <SpecCell label="Rounds" value={roundCount.toLocaleString()} icon={<Target size={11} />} />
        <SpecCell label="Boxes" value={activeBoxCount} icon={<BoxIcon size={11} />} />
        <SpecCell
          label="Last"
          value={formatRelDate(lastUpdatedAt)}
        />
      </div>

      {/* Footer meta */}
      {(barrel.twistRate || barrel.zeroDistance || barrel.serialNumber) && (
        <>
          <div className="h-px bg-gun-700" />
          <div className="px-4 py-2.5 flex items-center gap-3 text-[10px] font-mono text-gun-500 uppercase tracking-[0.12em]">
            {barrel.serialNumber && <span>SN {barrel.serialNumber}</span>}
            {barrel.twistRate && <span>Twist {barrel.twistRate}</span>}
            {barrel.zeroDistance && <span>Zero {barrel.zeroDistance}m</span>}
          </div>
        </>
      )}
    </Link>
  );
}

function SpecCell({ label, value, icon }: { label: string; value: number | string; icon?: React.ReactNode }) {
  return (
    <div className="px-2 py-3">
      <div className="flex items-center justify-center gap-1.5 mb-1 text-gun-500">
        {icon}
        <span className="text-[9px] font-mono tracking-[0.18em] uppercase">{label}</span>
      </div>
      <div className="font-mono text-sm font-semibold text-gun-100 leading-none">{value}</div>
    </div>
  );
}

function formatRelDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.floor(days / 7)}w`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  return `${Math.floor(days / 365)}y`;
}
