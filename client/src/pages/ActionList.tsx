import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Action, Barrel } from "../../../shared/types";
import { Plus, Crosshair, Circle } from "lucide-react";

export default function ActionList() {
  const [actions, setActions] = useState<Action[]>([]);
  const [barrels, setBarrels] = useState<Barrel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getActions(), api.getBarrels()]).then(([a, b]) => {
      setActions(a);
      setBarrels(b);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <span className="font-mono text-xs tracking-[0.25em] text-gun-500 uppercase">Loading...</span>
    </div>
  );

  const barrelCountByAction = barrels.reduce<Record<string, number>>((acc, b) => {
    if (b.actionId) acc[b.actionId] = (acc[b.actionId] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl tracking-widest text-gun-100">ACTIONS</h1>
        <Link
          to="/actions/new"
          className="inline-flex items-center gap-2 bg-brass text-gun-950 px-4 py-2 rounded text-sm font-body font-semibold hover:bg-brass-400 transition-colors"
        >
          <Plus size={16} /> New Action
        </Link>
      </div>

      {actions.length === 0 ? (
        <p className="text-center text-gun-500 py-8 font-body">
          No actions yet. Add one to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Link
              key={action.id}
              to={`/actions/${action.id}`}
              className="bg-gun-800 border border-gun-700 rounded-lg p-4 hover:bg-gun-750 hover:border-gun-600 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <Crosshair size={18} className="text-brass" />
                <span className="font-body font-semibold text-gun-100">{action.name}</span>
              </div>
              <div className="text-sm text-gun-400 font-body space-y-1">
                {action.serialNumber && <p>S/N: {action.serialNumber}</p>}
                {action.scopeDetails && <p>Scope: {action.scopeDetails}</p>}
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-gun-500 font-mono">
                <Circle size={12} />
                {barrelCountByAction[action.id] ?? 0} barrel{(barrelCountByAction[action.id] ?? 0) !== 1 ? "s" : ""}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
