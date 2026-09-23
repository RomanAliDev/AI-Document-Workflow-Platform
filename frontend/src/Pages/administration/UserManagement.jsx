import { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser } from "../../services/users";
import { getDepartments } from "../../services/department";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    department_id: "",
  });

  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error("Failed to load departments.", error);
    }
  };

  useEffect(() => {
    loadUsers();
    loadDepartments();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();

    try {
      await createUser(formData);

      setFormData({
        full_name: "",
        email: "",
        password: "",
        department_id: "",
      });

      setShowForm(false);

      await loadUsers();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(userId);

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user.id !== userId),
      );
    } catch (error) {
      const message = error.response?.data?.detail || "Failed to delete user.";

      window.alert(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            User Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage users and their access roles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600  cursor-pointer px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">
          + Create User
        </button>
      </div>

      {/* Create User Form */}
      {showForm && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Create User
          </h2>

          <form
            onSubmit={handleCreateUser}
            className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
            />

            <select
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              className="rounded-lg border px-3 py-2 text-sm outline-none">
              <option value="">Select Department</option>

              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 cursor-pointer px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Create User
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border px-4 py-2 cursor-pointer text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold text-gray-900">Users</h2>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-700">
                    Name
                  </th>

                  <th className="px-6 py-3 font-semibold text-gray-700">
                    Email
                  </th>

                  <th className="px-6 py-3 font-semibold text-gray-700">
                    Role
                  </th>

                  <th className="px-6 py-3 font-semibold text-gray-700">
                    Department
                  </th>

                  <th className="px-6 py-3 font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-6 py-4 text-gray-900">
                      {user.full_name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">{user.email}</td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {departments.find(
                        (department) =>
                          department.id === Number(user.department_id),
                      )?.name || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-sm font-medium cursor-pointer text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserManagement;
