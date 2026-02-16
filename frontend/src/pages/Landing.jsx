import PublicHeader from "../components/PublicHeader.jsx";
import Accordion from "../components/Accordion.jsx";
import { Link } from "react-router-dom";

const faqItems = [
  { title: "¿Qué es Inventareapp?", content: "Una plataforma para gestionar inventarios de forma simple y segura." },
  { title: "¿Puedo integrarlo con mi ERP?", content: "Sí, contamos con APIs y conectores para múltiples sistemas." },
  { title: "¿Cómo se maneja la seguridad?", content: "Cifrado de datos, autenticación por JWT y prácticas de seguridad recomendadas." },
];

export default function Landing() {
  return (
    <>
      <PublicHeader />

      {/* HERO */}
      <section className="section hero-landing">
        <div className="container hero-grid">
          <div>
            <h1 className="hero-title">
              Gestión Empresaria <span className="highlight">sin complicaciones</span>
            </h1>
            <p className="hero-sub">
              Maneja cada proceso de tu empresa, mejora el día a día de tus colaboradores.
            </p>
            <div className="badges">
              <span className="badge">Rápido de implementar</span>
              <span className="badge">Escalable</span>
              <span className="badge">Soporte 24/7</span>
              <span className="badge">Autonomía empresarial en 30 días</span>
            
            </div>
          </div>

          {/* Imagen hero (placeholder Unsplash) */}
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1400&auto=format&fit=crop"
              alt="Panel de control de inventario"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section">
        <div className="container">
          <h2>Características</h2>
          <p className="section-sub">
            Todo lo que necesitas para administrar tu empresa desde un solo lugar.
          </p>

          <div className="grid-3">
            <FeatureCard
              icon="📦"
              title="Gestión de productos"
              desc="Gestiona stock e inventario de tus productos"
            />
            <FeatureCard
              icon="📊"
              title="Reportes en tiempo real"
              desc="Stock, rotación, alertas por bajo inventario y más."
            />
            <FeatureCard
              icon="🔗"
              title="Integraciones"
              desc="Conecta con ERP, eCommerces."
            />
            <FeatureCard
              icon="👥"
              title="Roles y permisos"
              desc="Define accesos por perfil y audita acciones."
            />
            <FeatureCard
              icon="🔒"
              title="Seguridad"
              desc="Buenas prácticas, autenticación JWT y cifrado."
            />
            <FeatureCard
              icon="⚡"
              title="Rápido y simple"
              desc="Interfaz intuitiva para tu operación diaria."
            />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section alt">
        <div className="container about-grid">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop"
              alt="Equipo trabajando"
              loading="lazy"
            />
          </div>
          <div>
            <h2>Quiénes somos</h2>
            <p>
              Somos un equipo apasionado por optimizar la gestión de los procesos de las empresas. Combinamos
              experiencia operativa con tecnología moderna para ayudarte a crecer.
            </p>
            <ul className="list">
              <li>+5 años construyendo soluciones tecnologicas para empresas</li>
              <li>Enfoque en usabilidad y seguridad</li>
              <li>Implementaciones rápidas y acompañamiento</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section id="success" className="section">
        <div className="container">
          <h2>Casos de éxito</h2>
          <p className="section-sub">Resultados reales con clientes de distintas industrias.</p>

          <div className="grid-3">
            <CaseCard
              logo="https://dummyimage.com/120x40/000/fff&text=ACME"
              title="ACME Retail"
              desc="Redujo quiebres de stock en 32% en 3 meses."
            />
            <CaseCard
              logo="https://dummyimage.com/120x40/000/fff&text=LOGI"
              title="LogiTrans"
              desc="Optimización de picking y trazabilidad con scanners."
            />
            <CaseCard
              logo="https://dummyimage.com/120x40/000/fff&text=PHAR"
              title="PharmaPlus"
              desc="Cumplimiento normativo y lotes con caducidad."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section alt">
        <div className="container">
          <h2>Preguntas frecuentes</h2>
          <Accordion items={faqItems} />
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="container contact-grid">
          <div>
            <h2>Contacto</h2>
            <p className="section-sub">
              ¿Listo para ver Inventareapp en acción? Escríbenos y agenda una demo.
            </p>
            <ContactForm />
          </div>

          {/* Imagen/mapa placeholder */}
          <div className="contact-image">
            <img
              src="https://images.unsplash.com/photo-1529078155058-5d716f45d604?q=80&w=1400&auto=format&fit=crop"
              alt="Mapa o equipo de soporte"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="brand">Inventareapp</div>
            <p className="muted">© {new Date().getFullYear()} Inventareapp. Todos los derechos reservados.</p>
          </div>
          <div className="footer-links">
            <a href="#features">Características</a>
            <a href="#about">Quiénes somos</a>
            <a href="#success">Casos de éxito</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contacto</a>
          </div>
        </div>
      </footer>
    </>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <article className="card feature-card">
      <div className="feature-icon" aria-hidden="true">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </article>
  );
}

function CaseCard({ logo, title, desc }) {
  return (
    <article className="card case-card">
      <img src={logo} alt={`${title} logo`} className="case-logo" loading="lazy" />
      <h3>{title}</h3>
      <p>{desc}</p>
    </article>
  );
}

function ContactForm() {
  const onSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    // TODO: enviar a tu backend si quieres (endpoint de contacto)
    alert(`Gracias ${data.name}, te contactaremos a ${data.email}.`);
    e.currentTarget.reset();
  };

  return (
    <form className="card form" onSubmit={onSubmit}>
      <label>
        Nombre
        <input type="text" name="name" placeholder="Tu nombre" required />
      </label>
      <label>
        Correo
        <input type="email" name="email" placeholder="tu@correo.com" required />
      </label>
      <label>
        Mensaje
        <textarea name="message" placeholder="Cuéntanos sobre tu operación..." rows={4} />
      </label>
      <button className="btn btn-primary" type="submit">Enviar</button>
    </form>
  );
}