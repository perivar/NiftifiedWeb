import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { accountService } from '../../_services/account.service';

function List({ match }: { match: any }) {
  const { path } = match;
  const [users, setUsers] = useState<any | null>(null);

  useEffect(() => {
    accountService.getAll().then((x: any) => setUsers(x));
  }, []);

  function deleteUser(id: string) {
    setUsers(
      users !== null &&
        users.map((x: any) => {
          if (x.id === id) {
            x.isDeleting = true;
          }
          return x;
        })
    );
    accountService.delete(id).then(() => {
      setUsers((users: any) => users.filter((x: any) => x.id !== id));
    });
  }

  return (
    <div>
      <h1>Users</h1>
      <p>All users (admin only):</p>
      <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">
        Add User
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: '30%' }}>Name</th>
            <th style={{ width: '30%' }}>Email</th>
            <th style={{ width: '30%' }}>Role</th>
            <th style={{ width: '10%' }}></th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user: any) => (
              <tr key={user.id}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <Link to={`${path}/edit/${user.id}`} className="btn btn-sm btn-primary mr-1">
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="btn btn-sm btn-danger"
                    style={{ width: '60px' }}
                    disabled={user.isDeleting}>
                    {user.isDeleting ? <span className="spinner-border spinner-border-sm"></span> : <span>Delete</span>}
                  </button>
                </td>
              </tr>
            ))}
          {!users && (
            <tr>
              <td colSpan={4} className="text-center">
                <span className="spinner-border spinner-border-lg align-center"></span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export { List };
