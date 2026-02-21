import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import type { Barrel, SavedLoad, Action } from "../../../shared/types";

export default function ElevationForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);

  const [barrels, setBarrels] = useState<(Barrel & { roundCount: number })[]>([]);
  const [loads, setLoads] = useState<SavedLoad[]>([]);
  const [actions, setActions] = useState<Action[]>([]);

  const [barrelId, setBarrelId] = useState(searchParams.get("barrelId") ?? "");
  const [loadId, setLoadId] = useState("");
  const [distanceM, setDistanceM] = useState("");
  const [moa, setMoa] = useState("");
  const [recordedAt, setRecordedAt] = useState(new Date().toISOString().slice(0, 10));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetches: Promise<any>[] = [api.getBarrels(), api.getLoads(), api.getActions()];
    if (id) fetches.push(api.getElevation(id));

    Promise.all(fetches).then(([b, l, a, elevation]) => {
      setBarrels(b);
      setLoads(l);
      setActions(a);
      if (elevation) {
        setBarrelId(elevation.barrelId);
        setLoadId(elevation.loadId);
        setDistanceM(String(elevation.distanceM));
        setMoa(String(elevation.moa));
        setRecordedAt(elevation.recordedAt.slice(0, 10));
      }
      setLoading(false);
    });
  }, [id]);

  function barrelLabel(barrel: Barrel & { roundCount: number }): string {
    const action = actions.find((a) => a.id === barrel.actionId);
    const base = `${barrel.caliber} ${barrel.barrelLength}`.trim();
    return action ? `${base} (${action.name})` : base;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const data = {
      barrelId,
      loadId,
      distanceM: Number(distanceM),
      moa: Number(moa),
      recordedAt,
    };
    try {
      if (isEdit && id) {
        await api.updateElevation(id, data);
      } else {
        await api.createElevation(data);
      }
      navigate("/elevations");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!id || !confirm("Delete this elevation entry?")) return;
    try {
      await api.deleteElevation(id);
      navigate("/elevations");
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) return <div className="text-center py-12 text-gun-500">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl tracking-widest text-gun-100 mb-6">
        {isEdit ? "EDIT DOPE ENTRY" : "NEW DOPE ENTRY"}
      </h1>

      {error && (
        <div className="mb-4 bg-red-900/30 border border-red-700 text-red-400 rounded-lg p-3 text-sm font-body">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-body font-medium text-gun-400 mb-1 uppercase tracking-wider">
            Barrel *
          </label>
          <select
            value={barrelId}
            onChange={(e) => setBarrelId(e.target.value)}
            required
            className="w-full bg-gun-800 border border-gun-600 rounded px-3 py-2 text-sm font-body text-gun-100 focus:outline-none focus:border-brass"
          >
            <option value="">Select barrel...</option>
            {barrels.map((b) => (
              <option key={b.id} value={b.id}>
                {barrelLabel(b)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-body font-medium text-gun-400 mb-1 uppercase tracking-wider">
            Load *
          </label>
          <select
            value={loadId}
            onChange={(e) => setLoadId(e.target.value)}
            required
            className="w-full bg-gun-800 border border-gun-600 rounded px-3 py-2 text-sm font-body text-gun-100 focus:outline-none focus:border-brass"
          >
            <option value="">Select load...</option>
            {loads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name || "Unnamed load"}
                {l.projectile ? ` — ${l.projectile}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-body font-medium text-gun-400 mb-1 uppercase tracking-wider">
              Distance *
            </label>
            <div className="relative">
              <input
                type="number"
                value={distanceM}
                onChange={(e) => setDistanceM(e.target.value)}
                required
                placeholder="300"
                min="0"
                step="1"
                className="w-full bg-gun-800 border border-gun-600 rounded px-3 py-2 pr-8 text-sm font-mono text-gun-100 focus:outline-none focus:border-brass"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gun-500 font-mono">m</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-gun-400 mb-1 uppercase tracking-wider">
              MOA *
            </label>
            <div className="relative">
              <input
                type="number"
                value={moa}
                onChange={(e) => setMoa(e.target.value)}
                required
                placeholder="3.75"
                step="0.25"
                className="w-full bg-gun-800 border border-gun-600 rounded px-3 py-2 pr-12 text-sm font-mono text-gun-100 focus:outline-none focus:border-brass"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gun-500 font-mono">MOA</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-body font-medium text-gun-400 mb-1 uppercase tracking-wider">
            Date Recorded
          </label>
          <input
            type="date"
            value={recordedAt}
            onChange={(e) => setRecordedAt(e.target.value)}
            className="w-full bg-gun-800 border border-gun-600 rounded px-3 py-2 text-sm font-mono text-gun-100 focus:outline-none focus:border-brass"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-brass text-gun-950 px-6 py-2 rounded text-sm font-body font-semibold hover:bg-brass-400 transition-colors"
          >
            {isEdit ? "Save Changes" : "Add Entry"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/elevations")}
            className="bg-gun-800 text-gun-300 px-6 py-2 rounded text-sm font-body font-medium hover:bg-gun-700 transition-colors"
          >
            Cancel
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="ml-auto bg-red-900/30 text-red-400 px-6 py-2 rounded text-sm font-body font-medium hover:bg-red-900/50 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
