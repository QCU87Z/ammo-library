import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Barrel, Action } from "../../../shared/types";
import { Plus, Circle, Target } from "lucide-react";

export default function BarrelList() {
  const [barrels, setBarrels] = useState<(Barrel & { roundCount: number })[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getBarrels(), api.getActions()]).then(([b, a]) => {
      setBarrels(b);
      setActions(a);
      setLoading(false);
    });
  }, []);

  const actionMap = Object.fromEntries(actions.map((a) => [a.id, a]));

  // Group barrels by actionId; unassigned barrels go under null key
  const grouped = new Map<string | null, typeof barrels>();
  grouped.set(null, []);
  for (const action of actions) grouped.set(action.id, []);
  for (const barrel of barrels) {
    const key = barrel.actionId && grouped.has(barrel.actionId) ? barrel.actionId : null;
    grouped.get(key)!.push(barrel);
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Barrels</h1>
        <Link
          to="/actions"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Plus size={16} /> New Barrel
        </Link>
      </div>

      {barrels.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No barrels yet. Add one from an action's detail page.
        </p>
      ) : (
        <div className="space-y-6">
          {[...grouped.entries()]
            .filter(([, barrelGroup]) => barrelGroup.length > 0)
            .map(([actionId, barrelGroup]) => {
              const action = actionId ? actionMap[actionId] : null;
              return (
                <section key={actionId ?? "unassigned"}>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {action ? (
                      <Link to={`/actions/${actionId}`} className="hover:text-blue-600">
                        {action.name}
                      </Link>
                    ) : (
                      "Unassigned"
                    )}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {barrelGroup.map((barrel) => (
                      <Link
                        key={barrel.id}
                        to={`/barrels/${barrel.id}`}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Circle size={14} className="text-gray-400" />
                          <span className="font-semibold">{barrel.caliber}</span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          {barrel.barrelLength && <p>Length: {barrel.barrelLength}</p>}
                          {barrel.twistRate && <p>Twist: {barrel.twistRate}</p>}
                        </div>
                        <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                          <Target size={13} className="text-gray-400" />
                          {barrel.roundCount.toLocaleString()} rounds
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
        </div>
      )}
    </div>
  );
}
