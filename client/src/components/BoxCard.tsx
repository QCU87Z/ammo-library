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
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-lg font-bold text-gray-900">#{box.boxNumber}</span>
          <span className="ml-2 text-sm text-gray-500">{box.brand}</span>
        </div>
        <StatusBadge status={box.status} />
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <p>{box.numberOfRounds} rounds</p>
        {barrelName && <p>Barrel: {barrelName}</p>}
        {box.currentLoad && (
          <p className="text-xs text-gray-500">
            {box.currentLoad.projectile} / {box.currentLoad.powderCharge}{" "}
            {box.currentLoad.powder}
          </p>
        )}
      </div>
    </Link>
  );
}
