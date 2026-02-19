import { Scanner } from "@yudiel/react-qr-scanner";

interface QRScannerProps {
  onScan: (url: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  return (
    <div className="max-w-sm mx-auto">
      <Scanner
        onScan={(result) => {
          if (result && result.length > 0) {
            onScan(result[0].rawValue);
          }
        }}
        styles={{
          container: { borderRadius: "0.5rem", overflow: "hidden" },
        }}
      />
    </div>
  );
}
