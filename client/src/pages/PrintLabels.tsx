import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { AmmoBox, Barrel } from "../../../shared/types";
import PrintableLabel from "../components/PrintableLabel";
import { Printer } from "lucide-react";

export default function PrintLabels() {
  const [boxes, setBoxes] = useState<AmmoBox[]>([]);
  const [barrels, setBarrels] = useState<Barrel[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getBoxes(), api.getBarrels()]).then(([b, br]) => {
      setBoxes(b);
      setBarrels(br);
      setLoading(false);
    });
  }, []);

  const barrelMap = Object.fromEntries(
    barrels.map((b) => [b.id, `${b.caliber} ${b.barrelLength}`.trim()])
  );

  function toggleBox(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function selectAll() {
    if (selected.size === boxes.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(boxes.map((b) => b.id)));
    }
  }

  const selectedBoxes = boxes.filter((b) => selected.has(b.id));

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold">Print Labels</h1>
        <button
          onClick={() => window.print()}
          disabled={selectedBoxes.length === 0}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Printer size={16} /> Print ({selectedBoxes.length})
        </button>
      </div>

      {/* Box selection */}
      <div className="print:hidden">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={selectAll}
            className="text-sm text-blue-600 hover:underline"
          >
            {selected.size === boxes.length ? "Deselect all" : "Select all"}
          </button>
          <span className="text-sm text-gray-500">
            {selected.size} of {boxes.length} selected
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {boxes.map((box) => (
            <label
              key={box.id}
              className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer text-sm ${
                selected.has(box.id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={selected.has(box.id)}
                onChange={() => toggleBox(box.id)}
                className="rounded"
              />
              <span>
                #{box.boxNumber}{" "}
                <span className="text-gray-500">{box.brand}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Print preview / actual print area */}
      {selectedBoxes.length > 0 && (
        <div className="print:m-0">
          <h2 className="text-lg font-semibold mb-3 print:hidden">Preview</h2>
          <div
            className="bg-white border print:border-none"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 2.625in)",
              gridAutoRows: "1in",
              gap: "0",
              padding: "0.5in 0.1875in",
              width: "8.5in",
            }}
          >
            {selectedBoxes.map((box) => (
              <PrintableLabel
                key={box.id}
                box={box}
                barrelName={barrelMap[box.barrelId || ""]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
