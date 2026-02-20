import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Box,
  Crosshair,
  Circle,
  Layers,
  FlaskConical,
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
  { to: "/loads", label: "Loads", icon: FlaskConical },
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
      <div className="md:hidden flex items-center justify-between bg-gun-950 text-gun-100 px-4 py-3 border-b border-gun-700">
        <Link to="/" className="font-display text-2xl tracking-widest text-brass leading-none">
          AMMO LIBRARY
        </Link>
        <button
          onClick={onToggle}
          className="p-1 text-gun-400 hover:text-gun-100 transition-colors"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <nav
        className={`${
          open ? "block" : "hidden"
        } md:flex md:flex-col bg-gun-950 w-full md:w-56 md:min-h-screen flex-shrink-0 border-r border-gun-700`}
      >
        {/* Logo */}
        <div className="hidden md:block px-5 pt-6 pb-5">
          <Link to="/" className="block">
            <span className="font-display text-[2rem] tracking-widest text-brass leading-none block">
              AMMO
            </span>
            <span className="font-display text-[2rem] tracking-widest text-brass leading-none block">
              LIBRARY
            </span>
            <div className="mt-3 h-px bg-gun-700 w-full" />
          </Link>
        </div>

        {/* Nav items */}
        <ul className="flex-1 space-y-0.5 px-2 py-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active =
              to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => { if (open) onToggle(); }}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-body font-medium transition-all relative ${
                    active
                      ? "text-brass bg-gun-800 border-l-2 border-brass"
                      : "text-gun-400 hover:text-gun-100 hover:bg-gun-800 border-l-2 border-transparent pl-[14px]"
                  }`}
                  style={active ? { paddingLeft: "10px" } : undefined}
                >
                  <Icon size={15} className={active ? "text-brass" : ""} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Bottom tag */}
        <div className="hidden md:block px-5 pb-5">
          <div className="h-px bg-gun-700 mb-3" />
          <span className="text-[10px] font-mono text-gun-600 tracking-[0.2em] uppercase">
            Precision Tracking
          </span>
        </div>
      </nav>
    </>
  );
}
