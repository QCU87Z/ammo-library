import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { AmmoBox, Barrel, Action } from "../../../shared/types";
import SearchBar from "../components/SearchBar";
import BoxCard from "../components/BoxCard";
import { Plus } from "lucide-react";

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

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ammo Boxes</h1>
        <Link
          to="/boxes/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
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
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="retired">Retired</option>
        </select>
        <select
          value={barrelFilter}
          onChange={(e) => setBarrelFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((box) => (
          <BoxCard key={box.id} box={box} barrelName={barrelMap[box.barrelId || ""]} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          {boxes.length === 0 ? "No boxes yet. Create one to get started." : "No boxes match your filters."}
        </p>
      )}
    </div>
  );
}
