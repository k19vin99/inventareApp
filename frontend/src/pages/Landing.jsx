
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <main className="landing">
      <section className="hero">
        <h1>Bienvenido a Inventareapp</h1>
        <p className="sub">
          Gestiona tu inventario de forma simple, rápida y segura.
        </p>
        <div className="cta">
          <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
        </div>
      </section>
    </main>
  );
}