import { Link, useNavigate } from "react-router-dom";

export default function HomeHeader({ onToggleUsers, showingUsers }) {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/', { replace: true });
  };

  return (
    <header className="header">
      <div className="brand">
        <Link to="/" className="brand-link">Inventareapp</Link>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" onClick={onToggleUsers}>
          {showingUsers ? 'Ocultar usuarios' : 'Usuarios'}
        </button>
        <button className="btn btn-primary" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </header>
  );
}