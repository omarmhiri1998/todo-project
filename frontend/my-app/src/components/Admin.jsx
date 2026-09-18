import {
  useEffect,
  useState
} from "react";

import "./Admin.css";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3070";

function Admin({
  onBack
}) {
  const [
    users,
    setUsers
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  async function refreshAccessToken() {
    try {
      const response =
        await fetch(
          `${API}/refresh`,
          {
            method: "POST",
            credentials:
              "include"
          }
        );

      return response.ok;

    } catch {
      return false;
    }
  }

  async function adminRequest(
    url,
    options = {},
    retry = true
  ) {
    let response =
      await fetch(
        url,
        {
          ...options,

          credentials:
            "include",

          headers: {
            ...options.headers
          }
        }
      );

    if (
      response.status === 401 &&
      retry
    ) {
      const refreshed =
        await refreshAccessToken();

      if (refreshed) {
        response =
          await fetch(
            url,
            {
              ...options,

              credentials:
                "include",

              headers: {
                ...options.headers
              }
            }
          );
      }
    }

    return response;
  }

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response =
        await adminRequest(
          `${API}/admin/users`
        );

      if (!response.ok) {
        const data =
          await response.json();

        throw new Error(
          data.message ||
          "Could not load users"
        );
      }

      const data =
        await response.json();

      setUsers(data);

    } catch (error) {
      setError(
        error.message
      );

    } finally {
      setLoading(false);
    }
  }

  async function changeRole(
    id,
    role
  ) {
    try {
      setError("");

      const response =
        await adminRequest(
          `${API}/admin/users/${id}/role`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({
                role
              })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Could not update role"
        );
      }

      await loadUsers();

    } catch (error) {
      setError(
        error.message
      );
    }
  }

  async function removeUser(
    id
  ) {
    const confirmed =
      window.confirm(
        "Delete this user?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response =
        await adminRequest(
          `${API}/admin/users/${id}`,
          {
            method: "DELETE"
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Could not delete user"
        );
      }

      await loadUsers();

    } catch (error) {
      setError(
        error.message
      );
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="admin-page">

      <div className="admin-card">

        <div className="admin-header">

          <button
            type="button"
            className="admin-back"
            onClick={onBack}
          >
            ← Back
          </button>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage users and roles
          </p>

        </div>

        {error && (
          <p className="admin-error">
            {error}
          </p>
        )}

        {loading ? (
          <p className="loading">
            Loading...
          </p>
        ) : (
          <div className="admin-users">

            {users.map(
              (currentUser) => (

                <div
                  className="admin-user"
                  key={
                    currentUser.id
                  }
                >

                  <div className="admin-user-info">

                    <strong>
                      {currentUser.email}
                    </strong>

                    <span>
                      {currentUser.role}
                    </span>

                  </div>

                  <div className="admin-actions">

                    <select
                      value={
                        currentUser.role
                      }

                      onChange={(e) =>
                        changeRole(
                          currentUser.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="user">
                        User
                      </option>

                      <option value="admin">
                        Admin
                      </option>
                    </select>

                    <button
                      type="button"
                      className="admin-delete"
                      onClick={() =>
                        removeUser(
                          currentUser.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default Admin;