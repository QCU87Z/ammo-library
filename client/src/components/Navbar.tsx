import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Box,
  Crosshair,
  Circle,
  Layers,
  ScanLine,
  Printer,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/boxes", label: "Boxes", icon: Box },
  { to: "/actions", label: "Actions", icon: Crosshair },
  { to: "/barrels", label: "Barrels", icon: Circle },
  { to: "/components", label: "Components", icon: Layers },
  { to: "/scan", label: "Scan QR", icon: ScanLine },
  { to: "/print", label: "Print Labels", icon: Printer },
];

interface NavbarProps {
  open: boolean;
  onToggle: () => void;
}

export default function Navbar({ open, onToggle }: NavbarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 text-white px-4 py-3">
        <Link to="/" className="font-bold text-lg">
          Ammo Library
        </Link>
        <button onClick={onToggle} className="p-1">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <nav
        className={`${
          open ? "block" : "hidden"
        } md:block bg-gray-900 text-gray-300 w-full md:w-56 md:min-h-screen flex-shrink-0`}
      >
        <div className="hidden md:block px-4 py-5">
          <Link to="/" className="font-bold text-xl text-white">
            Ammo Library
          </Link>
        </div>
        <ul className="space-y-1 px-2 pb-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active =
              to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  onClick={onToggle}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
