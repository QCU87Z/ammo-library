import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import type { Action, Barrel } from "../../../shared/types";
import ConfirmDialog from "../components/ConfirmDialog";
import { Edit, Trash2, Plus, Circle } from "lucide-react";

export default function ActionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [action, setAction] = useState<(Action & { barrels: Barrel[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!id) return;
    api.getAction(id).then((a) => {
      setAction(a);
      setLoading(false);
    });
  }, [id]);

  async function handleDelete() {
    if (!id) return;
    try {
      await api.deleteAction(id);
      navigate("/actions");
    } catch (err: any) {
      setDeleteError(err.message);
      setDeleteOpen(false);
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!action) return <div className="text-center py-12 text-gray-500">Action not found</div>;

  const fields = [
    ["Serial Number", action.serialNumber],
    ["Scope", action.scopeDetails],
  ].filter(([, v]) => v);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold">{action.name}</h1>
        <div className="flex gap-2">
          <Link
            to={`/actions/${action.id}/edit`}
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

      {deleteError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {deleteError}
        </div>
      )}

      {fields.length > 0 && (
        <section className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Details</h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt className="text-gray-500">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {action.notes && (
        <section className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Notes</h2>
          <p className="text-sm whitespace-pre-wrap">{action.notes}</p>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">
            Barrels ({action.barrels.length})
          </h2>
          <Link
            to={`/actions/${action.id}/barrels/new`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus size={14} /> Add Barrel
          </Link>
        </div>
        {action.barrels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {action.barrels.map((barrel) => (
              <Link
                key={barrel.id}
                to={`/barrels/${barrel.id}`}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Circle size={14} className="text-gray-400" />
                  <span className="font-semibold">{barrel.caliber}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {barrel.barrelLength && <p>Length: {barrel.barrelLength}</p>}
                  {barrel.twistRate && <p>Twist: {barrel.twistRate}</p>}
                  {barrel.zeroDistance && <p>Zero: {barrel.zeroDistance}</p>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No barrels attached to this action.</p>
        )}
      </section>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Action"
        message={`Are you sure you want to delete ${action.name}? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
