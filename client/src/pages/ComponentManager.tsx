import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Components } from "../../../shared/types";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

const TYPES = [
  { key: "powders" as const, label: "Powders" },
  { key: "primers" as const, label: "Primers" },
  { key: "projectiles" as const, label: "Projectiles" },
];

export default function ComponentManager() {
  const [components, setComponents] = useState<Components>({
    powders: [],
    primers: [],
    projectiles: [],
  });
  const [loading, setLoading] = useState(true);
  const [newItems, setNewItems] = useState<Record<string, string>>({
    powders: "",
    primers: "",
    projectiles: "",
  });
  const [editing, setEditing] = useState<{
    type: string;
    index: number;
    value: string;
  } | null>(null);

  useEffect(() => {
    api.getComponents().then((c) => {
      setComponents(c);
      setLoading(false);
    });
  }, []);

  async function handleAdd(type: string) {
    const name = newItems[type]?.trim();
    if (!name) return;
    const updated = await api.addComponent(type, name);
    setComponents(updated);
    setNewItems({ ...newItems, [type]: "" });
  }

  async function handleRename() {
    if (!editing) return;
    const updated = await api.updateComponent(
      editing.type,
      editing.index,
      editing.value
    );
    setComponents(updated);
    setEditing(null);
  }

  async function handleDelete(type: string, index: number) {
    const updated = await api.deleteComponent(type, index);
    setComponents(updated);
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Components</h1>
      <p className="text-sm text-gray-500">
        Manage your reloading components. These appear as dropdown options when creating loads.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TYPES.map(({ key, label }) => (
          <div key={key} className="bg-white border rounded-lg p-4">
            <h2 className="font-semibold mb-3">{label}</h2>

            <ul className="space-y-1 mb-3">
              {components[key].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-gray-50 group"
                >
                  {editing?.type === key && editing.index === idx ? (
                    <div className="flex items-center gap-1 flex-1">
                      <input
                        type="text"
                        value={editing.value}
                        onChange={(e) =>
                          setEditing({ ...editing, value: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRename();
                          if (e.key === "Escape") setEditing(null);
                        }}
                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                        autoFocus
                      />
                      <button
                        onClick={handleRename}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{item}</span>
                      <div className="hidden group-hover:flex gap-1">
                        <button
                          onClick={() =>
                            setEditing({ type: key, index: idx, value: item })
                          }
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(key, idx)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
              {components[key].length === 0 && (
                <li className="text-sm text-gray-400 italic py-1">None yet</li>
              )}
            </ul>

            <div className="flex gap-2">
              <input
                type="text"
                value={newItems[key]}
                onChange={(e) =>
                  setNewItems({ ...newItems, [key]: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd(key);
                }}
                placeholder={`Add ${label.toLowerCase().slice(0, -1)}...`}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
              />
              <button
                onClick={() => handleAdd(key)}
                className="bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
