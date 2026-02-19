import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import type { Barrel, AmmoBox, Action } from "../../../shared/types";
import BoxCard from "../components/BoxCard";
import ConfirmDialog from "../components/ConfirmDialog";
import { Edit, Trash2 } from "lucide-react";

export default function BarrelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [barrel, setBarrel] = useState<(Barrel & { boxes: AmmoBox[] }) | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!id) return;
    api.getBarrel(id).then(async (b) => {
      setBarrel(b);
      if (b.actionId) {
        try {
          const a = await api.getAction(b.actionId);
          setAction(a);
        } catch { /* action may not exist */ }
      }
      setLoading(false);
    });
  }, [id]);

  async function handleDelete() {
    if (!id) return;
    try {
      await api.deleteBarrel(id);
      if (barrel?.actionId) {
        navigate(`/actions/${barrel.actionId}`);
      } else {
        navigate("/actions");
      }
    } catch (err: any) {
      setDeleteError(err.message);
      setDeleteOpen(false);
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!barrel) return <div className="text-center py-12 text-gray-500">Barrel not found</div>;

  const barrelName = `${barrel.caliber} ${barrel.barrelLength}`.trim();
  const fields = [
    ["Serial Number", barrel.serialNumber],
    ["Caliber", barrel.caliber],
    ["Barrel Length", barrel.barrelLength],
    ["Twist Rate", barrel.twistRate],
    ["Zero Distance", barrel.zeroDistance],
  ].filter(([, v]) => v);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{barrelName || "Barrel"}</h1>
          {action && (
            <p className="text-sm text-gray-500 mt-1">
              on{" "}
              <Link to={`/actions/${action.id}`} className="text-blue-600 hover:underline">
                {action.name}
              </Link>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            to={`/barrels/${barrel.id}/edit`}
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
        {barrel.notes && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Notes</p>
            <p className="text-sm mt-1 whitespace-pre-wrap">{barrel.notes}</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">
          Assigned Boxes ({barrel.boxes.length})
        </h2>
        {barrel.boxes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {barrel.boxes.map((box) => (
              <BoxCard key={box.id} box={box} barrelName={barrelName} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No boxes assigned to this barrel.</p>
        )}
      </section>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Barrel"
        message={`Are you sure you want to delete this barrel (${barrelName})? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
