import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function CompanyCreate() {
  const navigate = useNavigate();
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    company_code: '',
    rut: '',
    name: '',
    legal_name: '',
    industry: '',
    address: '',
    phone: '',
    email: '',
  });

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr('');

    try {
      await api.post('/companies', form);
      navigate('/home/companies', { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="home" style={{ maxWidth: 900, margin: '24px auto', padding: '0 20px' }}>
      <h2>Registrar Empresa</h2>

      {err && <div className="error">Error: {err}</div>}

      <section className="card" style={{ marginTop: 12 }}>
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Código
            <input
              name="company_code"
              value={form.company_code}
              onChange={onChange}
              required
              placeholder="ACME"
            />
          </label>

          <label>
            RUT
            <input
              name="rut"
              value={form.rut}
              onChange={onChange}
              required
              placeholder="76123456-7"
            />
          </label>

          <label>
            Nombre
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              placeholder="Nombre comercial"
            />
          </label>

          <label>
            Razón social
            <input
              name="legal_name"
              value={form.legal_name}
              onChange={onChange}
              required
              placeholder="ACME S.A."
            />
          </label>

          <label>
            Rubro
            <input
              name="industry"
              value={form.industry}
              onChange={onChange}
            />
          </label>

          <label>
            Dirección
            <input
              name="address"
              value={form.address}
              onChange={onChange}
            />
          </label>

          <label>
            Teléfono
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
            />
          </label>

          <div style={{ gridColumn: "1 / -1" }}>
            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Guardando…" : "Crear Empresa"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}