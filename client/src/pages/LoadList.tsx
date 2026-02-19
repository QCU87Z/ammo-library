import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { SavedLoad } from "../../../shared/types";
import { Plus, FlaskConical } from "lucide-react";

export default function LoadList() {
  const [loads, setLoads] = useState<SavedLoad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLoads().then((l) => {
      setLoads(l);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Saved Loads</h1>
        <Link
          to="/loads/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Plus size={16} /> New Load
        </Link>
      </div>

      {loads.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No saved loads yet. Create one to reuse across boxes.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {loads.map((load) => (
            <Link
              key={load.id}
              to={`/loads/${load.id}/edit`}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical size={18} className="text-gray-400" />
                <span className="font-semibold">{load.name || "Unnamed Load"}</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                {load.projectile && <p>Projectile: {load.projectile}</p>}
                {load.powder && load.powderCharge && (
                  <p>Charge: {load.powderCharge} {load.powder}</p>
                )}
                {load.primer && <p>Primer: {load.primer}</p>}
                {load.length && <p>OAL: {load.length}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
