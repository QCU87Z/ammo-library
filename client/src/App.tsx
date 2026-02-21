import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import BoxList from "./pages/BoxList";
import BoxDetail from "./pages/BoxDetail";
import BoxForm from "./pages/BoxForm";
import ReloadForm from "./pages/ReloadForm";
import ActionList from "./pages/ActionList";
import ActionDetail from "./pages/ActionDetail";
import ActionForm from "./pages/ActionForm";
import BarrelList from "./pages/BarrelList";
import BarrelForm from "./pages/BarrelForm";
import BarrelDetail from "./pages/BarrelDetail";
import LoadList from "./pages/LoadList";
import LoadForm from "./pages/LoadForm";
import ComponentManager from "./pages/ComponentManager";
import ScanQR from "./pages/ScanQR";
import PrintLabels from "./pages/PrintLabels";
import CartridgeList from "./pages/CartridgeList";
import CartridgeForm from "./pages/CartridgeForm";
import ElevationList from "./pages/ElevationList";
import ElevationForm from "./pages/ElevationForm";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/boxes" element={<BoxList />} />
        <Route path="/boxes/new" element={<BoxForm />} />
        <Route path="/boxes/:id" element={<BoxDetail />} />
        <Route path="/boxes/:id/edit" element={<BoxForm />} />
        <Route path="/boxes/:id/reload" element={<ReloadForm />} />
        <Route path="/actions" element={<ActionList />} />
        <Route path="/actions/new" element={<ActionForm />} />
        <Route path="/actions/:id" element={<ActionDetail />} />
        <Route path="/actions/:id/edit" element={<ActionForm />} />
        <Route path="/actions/:actionId/barrels/new" element={<BarrelForm />} />
        <Route path="/barrels" element={<BarrelList />} />
        <Route path="/barrels/:id" element={<BarrelDetail />} />
        <Route path="/barrels/:id/edit" element={<BarrelForm />} />
        <Route path="/loads" element={<LoadList />} />
        <Route path="/loads/new" element={<LoadForm />} />
        <Route path="/loads/:id/edit" element={<LoadForm />} />
        <Route path="/components" element={<ComponentManager />} />
        <Route path="/scan" element={<ScanQR />} />
        <Route path="/print" element={<PrintLabels />} />
        <Route path="/cartridges" element={<CartridgeList />} />
        <Route path="/cartridges/new" element={<CartridgeForm />} />
        <Route path="/cartridges/:id/edit" element={<CartridgeForm />} />
        <Route path="/elevations" element={<ElevationList />} />
        <Route path="/elevations/new" element={<ElevationForm />} />
        <Route path="/elevations/:id/edit" element={<ElevationForm />} />
      </Route>
    </Routes>
  );
}
