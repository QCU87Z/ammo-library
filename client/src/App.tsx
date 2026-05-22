import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Layout from "./components/Layout";
import RiflesList from "./pages/RiflesList";
import RifleDetail from "./pages/RifleDetail";
import BoxList from "./pages/BoxList";
import BoxDetail from "./pages/BoxDetail";
import BoxForm from "./pages/BoxForm";
import ReloadForm from "./pages/ReloadForm";
import ActionList from "./pages/ActionList";
import ActionDetail from "./pages/ActionDetail";
import ActionForm from "./pages/ActionForm";
import BarrelForm from "./pages/BarrelForm";
import LoadList from "./pages/LoadList";
import LoadForm from "./pages/LoadForm";
import ComponentManager from "./pages/ComponentManager";
import ScanQR from "./pages/ScanQR";
import PrintLabels from "./pages/PrintLabels";
import CartridgeList from "./pages/CartridgeList";
import CartridgeForm from "./pages/CartridgeForm";
import ElevationList from "./pages/ElevationList";
import ElevationForm from "./pages/ElevationForm";

function BarrelToRifleRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/rifles/${id}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<RiflesList />} />
        <Route path="/rifles/:barrelId" element={<RifleDetail />} />
        <Route path="/rifles/:id/edit" element={<BarrelForm />} />
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
        <Route path="/barrels" element={<Navigate to="/" replace />} />
        <Route path="/barrels/:id" element={<BarrelToRifleRedirect />} />
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
