import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { AmmoBox, Components, Load } from "../../../shared/types";

export default function ReloadForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [box, setBox] = useState<AmmoBox | null>(null);
  const [components, setComponents] = useState<Components>({
    powders: [],
    primers: [],
    projectiles: [],
  });
  const [load, setLoad] = useState<Load>({
    powderCharge: "",
    powder: "",
    primer: "",
    projectile: "",
    length: "",
  });
  const [numberOfRounds, setNumberOfRounds] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([api.getBox(id), api.getComponents()]).then(([b, c]) => {
      setBox(b);
      setComponents(c);
      setNumberOfRounds(b.numberOfRounds);
      if (b.currentLoad) {
        setLoad({ ...b.currentLoad });
      }
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    await api.reloadBox(id, { newLoad: load, numberOfRounds, notes: notes || undefined });
    navigate(`/boxes/${id}`);
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!box) return <div className="text-center py-12 text-gray-500">Box not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Reload Box #{box.boxNumber}</h1>
      <p className="text-sm text-gray-500 mb-6">
        The current load will be moved to history. Fill in the new load details below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {box.currentLoad && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
            <p className="font-medium text-amber-800 mb-1">Current load (will be archived):</p>
            <p className="text-amber-700">
              {box.currentLoad.projectile} / {box.currentLoad.powderCharge}{" "}
              {box.currentLoad.powder} / {box.currentLoad.primer}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes about previous load (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Grouped well at 100yds, slightly hot..."
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <hr />

        <h3 className="font-medium">New Load</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Projectile</label>
            <select
              value={load.projectile}
              onChange={(e) => setLoad({ ...load, projectile: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select...</option>
              {components.projectiles.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Powder Charge</label>
            <input
              type="text"
              value={load.powderCharge}
              onChange={(e) => setLoad({ ...load, powderCharge: e.target.value })}
              placeholder="e.g. 42.5gr"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Powder</label>
            <select
              value={load.powder}
              onChange={(e) => setLoad({ ...load, powder: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select...</option>
              {components.powders.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Primer</label>
            <select
              value={load.primer}
              onChange={(e) => setLoad({ ...load, primer: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select...</option>
              {components.primers.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Length</label>
            <input
              type="text"
              value={load.length}
              onChange={(e) => setLoad({ ...load, length: e.target.value })}
              placeholder='e.g. 2.800"'
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Rounds
          </label>
          <input
            type="number"
            value={numberOfRounds}
            onChange={(e) => setNumberOfRounds(parseInt(e.target.value) || 0)}
            min={0}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm max-w-xs"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Save Reload
          </button>
          <button
            type="button"
            onClick={() => navigate(`/boxes/${id}`)}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
