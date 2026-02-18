// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout.jsx";
import PrivateLayout from "./layouts/PrivateLayout.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";

import Companies from "./pages/Companies.jsx";
import CompanyCreate from "./pages/CompanyCreate.jsx";
import CompanyEdit from "./pages/CompanyEdit.jsx";

import Users from "./pages/Users.jsx";
import UserCreate from "./pages/UserCreate.jsx";
import UserEdit from "./pages/UserEdit.jsx";

// NUEVAS páginas
{/* import SpecialRequests from "./pages/SpecialRequests.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import MyDocuments from "./pages/MyDocuments.jsx";
*/}
import RequireAuth from "./components/RequireAuth.jsx";

export default function App() {
  return (
    <Routes>
      {/* Público */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Privado */}
      <Route element={<RequireAuth><PrivateLayout /></RequireAuth>}>
        <Route path="/home" element={<Home />} />

        {/* Empresas */}
        <Route path="/home/companies" element={<Companies />} />
        <Route path="/home/companies/new" element={<CompanyCreate />} />
        <Route path="/home/companies/:id/edit" element={<CompanyEdit />} />

        {/* Usuarios */}
        <Route path="/home/users" element={<Users />} />
        <Route path="/home/users/new" element={<UserCreate />} />
        <Route path="/home/users/:rut/edit" element={<UserEdit />} />

        {/* NUEVAS secciones */}
        {/* <Route path="/home/requests" element={<SpecialRequests />} />
        <Route path="/home/profile" element={<MyProfile />} />
        <Route path="/home/documents" element={<MyDocuments />} /> */}
      </Route>
    </Routes>
  );
}