import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { AmmoBox, Barrel, Action } from "../../../shared/types";
import SearchBar from "../components/SearchBar";
import BoxCard from "../components/BoxCard";
import { Plus, X } from "lucide-react";

export default function BoxList() {
  const [boxes, setBoxes] = useState<AmmoBox[]>([]);
  const [barrels, setBarrels] = useState<Barrel[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [barrelFilter, setBarrelFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [b, br, a] = await Promise.all([api.getBoxes(), api.getBarrels(), api.getActions()]);
    setBoxes(b);
    setBarrels(br);
    setActions(a);
    setLoading(false);
  }

  const barrelMap = Object.fromEntries(
    barrels.map((b) => [b.id, `${b.caliber} ${b.barrelLength}`.trim()])
  );
  const actionMap = Object.fromEntries(actions.map((a) => [a.id, a.name]));

  const filtered = boxes.filter((b) => {
    if (statusFilter && b.status !== statusFilter) return false;
    if (barrelFilter && b.barrelId !== barrelFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const barrelName = barrelMap[b.barrelId || ""] || "";
      return (
        b.boxNumber.toLowerCase().includes(q) ||
        b.brand.toLowerCase().includes(q) ||
        barrelName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <span className="font-mono text-xs tracking-[0.25em] text-gun-500 uppercase">Loading...</span>
    </div>
  );

  // Group barrels by action for the filter dropdown
  const barrelsByAction = new Map<string, { actionName: string; barrels: Barrel[] }>();
  const unassignedBarrels: Barrel[] = [];
  for (const b of barrels) {
    if (b.actionId) {
      const group = barrelsByAction.get(b.actionId) || {
        actionName: actionMap[b.actionId] || "Unknown",
        barrels: [],
      };
      group.barrels.push(b);
      barrelsByAction.set(b.actionId, group);
    } else {
      unassignedBarrels.push(b);
    }
  }

  const hasActiveFilters = Boolean(search || statusFilter || barrelFilter);

  function clearFilters() {
    setSearch("");
    setStatusFilter("");
    setBarrelFilter("");
  }

  const selectClass =
    "bg-gun-800 border border-gun-600 rounded px-3 py-2 text-sm font-body text-gun-300 focus:outline-none focus:border-brass";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl tracking-widest text-gun-100">AMMO BOXES</h1>
        <Link
          to="/boxes/new"
          className="inline-flex items-center gap-2 bg-brass text-gun-950 px-4 py-2 rounded text-sm font-body font-semibold hover:bg-brass-400 transition-colors"
        >
          <Plus size={16} /> New Box
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search boxes..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={selectClass}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="retired">Retired</option>
        </select>
        <select
          value={barrelFilter}
          onChange={(e) => setBarrelFilter(e.target.value)}
          className={selectClass}
        >
          <option value="">All barrels</option>
          {[...barrelsByAction.entries()].map(([actId, group]) => (
            <optgroup key={actId} label={group.actionName}>
              {group.barrels.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.caliber} {b.barrelLength}
                </option>
              ))}
            </optgroup>
          ))}
          {unassignedBarrels.length > 0 && (
            <optgroup label="Unassigned">
              {unassignedBarrels.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.caliber} {b.barrelLength}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-body text-gun-400 hover:text-brass border border-gun-600 rounded transition-colors"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((box) => (
          <BoxCard key={box.id} box={box} barrelName={barrelMap[box.barrelId || ""]} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gun-500 text-sm font-mono mb-3">
            {boxes.length === 0 ? "No boxes yet. Create one to get started." : "No boxes match your filters."}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-mono text-brass hover:underline tracking-[0.15em] uppercase"
            >
              Clear Filters →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
