import type { LoadHistoryEntry } from "../../../shared/types";

interface LoadHistoryTimelineProps {
  entries: LoadHistoryEntry[];
}

export default function LoadHistoryTimeline({ entries }: LoadHistoryTimelineProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-gray-500 italic">No reload history</p>;
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, idx) => (
        <div key={idx} className="relative pl-6 border-l-2 border-gray-200">
          <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-gray-400" />
          <div className="text-xs text-gray-500 mb-1">
            {new Date(entry.date).toLocaleDateString()}
          </div>
          <div className="text-sm">
            <span className="font-medium">{entry.projectile}</span>
            {" / "}
            {entry.powderCharge} {entry.powder}
            {" / "}
            {entry.primer}
            {entry.length && ` / ${entry.length}`}
          </div>
          {entry.notes && (
            <p className="text-xs text-gray-500 mt-1">{entry.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}
