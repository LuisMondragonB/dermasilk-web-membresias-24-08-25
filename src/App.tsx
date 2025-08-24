import HomePage from "./pages/HomePage";
import MembershipsPage from "./pages/MembershipsPage";
import AdminPage from "./pages/AdminPage"; // <-- 1. IMPORTA LA NUEVA PÁGINA
import Navigation from "./components/Layout/Navigation";
import { Routes, Route } from "react-router-dom";  // Remueve BrowserRouter as Router

function App() {
  // 2. USA EL ROUTER PARA MANEJAR LAS PÁGINAS
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/membresias" element={<MembershipsPage />} />
        <Route path="/admin" element={<AdminPage />} /> {/* <-- 3. AÑADE LA RUTA DEL PANEL */}
      </Routes>
    </>
  );
}

export default App;
