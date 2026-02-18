import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function UserCreate() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    rut: '', email: '', password: '',
    first_name: '', middle_name: '', last_name: '', second_last_name: '',
    gender: '', position: '', birth_date: '', hire_date: '', address: '',
    company_id: ''
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/companies?status=active');
        setCompanies(data || []);
      } catch (e) {
        setErr(e?.response?.data?.error || e.message);
      }
    })();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setErr('');
    try {
      const payload = {
        ...form,
        middle_name: form.middle_name || null,
        second_last_name: form.second_last_name || null,
        gender: form.gender || null,
        position: form.position || null,
        birth_date: form.birth_date || null,
        hire_date: form.hire_date || null,
        address: form.address || null,
        company_id: form.company_id || null,
      };
      await api.post('/users', payload);
      navigate('/home/users', { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="home" style={{ maxWidth: 900, margin: '24px auto', padding: '0 20px' }}>
      <h2>Registro de Usuario</h2>
      {err && <div className="error">Error: {err}</div>}
      <section className="card" style={{ marginTop: 12 }}>
        <form className="form-grid" onSubmit={onSubmit}>
          <label>RUT<input name="rut" value={form.rut} onChange={onChange} required placeholder="12345678-9" /></label>
          <label>Email<input type="email" name="email" value={form.email} onChange={onChange} required /></label>
          <label>Contraseña<input type="password" name="password" value={form.password} onChange={onChange} required /></label>
          <label>Primer nombre<input name="first_name" value={form.first_name} onChange={onChange} required /></label>
          <label>Primer apellido<input name="last_name" value={form.last_name} onChange={onChange} required /></label>
          <label>Segundo nombre<input name="middle_name" value={form.middle_name} onChange={onChange} /></label>
          <label>Segundo apellido<input name="second_last_name" value={form.second_last_name} onChange={onChange} /></label>
          <label>Género
            <select name="gender" value={form.gender} onChange={onChange}>
              <option value="">(opcional)</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
            </select>
          </label>
          <label>Cargo<input name="position" value={form.position} onChange={onChange} /></label>
          <label>F. nacimiento<input type="date" name="birth_date" value={form.birth_date} onChange={onChange} /></label>
          <label>F. ingreso<input type="date" name="hire_date" value={form.hire_date} onChange={onChange} /></label>
          <label style={{ gridColumn: '1 / -1' }}>Dirección<input name="address" value={form.address} onChange={onChange} /></label>
          <label style={{ gridColumn: '1 / -1' }}>
            Empresa
            <select name="company_id" value={form.company_id} onChange={onChange}>
              <option value="">(sin empresa)</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.company_code ? `${c.company_code} — ` : ''}{c.name || c.legal_name}
                </option>
              ))}
            </select>
          </label>

          <div style={{ gridColumn: '1 / -1' }}>
            <button className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}