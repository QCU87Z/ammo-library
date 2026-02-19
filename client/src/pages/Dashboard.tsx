import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { AmmoBox, Barrel, Action } from "../../../shared/types";
import { Box, Crosshair, Circle, ScanLine } from "lucide-react";
import SearchBar from "../components/SearchBar";
import BoxCard from "../components/BoxCard";

export default function Dashboard() {
  const [boxes, setBoxes] = useState<AmmoBox[]>([]);
  const [barrels, setBarrels] = useState<Barrel[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getBoxes(), api.getBarrels(), api.getActions()]).then(([b, br, a]) => {
      setBoxes(b);
      setBarrels(br);
      setActions(a);
      setLoading(false);
    });
  }, []);

  const barrelMap = Object.fromEntries(
    barrels.map((b) => [b.id, `${b.caliber} ${b.barrelLength}`.trim()])
  );
  const activeBoxes = boxes.filter((b) => b.status === "active");
  const recentBoxes = [...boxes]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6);

  const filteredBoxes = search
    ? boxes.filter(
        (b) =>
          b.boxNumber.toLowerCase().includes(search.toLowerCase()) ||
          b.brand.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Quick search by box # or brand..."
      />

      {filteredBoxes ? (
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Search Results ({filteredBoxes.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredBoxes.map((box) => (
              <BoxCard key={box.id} box={box} barrelName={barrelMap[box.barrelId || ""]} />
            ))}
          </div>
          {filteredBoxes.length === 0 && (
            <p className="text-gray-500 text-sm">No boxes found.</p>
          )}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard
              label="Total Boxes"
              value={boxes.length}
              icon={<Box size={20} />}
              to="/boxes"
            />
            <StatCard
              label="Active Boxes"
              value={activeBoxes.length}
              icon={<Box size={20} />}
              to="/boxes"
            />
            <StatCard
              label="Actions"
              value={actions.length}
              icon={<Crosshair size={20} />}
              to="/actions"
            />
            <StatCard
              label="Barrels"
              value={barrels.length}
              icon={<Circle size={20} />}
              to="/barrels"
            />
            <Link
              to="/scan"
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3 hover:bg-blue-100 transition-colors"
            >
              <ScanLine size={20} className="text-blue-600" />
              <span className="font-medium text-blue-700">Scan QR</span>
            </Link>
          </div>

          {/* Recent boxes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Recently Updated</h2>
              <Link
                to="/boxes"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentBoxes.map((box) => (
                <BoxCard
                  key={box.id}
                  box={box}
                  barrelName={barrelMap[box.barrelId || ""]}
                />
              ))}
            </div>
            {recentBoxes.length === 0 && (
              <p className="text-gray-500 text-sm">
                No boxes yet.{" "}
                <Link to="/boxes/new" className="text-blue-600 hover:underline">
                  Create one
                </Link>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  to,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  to?: string;
}) {
  const content = (
    <>
      <div className="flex items-center gap-2 text-gray-500 mb-1">
        {icon}
        <span className="text-xs font-medium uppercase">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {content}
    </div>
  );
}
