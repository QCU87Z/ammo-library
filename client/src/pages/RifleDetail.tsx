import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api, type RifleDetail as RifleDetailData } from "../api/client";
import BoxCard from "../components/BoxCard";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  Edit,
  Trash2,
  Target,
  Plus,
  Crosshair,
  Circle,
  FlaskConical,
  Box as BoxIcon,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export default function RifleDetail() {
  const { barrelId } = useParams<{ barrelId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<RifleDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!barrelId) return;
    api.getRifle(barrelId).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [barrelId]);

  async function handleDelete() {
    if (!barrelId) return;
    try {
      await api.deleteBarrel(barrelId);
      navigate("/");
    } catch (err: any) {
      setDeleteError(err.message);
      setDeleteOpen(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="font-mono text-xs tracking-[0.25em] text-gun-500 uppercase">Loading...</span>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="font-mono text-xs tracking-[0.25em] text-gun-500 uppercase">Rifle not found</span>
      </div>
    );
  }

  const { barrel, action, roundCount, boxes, matchingLoads, loadsInRotation, elevations } = data;
  const rifleName = [action?.name, barrel.caliber].filter(Boolean).join(" · ") || "Rifle";

  // Group elevations by load
  const loadById = new Map(matchingLoads.map((l) => [l.id, l]));
  const elevByLoad = new Map<string, typeof elevations>();
  for (const e of elevations) {
    if (!elevByLoad.has(e.loadId)) elevByLoad.set(e.loadId, []);
    elevByLoad.get(e.loadId)!.push(e);
  }

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-gun-500 tracking-[0.18em] uppercase">
        <Link to="/" className="hover:text-brass transition-colors flex items-center gap-1.5">
          <ArrowLeft size={11} /> Rifles
        </Link>
        <ChevronRight size={11} />
        <span className="text-gun-400">{rifleName.toUpperCase()}</span>
      </div>

      {/* Hero header — the rifle dossier plate */}
      <header className="relative border border-gun-700 bg-gun-800 rounded-lg overflow-hidden">
        {/* Top label strip */}
        <div className="px-5 py-2 bg-gun-950 border-b border-gun-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-mono text-gun-500 tracking-[0.22em] uppercase">
            <Crosshair size={11} className="text-brass" />
            Rifle Manifest
          </div>
          <div className="flex items-center gap-1">
            <Link
              to={`/rifles/${barrel.id}/edit`}
              className="p-2 text-gun-500 hover:text-brass transition-colors"
              aria-label="Edit rifle"
            >
              <Edit size={15} />
            </Link>
            <button
              onClick={() => setDeleteOpen(true)}
              className="p-2 text-gun-500 hover:text-red-400 transition-colors"
              aria-label="Delete rifle"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Headline */}
        <div className="px-6 pt-6 pb-5">
          <div className="flex items-baseline gap-4 flex-wrap">
            {action ? (
              <Link
                to={`/actions/${action.id}`}
                className="font-mono text-[11px] text-gun-400 tracking-[0.25em] uppercase hover:text-brass transition-colors"
              >
                {action.name}
              </Link>
            ) : (
              <span className="font-mono text-[11px] text-gun-500 tracking-[0.25em] uppercase">
                Unassigned action
              </span>
            )}
            <span className="text-gun-700">·</span>
            <span className="font-mono text-[11px] text-gun-500 tracking-[0.25em] uppercase">
              Barrel SN {barrel.serialNumber || "—"}
            </span>
          </div>
          <h1 className="mt-2 font-display text-6xl tracking-widest text-gun-100 leading-none">
            {barrel.caliber || "—"}
          </h1>
          {barrel.barrelLength && (
            <p className="mt-1 font-mono text-sm text-gun-400">
              {barrel.barrelLength}" barrel
            </p>
          )}
        </div>

        {/* Spec plate */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gun-700 border-t border-gun-700">
          <PlateCell label="Rounds" value={roundCount.toLocaleString()} accent />
          <PlateCell label="Twist" value={barrel.twistRate || "—"} />
          <PlateCell label="Zero" value={barrel.zeroDistance ? `${barrel.zeroDistance}m` : "—"} />
          <PlateCell label="Scope" value={action?.scopeDetails || "—"} />
        </div>

        {barrel.notes && (
          <div className="px-6 py-4 border-t border-gun-700 bg-gun-900/40">
            <span className="text-[10px] font-mono text-gun-500 tracking-[0.18em] uppercase">Notes</span>
            <p className="mt-1 text-sm font-body text-gun-300 whitespace-pre-wrap">{barrel.notes}</p>
          </div>
        )}
      </header>

      {deleteError && (
        <div className="border border-red-900/60 bg-red-950/30 text-red-300 rounded-lg px-4 py-3 text-sm font-mono">
          {deleteError}
        </div>
      )}

      {/* Ammo */}
      <Section
        icon={<BoxIcon size={13} />}
        title="Ammunition"
        meta={`${boxes.length} ${boxes.length === 1 ? "box" : "boxes"}`}
        action={
          <Link
            to={`/boxes/new?barrelId=${barrel.id}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-brass hover:text-brass-light tracking-[0.18em] uppercase transition-colors"
          >
            <Plus size={12} /> Add Box
          </Link>
        }
      >
        {boxes.length === 0 ? (
          <EmptyHint>No boxes assigned. Add a box to start tracking ammunition.</EmptyHint>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {boxes.map((box) => (
              <BoxCard key={box.id} box={box} barrelName={`${barrel.caliber} ${barrel.barrelLength}`.trim()} />
            ))}
          </div>
        )}
      </Section>

      {/* Loads in rotation */}
      <Section
        icon={<FlaskConical size={13} />}
        title="Loads in Rotation"
        meta={`${loadsInRotation.length} active`}
      >
        {loadsInRotation.length === 0 ? (
          <EmptyHint>No loads in any assigned box.</EmptyHint>
        ) : (
          <div className="border border-gun-700 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gun-900/60 text-[10px] font-mono text-gun-500 tracking-[0.18em] uppercase">
                <tr>
                  <th className="text-left px-4 py-2.5">Projectile</th>
                  <th className="text-left px-4 py-2.5 hidden sm:table-cell">Powder</th>
                  <th className="text-right px-4 py-2.5">Charge</th>
                  <th className="text-right px-4 py-2.5 hidden md:table-cell">COAL</th>
                  <th className="text-right px-4 py-2.5">Boxes</th>
                  <th className="text-right px-4 py-2.5">Rounds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gun-700">
                {loadsInRotation.map((row, i) => (
                  <tr key={i} className="hover:bg-gun-800/60 transition-colors">
                    <td className="px-4 py-3 text-gun-100 font-body">{row.load.projectile}</td>
                    <td className="px-4 py-3 text-gun-400 font-body hidden sm:table-cell">
                      {row.load.powder}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-brass-light">
                      {row.load.powderCharge}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gun-300 hidden md:table-cell">
                      {row.load.length}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gun-200">{row.boxCount}</td>
                    <td className="px-4 py-3 text-right font-mono text-gun-100 font-semibold">
                      {row.roundCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Load library for this caliber */}
      <Section
        icon={<FlaskConical size={13} />}
        title="Load Library"
        meta={barrel.caliber ? `${barrel.caliber.toUpperCase()} · ${matchingLoads.length}` : `${matchingLoads.length}`}
        action={
          <Link
            to={`/loads/new${barrel.caliber ? `?caliber=${encodeURIComponent(barrel.caliber)}` : ""}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-brass hover:text-brass-light tracking-[0.18em] uppercase transition-colors"
          >
            <Plus size={12} /> New Load
          </Link>
        }
      >
        {matchingLoads.length === 0 ? (
          <EmptyHint>
            No saved loads match this caliber{barrel.caliber ? ` (${barrel.caliber})` : ""}.
          </EmptyHint>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {matchingLoads.map((l) => (
              <Link
                key={l.id}
                to={`/loads/${l.id}/edit`}
                className="block bg-gun-800 border border-gun-700 rounded-lg p-4 hover:bg-gun-750 hover:border-gun-600 transition-all"
              >
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <span className="font-body font-semibold text-gun-100">{l.name}</span>
                  <span className="font-mono text-sm text-brass-light shrink-0">{l.powderCharge}</span>
                </div>
                <p className="text-xs text-gun-400 font-body truncate">{l.projectile}</p>
                <div className="mt-2 flex items-center gap-3 text-[10px] font-mono text-gun-500 tracking-[0.12em] uppercase">
                  <span>{l.powder}</span>
                  <span>·</span>
                  <span>{l.primer}</span>
                  {l.length && (
                    <>
                      <span>·</span>
                      <span>COAL {l.length}</span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* DOPE */}
      <Section
        icon={<Target size={13} />}
        title="DOPE"
        meta={`${elevations.length} entries`}
        action={
          <Link
            to={`/elevations/new?barrelId=${barrel.id}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-brass hover:text-brass-light tracking-[0.18em] uppercase transition-colors"
          >
            <Plus size={12} /> Add Entry
          </Link>
        }
      >
        {elevations.length === 0 ? (
          <EmptyHint>No elevation data recorded for this rifle.</EmptyHint>
        ) : (
          <DopeBlock elevations={elevations} matchingLoads={matchingLoads} loadById={loadById} elevByLoad={elevByLoad} />
        )}
      </Section>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Rifle"
        message={`Are you sure you want to delete this rifle (${rifleName})? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}

function PlateCell({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="px-5 py-4">
      <div className="text-[9px] font-mono text-gun-500 tracking-[0.22em] uppercase mb-1.5 flex items-center gap-1.5">
        <Circle size={6} className={accent ? "text-brass fill-brass" : "text-gun-600"} />
        {label}
      </div>
      <div
        className={`font-mono text-lg font-semibold leading-none ${
          accent ? "text-brass-light" : "text-gun-100"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  meta,
  action,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  meta?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 text-brass shrink-0">
          {icon}
          <h2 className="font-display text-2xl tracking-[0.18em] text-gun-100 leading-none">
            {title.toUpperCase()}
          </h2>
        </div>
        {meta && (
          <span className="text-[10px] font-mono text-gun-500 tracking-[0.18em] uppercase shrink-0">
            {meta}
          </span>
        )}
        <div className="h-px flex-1 bg-gun-700" />
        {action}
      </div>
      {children}
    </section>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-mono text-gun-500 tracking-[0.05em] py-4 border border-dashed border-gun-700 rounded text-center">
      {children}
    </p>
  );
}

function DopeBlock({
  elevations,
  matchingLoads,
  loadById,
  elevByLoad,
}: {
  elevations: import("../../../shared/types").Elevation[];
  matchingLoads: import("../../../shared/types").SavedLoad[];
  loadById: Map<string, import("../../../shared/types").SavedLoad>;
  elevByLoad: Map<string, import("../../../shared/types").Elevation[]>;
}) {
  // Order: loads that match this barrel's caliber first, then any other loadIds used
  const loadOrder: string[] = [];
  for (const l of matchingLoads) {
    if (elevByLoad.has(l.id)) loadOrder.push(l.id);
  }
  for (const e of elevations) {
    if (!loadOrder.includes(e.loadId)) loadOrder.push(e.loadId);
  }

  return (
    <div className="space-y-5">
      {loadOrder.map((loadId) => {
        const load = loadById.get(loadId);
        const entries = (elevByLoad.get(loadId) ?? []).sort((a, b) => a.distanceM - b.distanceM);
        return (
          <div key={loadId} className="border border-gun-700 rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-gun-900/60 border-b border-gun-700 flex items-baseline justify-between gap-3">
              <span className="font-body font-semibold text-gun-100 text-sm">
                {load?.name ?? "Unknown load"}
              </span>
              {load && (
                <span className="text-[10px] font-mono text-gun-500 tracking-[0.12em] uppercase truncate">
                  {load.powderCharge} · {load.projectile}
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 divide-x divide-gun-700">
              {entries.map((e) => (
                <Link
                  key={e.id}
                  to={`/elevations/${e.id}/edit`}
                  className="px-3 py-3 text-center hover:bg-gun-800 transition-colors group"
                >
                  <div className="text-[10px] font-mono text-gun-300 tracking-[0.18em] uppercase mb-1">
                    {e.distanceM}m
                  </div>
                  <div className="font-mono text-xl text-brass-light font-semibold leading-none group-hover:text-brass transition-colors">
                    {e.moa.toFixed(2)}
                  </div>
                  <div className="text-[9px] font-mono text-gun-400 tracking-[0.1em] uppercase mt-1.5">
                    MOA
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
