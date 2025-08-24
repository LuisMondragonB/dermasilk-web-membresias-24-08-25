import HomePage from "./pages/HomePage";
import MembershipsPage from "./pages/MembershipsPage";
import AdminPage from "./pages/AdminPage";
import Navigation from "./components/Layout/Navigation";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/membresias" element={<MembershipsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}

export default App;
