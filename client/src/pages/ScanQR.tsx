import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QRScanner from "../components/QRScanner";

export default function ScanQR() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  function handleScan(url: string) {
    try {
      const parsed = new URL(url);
      const path = parsed.pathname;
      if (path.startsWith("/boxes/")) {
        navigate(path);
      } else {
        setError("QR code does not point to a box.");
      }
    } catch {
      setError("Invalid QR code.");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Scan QR Code</h1>
      <p className="text-sm text-gray-500">
        Point your camera at a box label QR code to view its details.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <QRScanner onScan={handleScan} />
    </div>
  );
}
