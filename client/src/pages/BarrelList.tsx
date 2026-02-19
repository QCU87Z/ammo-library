import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Barrel, Action } from "../../../shared/types";
import { Plus, Circle } from "lucide-react";

export default function BarrelList() {
  const [barrels, setBarrels] = useState<Barrel[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getBarrels(), api.getActions()]).then(([b, a]) => {
      setBarrels(b);
      setActions(a);
      setLoading(false);
    });
  }, []);

  const actionMap = Object.fromEntries(actions.map((a) => [a.id, a.name]));

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {barrels.map((barrel) => (
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
                {barrel.actionId && (
                  <p className="text-gray-400">
                    on {actionMap[barrel.actionId] || "Unknown"}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
