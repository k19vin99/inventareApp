import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";

export default function UserEdit() {
  const { rut } = useParams();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    email: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    second_last_name: "",
    gender: "",
    position: "",
    birth_date: "",
    hire_date: "",
    address: "",
    company_id: ""
  });

  // Carga inicial: usuario + empresas activas
  useEffect(() => {
    if (!rut) {
      setErr("Falta RUT en la URL.");
      return;
    }
    (async () => {
      try {
        setErr("");
        const [uRes, cRes] = await Promise.all([
          api.get(`/users/${encodeURIComponent(rut)}`),
          api.get("/companies?status=active"),
        ]);

        const u = uRes.data || {};
        setForm({
          email: u.email || "",
          first_name: u.first_name || "",
          middle_name: u.middle_name || "",
          last_name: u.last_name || "",
          second_last_name: u.second_last_name || "",
          gender: u.gender || "",
          position: u.position || "",
          // Normalizamos a yyyy-mm-dd para inputs date
          birth_date: u.birth_date ? String(u.birth_date).substring(0, 10) : "",
          hire_date: u.hire_date ? String(u.hire_date).substring(0, 10) : "",
          address: u.address || "",
          company_id: u.company_id || "",
        });

        setCompanies(Array.isArray(cRes.data) ? cRes.data : []);
      } catch (e) {
        setErr(e?.response?.data?.error || e.message);
      }
    })();
  }, [rut]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!rut) {
      setErr("Falta RUT en la URL.");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      // ⚠️ Sanea: '' -> null en campos opcionales (evita errores 22P02/22007/23514)
      const payload = {
        email: form.email,                 // requerido
        first_name: form.first_name,       // requerido
        last_name: form.last_name,         // requerido

        middle_name: form.middle_name || null,
        second_last_name: form.second_last_name || null,
        gender: form.gender || null,       // 'male' | 'female' | null
        position: form.position || null,

        birth_date: form.birth_date || null, // '' -> null (DATE)
        hire_date: form.hire_date || null,   // '' -> null (DATE)
        address: form.address || null,

        company_id: form.company_id || null, // '' -> null (UUID)
        // Si quisieras permitir cambiar password aquí, agrega:
        // password: form.password || undefined
      };

      await api.put(`/users/${encodeURIComponent(rut)}`, payload);
      navigate("/home/users", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="home" style={{ maxWidth: 900, margin: "24px auto", padding: "0 20px" }}>
      <h2>Editar Usuario: {rut}</h2>

      {err && <div className="error">Error: {err}</div>}

      <section className="card" style={{ marginTop: 12 }}>
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Primer nombre
            <input
              name="first_name"
              value={form.first_name}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Primer apellido
            <input
              name="last_name"
              value={form.last_name}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Segundo nombre
            <input
              name="middle_name"
              value={form.middle_name}
              onChange={onChange}
            />
          </label>

          <label>
            Segundo apellido
            <input
              name="second_last_name"
              value={form.second_last_name}
              onChange={onChange}
            />
          </label>

          <label>
            Género
            <select name="gender" value={form.gender} onChange={onChange}>
              <option value="">(opcional)</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
            </select>
          </label>

          <label>
            Cargo
            <input
              name="position"
              value={form.position}
              onChange={onChange}
            />
          </label>

          <label>
            F. nacimiento
            <input
              type="date"
              name="birth_date"
              value={form.birth_date}
              onChange={onChange}
            />
          </label>

          <label>
            F. ingreso
            <input
              type="date"
              name="hire_date"
              value={form.hire_date}
              onChange={onChange}
            />
          </label>

          <label style={{ gridColumn: "1 / -1" }}>
            Dirección
            <input
              name="address"
              value={form.address}
              onChange={onChange}
            />
          </label>

          <label style={{ gridColumn: "1 / -1" }}>
            Empresa
            <select
              name="company_id"
              value={form.company_id || ""}
              onChange={onChange}
            >
              <option value="">(sin empresa)</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company_code ? `${c.company_code} — ` : ""}
                  {c.name || c.legal_name}
                </option>
              ))}
            </select>
          </label>

          <div style={{ gridColumn: "1 / -1" }}>
            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}