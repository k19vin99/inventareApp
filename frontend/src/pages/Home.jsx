export default function Home() {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  })();

  return (
    <main className="home" style={{ maxWidth: 1000, margin: '40px auto', padding: '0 20px' }}>
      <h2>Home</h2>
      <p>Bienvenido{user?.first_name ? `, ${user.first_name}` : ''} 👋</p>

      <section style={{ marginTop: 20 }}>
        <p>Este será tu dashboard inicial. Aquí podemos listar KPIs, accesos rápidos, etc.</p>
      </section>
    </main>
  );
}