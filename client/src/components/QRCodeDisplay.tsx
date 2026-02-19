import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  boxId: string;
  boxNumber: string;
}

export default function QRCodeDisplay({ boxId, boxNumber }: QRCodeDisplayProps) {
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/boxes/${boxId}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <QRCodeSVG value={url} size={180} level="M" />
      <p className="text-xs text-gray-500 text-center break-all">{url}</p>
      <p className="text-sm font-medium">Box #{boxNumber}</p>
    </div>
  );
}
