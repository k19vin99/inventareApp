// Users.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import "../users.css"; // 👈 importa su CSS propio

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true); setErr("");
    try {
      const { data } = await api.get("/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (rut) => {
    if (!confirm(`¿Eliminar usuario ${rut}?`)) return;
    try {
      await api.delete(`/users/${encodeURIComponent(rut)}`);
      setUsers((prev) => prev.filter((u) => u.rut !== rut));
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  return (
    <main className="users-page">
      <h2>Usuarios</h2>

      <div className="users-actions">
        <Link className="btn btn-primary" to="/home/users/new">Registrar Usuario</Link>
      </div>

      {err && <div className="error">Error: {err}</div>}

      {loading ? (
        <div className="hint">Cargando usuarios…</div>
      ) : (
        <div className="users-table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>RUT</th>
                <th>Email</th>
                <th>Empresa</th>
                <th>Nombre</th>
                <th>Segundo nombre</th>
                <th>Primer apellido</th>
                <th>Segundo apellido</th>
                <th>Género</th>
                <th>Cargo</th>
                <th>F. Nacimiento</th>
                <th>F. Ingreso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length ? users.map((u) => (
                <tr key={u.rut}>
                  <td>{u.rut}</td>
                  <td>{u.email}</td>
                  <td>{u.company_code || u.company_name || ""}</td>
                  <td>{u.first_name || ""}</td>
                  <td>{u.middle_name || ""}</td>
                  <td>{u.last_name || ""}</td>
                  <td>{u.second_last_name || ""}</td>
                  <td>{u.gender || ""}</td>
                  <td>{u.position || ""}</td>
                  <td>{u.birth_date ? new Date(u.birth_date).toLocaleDateString() : ""}</td>
                  <td>{u.hire_date ? new Date(u.hire_date).toLocaleDateString() : ""}</td>
                  <td>
                    <div className="cell-actions">
                      <Link className="btn" to={`/home/users/${encodeURIComponent(u.rut)}/edit`}>Editar</Link>
                      <button className="btn" onClick={() => onDelete(u.rut)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={12}>No hay usuarios para mostrar.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}