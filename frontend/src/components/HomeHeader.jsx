import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

function useClickOutside(ref, onClose) {
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onClose]);
}

export default function HomeHeader() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpenMenu(null));

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/', { replace: true });
  };

  return (
    <header className="header">
      <div className="brand">
        <Link to="/home" className="brand-link">Inventareapp</Link>
      </div>

      <nav className="nav" ref={ref} style={{ display: 'flex', gap: 12 }}>
        <div className="dropdown">
          <button className="btn" onClick={() => setOpenMenu(openMenu === 'companies' ? null : 'companies')}>
            Empresas
          </button>
          {openMenu === 'companies' && (
            <div className="dropdown-menu">
              <Link to="/home/companies" onClick={() => setOpenMenu(null)}>Listado de Empresas</Link>
              <Link to="/home/companies/new" onClick={() => setOpenMenu(null)}>Registro de Empresas</Link>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button className="btn" onClick={() => setOpenMenu(openMenu === 'users' ? null : 'users')}>
            Usuarios
          </button>
          {openMenu === 'users' && (
            <div className="dropdown-menu">
              <Link to="/home/users" onClick={() => setOpenMenu(null)}>Listado de Usuarios</Link>
              <Link to="/home/users/new" onClick={() => setOpenMenu(null)}>Registro de Usuarios</Link>
            </div>
          )}
        </div>

        <button className="btn btn-primary" onClick={onLogout}>Cerrar sesión</button>
      </nav>
    </header>
  );
}