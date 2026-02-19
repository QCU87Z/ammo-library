import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { Barrel, Action, Components, Load, SavedLoad } from "../../../shared/types";

export default function BoxForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [brand, setBrand] = useState("");
  const [boxNumber, setBoxNumber] = useState("");
  const [numberOfRounds, setNumberOfRounds] = useState(0);
  const [barrelId, setBarrelId] = useState("");
  const [hasLoad, setHasLoad] = useState(false);
  const [load, setLoad] = useState<Load>({
    powderCharge: "",
    powder: "",
    primer: "",
    projectile: "",
    length: "",
  });

  const [savedLoads, setSavedLoads] = useState<SavedLoad[]>([]);
  const [barrels, setBarrels] = useState<Barrel[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [components, setComponents] = useState<Components>({
    powders: [],
    primers: [],
    projectiles: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetches: Promise<any>[] = [api.getBarrels(), api.getActions(), api.getComponents(), api.getLoads()];
    if (id) fetches.push(api.getBox(id));

    Promise.all(fetches).then(([br, a, c, sl, box]) => {
      setBarrels(br);
      setActions(a);
      setComponents(c);
      setSavedLoads(sl);
      if (box) {
        setBrand(box.brand);
        setBoxNumber(box.boxNumber);
        setNumberOfRounds(box.numberOfRounds);
        setBarrelId(box.barrelId || "");
        if (box.currentLoad) {
          setHasLoad(true);
          setLoad(box.currentLoad);
        }
      }
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      brand,
      boxNumber,
      numberOfRounds,
      barrelId: barrelId || null,
      currentLoad: hasLoad ? load : null,
    };

    if (isEdit && id) {
      await api.updateBox(id, data);
      navigate(`/boxes/${id}`);
    } else {
      const created = await api.createBox(data);
      navigate(`/boxes/${created.id}`);
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  // Group barrels by action
  const actionMap = Object.fromEntries(actions.map((a) => [a.id, a.name]));
  const barrelsByAction = new Map<string, { actionName: string; barrels: Barrel[] }>();
  const unassignedBarrels: Barrel[] = [];
  for (const b of barrels) {
    if (b.actionId) {
      const group = barrelsByAction.get(b.actionId) || {
        actionName: actionMap[b.actionId] || "Unknown",
        barrels: [],
      };
      group.barrels.push(b);
      barrelsByAction.set(b.actionId, group);
    } else {
      unassignedBarrels.push(b);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Box" : "New Box"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Box Number *
            </label>
            <input
              type="text"
              value={boxNumber}
              onChange={(e) => setBoxNumber(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Rounds
            </label>
            <input
              type="number"
              value={numberOfRounds}
              onChange={(e) => setNumberOfRounds(parseInt(e.target.value) || 0)}
              min={0}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Barrel
            </label>
            <select
              value={barrelId}
              onChange={(e) => setBarrelId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None</option>
              {[...barrelsByAction.entries()].map(([actId, group]) => (
                <optgroup key={actId} label={group.actionName}>
                  {group.barrels.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.caliber} {b.barrelLength}
                    </option>
                  ))}
                </optgroup>
              ))}
              {unassignedBarrels.length > 0 && (
                <optgroup label="Unassigned">
                  {unassignedBarrels.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.caliber} {b.barrelLength}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={hasLoad}
              onChange={(e) => setHasLoad(e.target.checked)}
              className="rounded"
            />
            Set initial load
          </label>
        </div>

        {hasLoad && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm">Load Details</h3>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Use a saved load</label>
              <select
                onChange={(e) => {
                  const sl = savedLoads.find((l) => l.id === e.target.value);
                  if (sl) {
                    setLoad({
                      powderCharge: sl.powderCharge,
                      powder: sl.powder,
                      primer: sl.primer,
                      projectile: sl.projectile,
                      length: sl.length,
                    });
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Custom</option>
                {savedLoads.map((sl) => (
                  <option key={sl.id} value={sl.id}>{sl.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Projectile
                </label>
                <select
                  value={load.projectile}
                  onChange={(e) =>
                    setLoad({ ...load, projectile: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select...</option>
                  {components.projectiles.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Powder Charge
                </label>
                <input
                  type="text"
                  value={load.powderCharge}
                  onChange={(e) =>
                    setLoad({ ...load, powderCharge: e.target.value })
                  }
                  placeholder="e.g. 42.5gr"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Powder
                </label>
                <select
                  value={load.powder}
                  onChange={(e) =>
                    setLoad({ ...load, powder: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select...</option>
                  {components.powders.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Primer
                </label>
                <select
                  value={load.primer}
                  onChange={(e) =>
                    setLoad({ ...load, primer: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select...</option>
                  {components.primers.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Length
                </label>
                <input
                  type="text"
                  value={load.length}
                  onChange={(e) =>
                    setLoad({ ...load, length: e.target.value })
                  }
                  placeholder='e.g. 2.800"'
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            {isEdit ? "Save Changes" : "Create Box"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
