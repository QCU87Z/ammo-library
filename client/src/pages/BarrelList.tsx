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

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <span className="font-mono text-xs tracking-[0.25em] text-gun-500 uppercase">Loading...</span>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-widest text-gun-100">BARRELS</h1>
        </div>
        <Link
          to="/actions"
          className="inline-flex items-center gap-2 bg-brass text-gun-950 px-4 py-2 rounded text-sm font-body font-semibold hover:bg-brass-400 transition-colors"
          title="Barrels are added from an action's detail page"
        >
          <Plus size={16} /> Add Barrel
        </Link>
      </div>
      <p className="text-xs text-gun-500 font-mono -mt-2">
        Barrels are added from an action's detail page.{" "}
        <Link to="/actions" className="text-brass hover:underline">Go to Actions →</Link>
      </p>

      {barrels.length === 0 ? (
        <p className="text-center text-gun-500 py-8 font-body">
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
                  <h2 className="text-xs font-mono text-gun-500 uppercase tracking-[0.2em] mb-2">
                    {action ? (
                      <Link to={`/actions/${actionId}`} className="hover:text-brass transition-colors">
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
                        className="bg-gun-800 border border-gun-700 rounded-lg p-4 hover:bg-gun-750 hover:border-gun-600 transition-all"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Circle size={14} className="text-brass" />
                          <span className="font-body font-semibold text-gun-100">{barrel.caliber}</span>
                        </div>
                        <div className="text-sm text-gun-400 font-body space-y-1">
                          {barrel.barrelLength && <p>Length: {barrel.barrelLength}</p>}
                          {barrel.twistRate && <p>Twist: {barrel.twistRate}</p>}
                        </div>
                        <div className="mt-3 flex items-center gap-1.5 text-sm font-mono text-gun-500">
                          <Target size={13} className="text-gun-500" />
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
