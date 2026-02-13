import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      // Opcional: también guardar usuario
      localStorage.setItem('user', JSON.stringify(data.user));
      // Redirigir al inicio (landing) o a tu dashboard
      navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Error al iniciar sesión';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login">
      <h2>Iniciar sesión</h2>
      <form onSubmit={onSubmit} className="card">
        <label>
          Correo
          <input
            type="email"
            placeholder="correo@empresa.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <div className="error">{error}</div>}

        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <p className="hint">
        API: <code>{import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}</code>
      </p>
    </main>
  );
}