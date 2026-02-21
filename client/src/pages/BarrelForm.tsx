import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { Action } from "../../../shared/types";

export default function BarrelForm() {
  const { id, actionId: routeActionId } = useParams<{ id: string; actionId: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [actionId, setActionId] = useState(routeActionId || "");
  const [serialNumber, setSerialNumber] = useState("");
  const [caliber, setCaliber] = useState("");
  const [barrelLength, setBarrelLength] = useState("");
  const [twistRate, setTwistRate] = useState("");
  const [zeroDistance, setZeroDistance] = useState("");
  const [notes, setNotes] = useState("");
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetches: Promise<any>[] = [api.getActions()];
    if (id) fetches.push(api.getBarrel(id));

    Promise.all(fetches).then(([a, barrel]) => {
      setActions(a);
      if (barrel) {
        setActionId(barrel.actionId || "");
        setSerialNumber(barrel.serialNumber);
        setCaliber(barrel.caliber);
        setBarrelLength(barrel.barrelLength);
        setTwistRate(barrel.twistRate);
        setZeroDistance(barrel.zeroDistance);
        setNotes(barrel.notes);
      }
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      actionId: actionId || null,
      serialNumber, caliber, barrelLength, twistRate, zeroDistance, notes,
    };

    if (isEdit && id) {
      await api.updateBarrel(id, data);
      navigate(`/barrels/${id}`);
    } else {
      const created = await api.createBarrel(data);
      navigate(`/barrels/${created.id}`);
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  const fields = [
    { label: "Caliber *", value: caliber, set: setCaliber, required: true, placeholder: "e.g. .308 Win" },
    { label: "Barrel Length", value: barrelLength, set: setBarrelLength, placeholder: 'e.g. 24"' },
    { label: "Twist Rate", value: twistRate, set: setTwistRate, placeholder: "e.g. 1:10" },
    { label: "Zero Distance", value: zeroDistance, set: setZeroDistance, placeholder: "e.g. 100yds" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Barrel" : "New Barrel"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Action
          </label>
          <select
            value={actionId}
            onChange={(e) => setActionId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Unassigned</option>
            {actions.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Serial Number
          </label>
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {fields.map(({ label, value, set, required, placeholder }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => set(e.target.value)}
                required={required}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            {isEdit ? "Save Changes" : "Create Barrel"}
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
