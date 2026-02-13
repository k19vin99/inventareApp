import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="header">
      <div className="brand">
        <Link to="/" className="brand-link">Inventareapp</Link>
      </div>
      {pathname !== '/login' && (
        <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
      )}
    </header>
  );
}