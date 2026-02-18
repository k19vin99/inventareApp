import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";

export default function CompanyEdit() {
  const { id } = useParams();
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
    status: 'active'
  });

  useEffect(() => {
    if (!id) {
      setErr('Falta ID de empresa en la URL.');
      return;
    }
    (async () => {
      try {
        const { data } = await api.get(`/companies/${id}`);
        setForm({
          company_code: data.company_code || '',
          rut: data.rut || '',
          name: data.name || '',
          legal_name: data.legal_name || '',
          industry: data.industry || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          status: data.status || 'active'
        });
      } catch (e) {
        setErr(e?.response?.data?.error || e.message);
      }
    })();
  }, [id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      setErr('Falta ID de empresa en la URL.');
      return;
    }
    setSaving(true); setErr('');
    try {
      await api.put(`/companies/${id}`, form);
      navigate('/home/companies', { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="home" style={{ maxWidth: 900, margin: '24px auto', padding: '0 20px' }}>
      <h2>Editar Empresa</h2>
      {err && <div className="error">Error: {err}</div>}
      <section className="card" style={{ marginTop: 12 }}>
        <form className="form-grid" onSubmit={onSubmit}>
          <label>Código<input name="company_code" value={form.company_code} onChange={onChange} required /></label>
          <label>RUT<input name="rut" value={form.rut} onChange={onChange} required /></label>
          <label>Nombre<input name="name" value={form.name} onChange={onChange} required /></label>
          <label>Razón social<input name="legal_name" value={form.legal_name} onChange={onChange} required /></label>
          <label>Rubro<input name="industry" value={form.industry} onChange={onChange} /></label>
          <label>Dirección<input name="address" value={form.address} onChange={onChange} /></label>
          <label>Teléfono<input name="phone" value={form.phone} onChange={onChange} /></label>
          <label>Email<input type="email" name="email" value={form.email} onChange={onChange} /></label>
          <label>
            Estado
            <select name="status" value={form.status} onChange={onChange}>
              <option value="active">Activa</option>
              <option value="inactive">Inactiva</option>
            </select>
          </label>
          <div style={{ gridColumn: '1 / -1' }}>
            <button className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
``