import { QRCodeSVG } from "qrcode.react";
import type { AmmoBox } from "../../../shared/types";

interface PrintableLabelProps {
  box: AmmoBox;
  barrelName?: string;
}

export default function PrintableLabel({ box, barrelName }: PrintableLabelProps) {
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/boxes/${box.id}`;

  return (
    <div className="flex items-center gap-2 p-1" style={{ width: "2.625in", height: "1in" }}>
      <QRCodeSVG value={url} size={68} level="L" />
      <div className="flex-1 min-w-0 text-[10px] leading-tight">
        <p className="font-bold text-xs">#{box.boxNumber}</p>
        <p>{box.brand}</p>
        {barrelName && <p>{barrelName}</p>}
        {box.currentLoad && (
          <p className="truncate">
            {box.currentLoad.projectile} / {box.currentLoad.powderCharge}
          </p>
        )}
      </div>
    </div>
  );
}
