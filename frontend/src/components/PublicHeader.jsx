import { Link, useLocation } from "react-router-dom";

export default function PublicHeader() {
  const { pathname } = useLocation();

  return (
    <header className="header">
      <div className="brand">
        <a href="/" className="brand-link">Inventareapp</a>
      </div>

      <nav className="nav">
        {/* Navegación por anclas en la misma página del landing */}
        <a href="#features" className="nav-link">Características</a>
        <a href="#about" className="nav-link">Quiénes somos</a>
        <a href="#success" className="nav-link">Casos de éxito</a>
        <a href="#faq" className="nav-link">FAQ</a>
        <a href="#contact" className="nav-link">Contacto</a>
      </nav>

      {/* Botón login solo si no estamos ya en /login */}
      {pathname !== "/login" && (
        <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
      )}
    </header>
  );
}