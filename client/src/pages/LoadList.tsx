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

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <span className="font-mono text-xs tracking-[0.25em] text-gun-500 uppercase">Loading...</span>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl tracking-widest text-gun-100">SAVED LOADS</h1>
        <Link
          to="/loads/new"
          className="inline-flex items-center gap-2 bg-brass text-gun-950 px-4 py-2 rounded text-sm font-body font-semibold hover:bg-brass-400 transition-colors"
        >
          <Plus size={16} /> New Load
        </Link>
      </div>

      {loads.length === 0 ? (
        <p className="text-center text-gun-500 py-8 font-body">
          No saved loads yet. Create one to reuse across boxes.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {loads.map((load) => (
            <Link
              key={load.id}
              to={`/loads/${load.id}/edit`}
              className="bg-gun-800 border border-gun-700 rounded-lg p-4 hover:bg-gun-750 hover:border-gun-600 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical size={18} className="text-brass" />
                <span className="font-body font-semibold text-gun-100">{load.name || "Unnamed Load"}</span>
              </div>
              <div className="text-sm text-gun-400 font-body space-y-1">
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
