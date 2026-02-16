function fmtDate(d) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return String(d);
  }
}

export default function UsersTable({ users = [] }) {
  if (!users.length) {
    return <div className="hint">No hay usuarios para mostrar.</div>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table">
        <thead>
          <tr>
            <th>RUT</th>
            <th>Email</th>
            <th>Nombre</th>
            <th>Segundo nombre</th>
            <th>Primer apellido</th>
            <th>Segundo apellido</th>
            <th>Género</th>
            <th>Cargo</th>
            <th>F. Nacimiento</th>
            <th>F. Ingreso</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.rut}>
              <td>{u.rut}</td>
              <td>{u.email}</td>
              <td>{u.first_name || ''}</td>
              <td>{u.middle_name || ''}</td>
              <td>{u.last_name || ''}</td>
              <td>{u.second_last_name || ''}</td>
              <td>{u.gender || ''}</td>
              <td>{u.position || ''}</td>
              <td>{fmtDate(u.birth_date)}</td>
              <td>{fmtDate(u.hire_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
