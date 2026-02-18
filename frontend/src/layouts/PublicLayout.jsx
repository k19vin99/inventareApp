// frontend/src/layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom";
import PublicHeader from "../components/PublicHeader.jsx";
import Footer from "../components/Footer.jsx";

export default function PublicLayout() {
  return (
    <div className="app-shell">
      <PublicHeader />
      <div className="app-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}