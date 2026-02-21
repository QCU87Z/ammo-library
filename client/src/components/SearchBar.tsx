import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gun-500"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gun-950 border border-gun-700 rounded text-sm text-gun-100 pl-9 pr-4 py-2 placeholder-gun-500 focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass/20 transition-colors font-body"
      />
    </div>
  );
}
