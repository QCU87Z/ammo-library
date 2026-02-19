import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Action } from "../../../shared/types";
import { Plus, Crosshair } from "lucide-react";

export default function ActionList() {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getActions().then((a) => {
      setActions(a);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Actions</h1>
        <Link
          to="/actions/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Plus size={16} /> New Action
        </Link>
      </div>

      {actions.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No actions yet. Add one to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Link
              key={action.id}
              to={`/actions/${action.id}`}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <Crosshair size={18} className="text-gray-400" />
                <span className="font-semibold">{action.name}</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                {action.serialNumber && <p>S/N: {action.serialNumber}</p>}
                {action.scopeDetails && <p>Scope: {action.scopeDetails}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
