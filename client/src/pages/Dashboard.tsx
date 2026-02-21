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
    return (
      <div className="flex items-center justify-center py-24">
        <span className="font-mono text-xs tracking-[0.25em] text-gun-500 uppercase">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-5xl tracking-widest text-gun-100 leading-none">
          DASHBOARD
        </h1>
        <div className="mt-2 h-px bg-gun-700" />
        <p className="mt-1 text-[10px] font-mono text-gun-600 tracking-[0.25em] uppercase">
          Ammunition Tracking System
        </p>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by box number or brand..."
      />

      {filteredBoxes ? (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-mono tracking-[0.2em] text-gun-500 uppercase">
              Results
            </span>
            <span className="font-mono text-xs text-brass">{filteredBoxes.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredBoxes.map((box) => (
              <BoxCard key={box.id} box={box} barrelName={barrelMap[box.barrelId || ""]} />
            ))}
          </div>
          {filteredBoxes.length === 0 && (
            <p className="text-gun-500 text-sm font-mono py-8 text-center">No boxes found.</p>
          )}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <StatCard label="Total Boxes" value={boxes.length} icon={<Box size={14} />} to="/boxes" />
            <StatCard
              label="Active"
              value={activeBoxes.length}
              icon={<Box size={14} />}
              to="/boxes"
              accent
            />
            <StatCard
              label="Actions"
              value={actions.length}
              icon={<Crosshair size={14} />}
              to="/actions"
            />
            <StatCard
              label="Barrels"
              value={barrels.length}
              icon={<Circle size={14} />}
              to="/barrels"
            />
            <Link
              to="/scan"
              className="bg-gun-800 border border-brass/25 rounded p-4 flex items-center gap-3 hover:bg-gun-750 hover:border-brass/50 transition-all"
            >
              <ScanLine size={14} className="text-brass" />
              <span className="text-xs font-body font-medium text-brass">Scan QR</span>
            </Link>
          </div>

          {/* Recent boxes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-gun-500 uppercase">
                Recently Updated
              </span>
              <Link
                to="/boxes"
                className="text-[10px] font-mono text-gun-500 hover:text-brass transition-colors tracking-[0.15em] uppercase"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentBoxes.map((box) => (
                <BoxCard key={box.id} box={box} barrelName={barrelMap[box.barrelId || ""]} />
              ))}
            </div>
            {recentBoxes.length === 0 && (
              <div className="text-center py-12 border border-dashed border-gun-700 rounded">
                <p className="text-gun-500 text-xs font-mono mb-3">No boxes yet.</p>
                <Link
                  to="/boxes/new"
                  className="text-[10px] font-mono text-brass hover:text-brass-light tracking-[0.2em] uppercase transition-colors"
                >
                  Create One →
                </Link>
              </div>
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
  accent = false,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  to?: string;
  accent?: boolean;
}) {
  const content = (
    <>
      <div className={`flex items-center gap-2 mb-2 ${accent ? "text-brass" : "text-gun-500"}`}>
        {icon}
        <span className="text-[10px] font-mono tracking-[0.15em] uppercase">{label}</span>
      </div>
      <div
        className={`text-3xl font-mono font-semibold leading-none ${
          accent ? "text-brass-light" : "text-gun-100"
        }`}
      >
        {value}
      </div>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`rounded p-4 transition-all hover:shadow-lg hover:shadow-black/30 ${
          accent
            ? "bg-gun-800 border border-brass/25 hover:border-brass/50 hover:bg-gun-750"
            : "bg-gun-800 border border-gun-700 hover:bg-gun-750"
        }`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="bg-gun-800 border border-gun-700 rounded p-4">{content}</div>
  );
}
