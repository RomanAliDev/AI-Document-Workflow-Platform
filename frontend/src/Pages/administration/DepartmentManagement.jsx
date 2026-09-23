import { useState, useEffect } from "react";
import {
  getDepartments,
  createDepartment,
  deleteDepartment,
} from "../../services/department";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();

      setDepartments(data);
    } catch (error) {
      console.error("Failed to load departments.", error);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleCreateDepartment = async (event) => {
    event.preventDefault();

    try {
      await createDepartment(formData);

      await loadDepartments();

      setFormData({
        name: "",
        description: "",
      });

      setShowForm(false);
    } catch (error) {
      const message =
        error.response?.data?.detail || "Failed to create department.";

      window.alert(message);
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this department?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDepartment(departmentId);

      await loadDepartments();
    } catch (error) {
      const message =
        error.response?.data?.detail || "Failed to delete department.";

      window.alert(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Department Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage departments and assigned users.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600  px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">
          + Create Department
        </button>
      </div>
      {/* Create Department Form */}
      {showForm && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Create Department
          </h2>

          <form
            onSubmit={handleCreateDepartment}
            className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Department Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
            />

            <textarea
              name="description"
              placeholder="Department Description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
            />

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-lg bg-blue-600  cursor-pointer px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">
                Create Department
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg cursor-pointer border px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Departments Table */}
      {/* Departments Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-4 py-4 sm:px-6">
          <h2 className="font-semibold text-gray-900">Departments</h2>
        </div>

        {departments.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 sm:p-6">
            No departments found.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[700px] w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-700 sm:px-6">
                    Department
                  </th>

                  <th className="px-4 py-3 font-semibold text-gray-700 sm:px-6">
                    Description
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-700 sm:px-6">
                    Assigned Users
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-700 sm:px-6">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {departments.map((department) => (
                  <tr key={department.id} className="border-t">
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 sm:px-6">
                      {department.name}
                    </td>

                    <td className="max-w-[280px] px-4 py-4 text-gray-600 sm:px-6">
                      <div className="break-words">
                        {department.description || "-"}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-gray-600 sm:px-6">
                      {department.users_count}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                      <button
                        type="button"
                        onClick={() => handleDeleteDepartment(department.id)}
                        className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>{" "}
    </div>
  );
};

export default DepartmentManagement;
