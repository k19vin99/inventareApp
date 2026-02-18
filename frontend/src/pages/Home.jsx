// frontend/src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch { return {}; }
  })();

  return (
    <main className="home" style={{ maxWidth: 1100, margin: "24px auto", padding: "0 20px" }}>
      <h2>Home</h2>
      <p>Bienvenido{user?.first_name ? `, ${user.first_name}` : ''} 👋</p>

      <section style={{ marginTop: 20 }}>
        <div className="menu-grid">
          {/* Empresas */}
          <Link to="/home/companies" className="menu-card">
            <div className="menu-emoji" aria-hidden>🏢</div>
            <h3>Empresas</h3>
            <p>Ver listado y administrar empresas.</p>
          </Link>
          <Link to="/home/companies/new" className="menu-card">
            <div className="menu-emoji" aria-hidden>➕</div>
            <h3>Registrar Empresa</h3>
            <p>Crear una nueva empresa.</p>
          </Link>

          {/* Usuarios */}
          <Link to="/home/users" className="menu-card">
            <div className="menu-emoji" aria-hidden>👥</div>
            <h3>Usuarios</h3>
            <p>Listado de usuarios de la organización.</p>
          </Link>
          <Link to="/home/users/new" className="menu-card">
            <div className="menu-emoji" aria-hidden>➕</div>
            <h3>Registrar Usuario</h3>
            <p>Crear un nuevo usuario.</p>
          </Link>

          {/* Nuevas secciones */}
          <Link to="/home/requests" className="menu-card">
            <div className="menu-emoji" aria-hidden>🗓️</div>
            <h3>Solicitudes especiales</h3>
            <p>Vacaciones, permisos y más.</p>
          </Link>
          <Link to="/home/profile" className="menu-card">
            <div className="menu-emoji" aria-hidden>🧑‍💼</div>
            <h3>Mi Ficha Personal</h3>
            <p>Datos personales y de contrato.</p>
          </Link>
          <Link to="/home/documents" className="menu-card">
            <div className="menu-emoji" aria-hidden>📄</div>
            <h3>Mis Documentos</h3>
            <p>Liquidaciones, certificados, etc.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}