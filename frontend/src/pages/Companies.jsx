// Companies.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import "../companies.css"; // 👈 importa su CSS propio

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");

  const load = async (q = "") => {
    setLoading(true);
    setErr("");
    try {
      const url = q ? `/companies?search=${encodeURIComponent(q)}` : "/companies";
      const { data } = await api.get(url);
      setCompanies(data || []);
      // console.log("Companies loaded:", data); // debug si quieres
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!confirm(`¿Inactivar empresa?`)) return;
    try {
      await api.delete(`/companies/${id}`);
      setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, status: "inactive" } : c)));
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  return (
    <main className="companies-page">
      <h2>Empresas</h2>

      <section className="card">
        <form
          className="companies-search"
          onSubmit={(e) => { e.preventDefault(); load(search); }}
        >
          <input
            type="search"
            placeholder="Buscar por código, nombre, razón social o RUT…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn">Buscar</button>
        </form>
      </section>

      <div className="companies-actions">
        <Link className="btn btn-primary" to="/home/companies/new">Registrar Empresa</Link>
      </div>

      {err && <div className="error">Error: {err}</div>}

      {loading ? (
        <div className="hint">Cargando empresas…</div>
      ) : (
        <div className="companies-table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>RUT</th>
                <th>Nombre</th>
                <th>Razón social</th>
                <th>Rubro</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Creado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {companies.length ? companies.map((c) => (
                <tr key={c.id}>
                  <td>{c.company_code}</td>
                  <td>{c.rut}</td>
                  <td>{c.name}</td>
                  <td>{c.legal_name}</td>
                  <td>{c.industry || ""}</td>
                  <td>{c.email || ""}</td>
                  <td>{c.phone || ""}</td>
                  <td>{c.status}</td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="cell-actions">
                      <Link className="btn" to={`/home/companies/${encodeURIComponent(c.id)}/edit`}>Editar</Link>
                      <button className="btn" onClick={() => onDelete(c.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={10}>No hay empresas registradas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}