import { useEffect, useState } from 'react';
import HomeHeader from '../components/HomeHeader.jsx';
import UsersTable from '../components/UsersTable.jsx';
import api from '../lib/api';

export default function Home() {
  const [showUsers, setShowUsers] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState('');

  const toggleUsers = async () => {
    setShowUsers(prev => !prev);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!showUsers) return;
      if (users.length) return; // ya cargados, no recargar
      setLoadingUsers(true);
      setErr('');
      try {
        const { data } = await api.get('/users'); // Authorization se adjunta por interceptor
        setUsers(data || []);
      } catch (e) {
        const msg = e?.response?.data?.error || e.message;
        setErr(msg);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showUsers]);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch { return {}; }
  })();

  return (
    <>
      <HomeHeader onToggleUsers={toggleUsers} showingUsers={showUsers} />

      <main className="home" style={{ maxWidth: 1100, margin: '24px auto', padding: '0 20px' }}>
        <h2>Home</h2>
        <p>Bienvenido{user?.first_name ? `, ${user.first_name}` : ''} 👋</p>

        {!showUsers && (
          <section style={{ marginTop: 16 }}>
            <p className="hint">Haz clic en <b>Usuarios</b> en el header para ver la tabla.</p>
          </section>
        )}

        {showUsers && (
          <section style={{ marginTop: 20 }}>
            <h3>Usuarios</h3>
            {loadingUsers && <div className="hint">Cargando usuarios…</div>}
            {err && <div className="error">Error: {err}</div>}
            {!loadingUsers && !err && <UsersTable users={users} />}
          </section>
        )}
      </main>
    </>
  );
}