import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Cartridge } from "../../../shared/types";
import { Plus, Package } from "lucide-react";

export default function CartridgeList() {
  const [cartridges, setCartridges] = useState<Cartridge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCartridges().then((c) => {
      setCartridges(c);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-12 text-gun-500">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl tracking-widest text-gun-100">CARTRIDGES</h1>
        <Link
          to="/cartridges/new"
          className="inline-flex items-center gap-2 bg-brass text-gun-950 px-4 py-2 rounded text-sm font-body font-semibold hover:bg-brass-400 transition-colors"
        >
          <Plus size={16} /> New Cartridge
        </Link>
      </div>

      {cartridges.length === 0 ? (
        <p className="text-center text-gun-500 py-8 font-body">
          No cartridges yet. Add one to start tracking DOPE data.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cartridges.map((c) => (
            <Link
              key={c.id}
              to={`/cartridges/${c.id}/edit`}
              className="bg-gun-900 border border-gun-700 rounded-lg p-4 hover:border-brass transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <Package size={16} className="text-brass shrink-0" />
                <span className="font-body font-semibold text-gun-100">{c.name || "Unnamed"}</span>
              </div>
              <div className="text-sm text-gun-400 font-body space-y-1">
                {c.brand && <p>{c.brand}</p>}
                <div className="flex gap-4 font-mono text-xs text-gun-300">
                  {c.bulletWeight != null && (
                    <span>{c.bulletWeight} gr</span>
                  )}
                  {c.muzzleVelocity != null && (
                    <span>{c.muzzleVelocity} fps</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
