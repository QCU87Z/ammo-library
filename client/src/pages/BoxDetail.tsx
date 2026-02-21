import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import type { AmmoBox, Barrel, Action } from "../../../shared/types";
import StatusBadge from "../components/StatusBadge";
import LoadHistoryTimeline from "../components/LoadHistoryTimeline";
import ConfirmDialog from "../components/ConfirmDialog";
import QRCodeDisplay from "../components/QRCodeDisplay";
import { Edit, Trash2, RotateCcw, ArrowRightLeft } from "lucide-react";

export default function BoxDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [box, setBox] = useState<AmmoBox | null>(null);
  const [barrels, setBarrels] = useState<Barrel[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedBarrel, setSelectedBarrel] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    Promise.all([api.getBox(id), api.getBarrels(), api.getActions()]).then(([b, br, a]) => {
      setBox(b);
      setBarrels(br);
      setActions(a);
      setSelectedBarrel(b.barrelId || "");
      setLoading(false);
    });
  }, [id]);

  async function handleDelete() {
    if (!id) return;
    await api.deleteBox(id);
    navigate("/boxes");
  }

  async function handleToggleStatus() {
    if (!box) return;
    const newStatus = box.status === "active" ? "retired" : "active";
    const updated = await api.updateBoxStatus(box.id, newStatus);
    setBox(updated);
  }

  async function handleAssignBarrel() {
    if (!box) return;
    const updated = await api.assignBarrel(box.id, selectedBarrel || null);
    setBox(updated);
    setAssignOpen(false);
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!box) return <div className="text-center py-12 text-gray-500">Box not found</div>;

  const actionMap = Object.fromEntries(actions.map((a) => [a.id, a.name]));
  const currentBarrel = barrels.find((b) => b.id === box.barrelId);
  const currentBarrelName = currentBarrel
    ? `${currentBarrel.caliber} ${currentBarrel.barrelLength}`.trim()
    : null;

  // Group barrels by action for the dropdown
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
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Box #{box.boxNumber}
            <span className="ml-3 text-base font-normal text-gray-500">
              {box.brand}
            </span>
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <StatusBadge status={box.status} />
            <span className="text-sm text-gray-500">
              {box.numberOfRounds} rounds
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/boxes/${box.id}/edit`}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit size={18} />
          </Link>
          <button
            onClick={() => setDeleteOpen(true)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Link
          to={`/boxes/${box.id}/reload`}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <RotateCcw size={16} /> Reload
        </Link>
        <button
          onClick={() => setAssignOpen(!assignOpen)}
          className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
        >
          <ArrowRightLeft size={16} /> Assign Barrel
        </button>
        <button
          onClick={handleToggleStatus}
          className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
        >
          {box.status === "active" ? "Retire" : "Reactivate"}
        </button>
      </div>

      {/* Assign barrel dropdown */}
      {assignOpen && (
        <div className="bg-gray-50 border rounded-lg p-4 flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Barrel
            </label>
            <select
              value={selectedBarrel}
              onChange={(e) => setSelectedBarrel(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
          <button
            onClick={handleAssignBarrel}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Load */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Current Load</h2>
            {box.currentLoad ? (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-gray-500">Projectile</dt>
                <dd className="font-medium">{box.currentLoad.projectile}</dd>
                <dt className="text-gray-500">Powder</dt>
                <dd className="font-medium">
                  {box.currentLoad.powderCharge} {box.currentLoad.powder}
                </dd>
                <dt className="text-gray-500">Primer</dt>
                <dd className="font-medium">{box.currentLoad.primer}</dd>
                {box.currentLoad.length && (
                  <>
                    <dt className="text-gray-500">Length</dt>
                    <dd className="font-medium">{box.currentLoad.length}</dd>
                  </>
                )}
              </dl>
            ) : (
              <p className="text-sm text-gray-500 italic">No load set</p>
            )}
          </section>

          {currentBarrelName && currentBarrel && (
            <section className="bg-white border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Assigned Barrel</h2>
              <Link
                to={`/barrels/${currentBarrel.id}`}
                className="text-blue-600 hover:underline"
              >
                {currentBarrelName}
              </Link>
            </section>
          )}

          <section className="bg-white border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Load History</h2>
            <LoadHistoryTimeline entries={box.loadHistory} />
          </section>

          {box.barrelHistory.length > 0 && (
            <section className="bg-white border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Barrel History</h2>
              <div className="space-y-2 text-sm">
                {box.barrelHistory.map((h, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-medium">{h.barrelName}</span>
                    <span className="text-gray-400">
                      {new Date(h.assignedDate).toLocaleDateString()}
                      {h.unassignedDate &&
                        ` - ${new Date(h.unassignedDate).toLocaleDateString()}`}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* QR Code sidebar */}
        <div>
          <section className="bg-white border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">QR Code</h2>
            <QRCodeDisplay boxId={box.id} boxNumber={box.boxNumber} />
          </section>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Box"
        message={`Are you sure you want to delete box #${box.boxNumber}? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
