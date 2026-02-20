import { Link } from "react-router-dom";
import type { AmmoBox } from "../../../shared/types";
import StatusBadge from "./StatusBadge";

interface BoxCardProps {
  box: AmmoBox;
  barrelName?: string;
}

export default function BoxCard({ box, barrelName }: BoxCardProps) {
  return (
    <Link
      to={`/boxes/${box.id}`}
      className={`block bg-gun-800 rounded p-4 transition-all hover:bg-gun-750 hover:shadow-lg hover:shadow-black/30 group ${
        box.status === "active"
          ? "border border-gun-700 border-l-2 border-l-brass"
          : "border border-gun-700 opacity-60 hover:opacity-80"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="font-mono text-base font-semibold text-gun-100">
            <span className="text-gun-500 text-xs">#</span>
            {box.boxNumber}
          </span>
          <span className="ml-2 text-[10px] text-gun-500 font-body uppercase tracking-widest">
            {box.brand}
          </span>
        </div>
        <StatusBadge status={box.status} />
      </div>
      <div className="space-y-1">
        <p className="font-mono text-brass-light text-lg font-semibold leading-none">
          {box.numberOfRounds}
          <span className="text-gun-500 text-xs font-body ml-1 font-normal">rds</span>
        </p>
        {barrelName && (
          <p className="text-xs text-gun-400 font-body">{barrelName}</p>
        )}
        {box.currentLoad && (
          <p className="text-xs text-gun-500 font-body truncate">
            {box.currentLoad.projectile} · {box.currentLoad.powderCharge}{" "}
            {box.currentLoad.powder}
          </p>
        )}
      </div>
    </Link>
  );
}
