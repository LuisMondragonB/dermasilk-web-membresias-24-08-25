import HomePage from "./pages/HomePage";
import MembershipsPage from "./pages/MembershipsPage";
import AdminPage from "./pages/AdminPage";
import Navigation from "./components/Layout/Navigation";
import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  
  // Debug: mostrar la ruta actual
  console.log('Current route:', location.pathname);

  return (
    <>
      {/* Solo mostrar navegación en páginas públicas */}
      {location.pathname !== '/admin' && <Navigation />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/membresias" element={<MembershipsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* Ruta catch-all para debugging */}
        <Route path="*" element={<div>Ruta no encontrada: {location.pathname}</div>} />
      </Routes>
    </>
  );
}

export default App;