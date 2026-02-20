interface StatusBadgeProps {
  status: "active" | "retired";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-[0.15em] uppercase ${
        status === "active"
          ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/40"
          : "bg-gun-800 text-gun-400 border border-gun-700"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
          status === "active" ? "bg-emerald-400" : "bg-gun-500"
        }`}
      />
      {status}
    </span>
  );
}
