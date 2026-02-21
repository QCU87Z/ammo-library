import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Barrel, SavedLoad, Elevation } from "../../../shared/types";
import ConfirmDialog from "../components/ConfirmDialog";
import { Plus, Target } from "lucide-react";

export default function ElevationList() {
  const [barrels, setBarrels] = useState<(Barrel & { roundCount: number })[]>([]);
  const [loads, setLoads] = useState<SavedLoad[]>([]);
  const [elevations, setElevations] = useState<Elevation[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterBarrelId, setFilterBarrelId] = useState("");
  const [filterLoadId, setFilterLoadId] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getBarrels(), api.getLoads(), api.getElevations()]).then(
      ([b, l, e]) => {
        setBarrels(b);
        setLoads(l);
        setElevations(e);
        setLoading(false);
      }
    );
  }, []);

  async function handleDelete() {
    if (!deleteId) return;
    await api.deleteElevation(deleteId);
    setElevations((prev) => prev.filter((e) => e.id !== deleteId));
    setDeleteId(null);
  }

  if (loading) return <div className="text-center py-12 text-gun-500">Loading...</div>;

  const loadMap = Object.fromEntries(loads.map((l) => [l.id, l]));
  const barrelMap = Object.fromEntries(barrels.map((b) => [b.id, b]));

  const filtered = elevations.filter((e) => {
    if (filterBarrelId && e.barrelId !== filterBarrelId) return false;
    if (filterLoadId && e.loadId !== filterLoadId) return false;
    return true;
  });

  // Group by distanceM
  const grouped = new Map<number, Elevation[]>();
  for (const e of filtered) {
    if (!grouped.has(e.distanceM)) grouped.set(e.distanceM, []);
    grouped.get(e.distanceM)!.push(e);
  }
  const sortedDistances = [...grouped.keys()].sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl tracking-widest text-gun-100">DOPE</h1>
        <Link
          to="/elevations/new"
          className="inline-flex items-center gap-2 bg-brass text-gun-950 px-4 py-2 rounded text-sm font-body font-semibold hover:bg-brass-400 transition-colors"
        >
          <Plus size={16} /> New Entry
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterBarrelId}
          onChange={(e) => setFilterBarrelId(e.target.value)}
          className="bg-gun-800 border border-gun-600 rounded px-3 py-2 text-sm font-body text-gun-300 focus:outline-none focus:border-brass"
        >
          <option value="">All Barrels</option>
          {barrels.map((b) => (
            <option key={b.id} value={b.id}>
              {b.caliber} {b.barrelLength}
            </option>
          ))}
        </select>
        <select
          value={filterLoadId}
          onChange={(e) => setFilterLoadId(e.target.value)}
          className="bg-gun-800 border border-gun-600 rounded px-3 py-2 text-sm font-body text-gun-300 focus:outline-none focus:border-brass"
        >
          <option value="">All Loads</option>
          {loads.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name || "Unnamed load"}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gun-500 py-8 font-body">
          No elevation data yet.{" "}
          <Link to="/elevations/new" className="text-brass hover:underline">
            Add your first entry.
          </Link>
        </p>
      ) : (
        <div className="space-y-6">
          {sortedDistances.map((dist) => (
            <section key={dist}>
              <div className="flex items-center gap-3 mb-3">
                <Target size={16} className="text-brass" />
                <h2 className="font-display text-2xl tracking-widest text-brass">{dist}m</h2>
                <div className="flex-1 h-px bg-gun-700" />
              </div>
              <div className="space-y-2">
                {grouped.get(dist)!.map((e) => {
                  const barrel = barrelMap[e.barrelId];
                  const load = loadMap[e.loadId];
                  return (
                    <div
                      key={e.id}
                      className="bg-gun-900 border border-gun-700 rounded-lg px-4 py-3 flex items-center gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                          <span className="font-body font-medium text-gun-100 text-sm">
                            {load?.name ?? "Unknown load"}
                          </span>
                          {barrel && (
                            <span className="text-xs text-gun-500 font-body">
                              {barrel.caliber} {barrel.barrelLength}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gun-600 font-mono mt-0.5">{e.recordedAt}</p>
                      </div>
                      <div className="font-mono text-xl font-semibold text-brass shrink-0">
                        {e.moa.toFixed(2)}
                        <span className="text-xs text-gun-500 ml-1">MOA</span>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Link
                          to={`/elevations/${e.id}/edit`}
                          className="p-1.5 text-gun-500 hover:text-brass transition-colors"
                          title="Edit"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </Link>
                        <button
                          onClick={() => setDeleteId(e.id)}
                          className="p-1.5 text-gun-500 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Elevation Entry"
        message="Are you sure you want to delete this DOPE entry? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
