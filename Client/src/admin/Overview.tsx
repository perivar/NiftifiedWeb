import React from 'react';
import { Link } from 'react-router-dom';

function Overview({ match }: { match: any }) {
  const { path } = match;

  return (
    <div>
      <h3>Admin</h3>
      <p>This section can only be accessed by administrators.</p>
      <p>
        <Link to={`${path}/users`}>Manage Users</Link>
      </p>
    </div>
  );
}

export { Overview };
