import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { Components } from "../../../shared/types";

export default function LoadForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [powderCharge, setPowderCharge] = useState("");
  const [powder, setPowder] = useState("");
  const [primer, setPrimer] = useState("");
  const [projectile, setProjectile] = useState("");
  const [length, setLength] = useState("");
  const [notes, setNotes] = useState("");
  const [components, setComponents] = useState<Components>({
    powders: [],
    primers: [],
    projectiles: [],
  });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetches: Promise<any>[] = [api.getComponents()];
    if (id) fetches.push(api.getLoad(id));

    Promise.all(fetches).then(([c, load]) => {
      setComponents(c);
      if (load) {
        setName(load.name);
        setPowderCharge(load.powderCharge);
        setPowder(load.powder);
        setPrimer(load.primer);
        setProjectile(load.projectile);
        setLength(load.length);
        setNotes(load.notes);
      }
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = { name, powderCharge, powder, primer, projectile, length, notes };

    if (isEdit && id) {
      await api.updateLoad(id, data);
    } else {
      await api.createLoad(data);
    }
    navigate("/loads");
  }

  async function handleDelete() {
    if (!id || !confirm("Delete this saved load?")) return;
    setDeleting(true);
    await api.deleteLoad(id);
    navigate("/loads");
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Saved Load" : "New Saved Load"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='e.g. "168gr SMK / 42.5gr Varget"'
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Projectile</label>
            <select
              value={projectile}
              onChange={(e) => setProjectile(e.target.value)}
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
              value={powderCharge}
              onChange={(e) => setPowderCharge(e.target.value)}
              placeholder="e.g. 42.5gr"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Powder</label>
            <select
              value={powder}
              onChange={(e) => setPowder(e.target.value)}
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
              value={primer}
              onChange={(e) => setPrimer(e.target.value)}
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
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder='e.g. 2.800"'
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Any notes about this load recipe..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            {isEdit ? "Save Changes" : "Create Load"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/loads")}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Cancel
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="ml-auto bg-red-50 text-red-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-100"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
