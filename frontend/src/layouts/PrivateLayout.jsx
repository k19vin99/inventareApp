// frontend/src/layouts/PrivateLayout.jsx
import { Outlet } from "react-router-dom";
import HomeHeader from "../components/HomeHeader.jsx";
import Footer from "../components/Footer.jsx";

export default function PrivateLayout() {
  return (
    <div className="app-shell">
      <HomeHeader />
      <div className="app-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}