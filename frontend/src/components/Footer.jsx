export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand">Inventareapp</div>
          <p className="muted">© {new Date().getFullYear()} Inventareapp. Todos los derechos reservados.</p>
        </div>
        <div className="footer-links">
          <a href="/#features">Características</a>
          <a href="/#about">Quiénes somos</a>
          <a href="/#success">Casos de éxito</a>
          <a href="/#faq">FAQ</a>
          <a href="/#contact">Contacto</a>
        </div>
      </div>
    </footer>
  );
}