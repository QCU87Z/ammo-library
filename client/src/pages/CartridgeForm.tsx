import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function CartridgeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [bulletWeight, setBulletWeight] = useState("");
  const [muzzleVelocity, setMuzzleVelocity] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getCartridge(id).then((c) => {
      setName(c.name);
      setBrand(c.brand);
      setBulletWeight(c.bulletWeight != null ? String(c.bulletWeight) : "");
      setMuzzleVelocity(c.muzzleVelocity != null ? String(c.muzzleVelocity) : "");
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const data = {
      name,
      brand,
      bulletWeight: bulletWeight !== "" ? Number(bulletWeight) : null,
      muzzleVelocity: muzzleVelocity !== "" ? Number(muzzleVelocity) : null,
    };
    try {
      if (isEdit && id) {
        await api.updateCartridge(id, data);
      } else {
        await api.createCartridge(data);
      }
      navigate("/cartridges");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!id || !confirm("Delete this cartridge?")) return;
    setDeleting(true);
    setError("");
    try {
      await api.deleteCartridge(id);
      navigate("/cartridges");
    } catch (err: any) {
      setError(err.message);
      setDeleting(false);
    }
  }

  if (loading) return <div className="text-center py-12 text-gun-500">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl tracking-widest text-gun-100 mb-6">
        {isEdit ? "EDIT CARTRIDGE" : "NEW CARTRIDGE"}
      </h1>

      {error && (
        <div className="mb-4 bg-red-900/30 border border-red-700 text-red-400 rounded-lg p-3 text-sm font-body">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-body font-medium text-gun-400 mb-1 uppercase tracking-wider">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='e.g. "Federal GM 175gr"'
            className="w-full bg-gun-800 border border-gun-600 rounded px-3 py-2 text-sm font-body text-gun-100 focus:outline-none focus:border-brass"
          />
        </div>

        <div>
          <label className="block text-xs font-body font-medium text-gun-400 mb-1 uppercase tracking-wider">
            Brand
          </label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. Federal, Hornady, Berger"
            className="w-full bg-gun-800 border border-gun-600 rounded px-3 py-2 text-sm font-body text-gun-100 focus:outline-none focus:border-brass"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-body font-medium text-gun-400 mb-1 uppercase tracking-wider">
              Bullet Weight
            </label>
            <div className="relative">
              <input
                type="number"
                value={bulletWeight}
                onChange={(e) => setBulletWeight(e.target.value)}
                placeholder="175"
                min="0"
                step="any"
                className="w-full bg-gun-800 border border-gun-600 rounded px-3 py-2 pr-10 text-sm font-mono text-gun-100 focus:outline-none focus:border-brass"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gun-500 font-mono">gr</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-gun-400 mb-1 uppercase tracking-wider">
              Muzzle Velocity
            </label>
            <div className="relative">
              <input
                type="number"
                value={muzzleVelocity}
                onChange={(e) => setMuzzleVelocity(e.target.value)}
                placeholder="2650"
                min="0"
                step="any"
                className="w-full bg-gun-800 border border-gun-600 rounded px-3 py-2 pr-12 text-sm font-mono text-gun-100 focus:outline-none focus:border-brass"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gun-500 font-mono">fps</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-brass text-gun-950 px-6 py-2 rounded text-sm font-body font-semibold hover:bg-brass-400 transition-colors"
          >
            {isEdit ? "Save Changes" : "Create Cartridge"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/cartridges")}
            className="bg-gun-800 text-gun-300 px-6 py-2 rounded text-sm font-body font-medium hover:bg-gun-700 transition-colors"
          >
            Cancel
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="ml-auto bg-red-900/30 text-red-400 px-6 py-2 rounded text-sm font-body font-medium hover:bg-red-900/50 transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
