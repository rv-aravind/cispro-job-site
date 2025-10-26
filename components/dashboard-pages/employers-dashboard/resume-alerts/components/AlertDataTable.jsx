// const AlertDataTable = () => {
//   return (
//     <table className="default-table manage-job-table">
//       <thead>
//         <tr>
//           <th>Title</th>
//           <th>Alert Query</th>
//           <th>Number Jobs</th>
//           <th>Times</th>
//           <th>Actions</th>
//         </tr>
//       </thead>
//       {/* End thead */}

//       <tbody>
//         <tr>
//           <td>Education</td>
//           <td>
//             Category: Education Training, Posted Date: All, Salary: $1000 –
//             $3000
//           </td>
//           <td>Jobs found 5</td>
//           <td>Weekly</td>
//           <td>
//             <button>
//               <i className="la la-trash colored"></i>
//             </button>
//           </td>
//         </tr>
//         {/* End tr */}

//         <tr>
//           <td>Accounting and Finance</td>
//           <td>
//             Category: Education Training, Posted Date: All, Salary: $1000 –
//             $3000
//           </td>
//           <td>Jobs found 5</td>
//           <td>Weekly</td>
//           <td>
//             <button>
//               <i className="la la-trash colored"></i>
//             </button>
//           </td>
//         </tr>
//         {/* End tr */}

//         <tr>
//           <td>Education</td>
//           <td>
//             Category: Education Training, Posted Date: All, Salary: $1000 –
//             $3000
//           </td>
//           <td>Jobs found 5</td>
//           <td>Weekly</td>
//           <td>
//             <button>
//               <i className="la la-trash colored"></i>
//             </button>
//           </td>
//         </tr>
//         {/* End tr */}

//         <tr>
//           <td>Accounting and Finance</td>
//           <td>
//             Category: Education Training, Posted Date: All, Salary: $1000 –
//             $3000
//           </td>
//           <td>Jobs found 5</td>
//           <td>Weekly</td>
//           <td>
//             <button>
//               <i className="la la-trash colored"></i>
//             </button>
//           </td>
//         </tr>
//         {/* End tr */}

//         <tr>
//           <td>Education</td>
//           <td>
//             Category: Education Training, Posted Date: All, Salary: $1000 –
//             $3000
//           </td>
//           <td>Jobs found 5</td>
//           <td>Weekly</td>
//           <td>
//             <button>
//               <i className="la la-trash colored"></i>
//             </button>
//           </td>
//         </tr>
//         {/* End tr */}

//         <tr>
//           <td>Accounting and Finance</td>
//           <td>
//             Category: Education Training, Posted Date: All, Salary: $1000 –
//             $3000
//           </td>
//           <td>Jobs found 5</td>
//           <td>Weekly</td>
//           <td>
//             <button>
//               <i className="la la-trash colored"></i>
//             </button>
//           </td>
//         </tr>
//         {/* End tr */}
//       </tbody>
//     </table>
//   );
// };

// export default AlertDataTable;



//new dynamic implemenation
"use client";

import { useState, useEffect } from "react";

const AlertDataTable = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [formData, setFormData] = useState(initialFormState());
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Load alerts initially
  useEffect(() => {
    fetchAlerts();
  }, []);

  // ✅ Utility - Reset form
  function initialFormState() {
    return {
      title: "",
      frequency: "Instant",
      criteria: {
        categories: [],
        location: { country: "India", city: "" },
        experience: "",
        skills: [],
        salaryRange: { min: "", max: "" },
        educationLevels: [],
        diversity: {
          gender: "No Preference",
          ageRange: { min: 18, max: 65 },
        },
        remoteWork: "Any",
        keywords: [],
      },
    };
  }

  // ✅ Fetch alerts
  const fetchAlerts = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/resume-alerts/get-all`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await res.json();
      if (data.success) setAlerts(data.alerts);
      else console.error("Failed to fetch alerts:", data.message);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  // ✅ Delete alert
  const deleteAlert = async (alertId) => {
    if (!window.confirm("Are you sure you want to delete this alert?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/resume-alerts/delete/${alertId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Resume alert deleted successfully!");
        fetchAlerts();
      } else alert(`Failed to delete: ${data.message}`);
    } catch (err) {
      alert("Error deleting alert: " + err.message);
    }
  };

  // ✅ Open modal for Create
  const handleCreateNew = () => {
    setFormData(initialFormState());
    setIsEditing(false);
    openModal();
  };

  // ✅ Open modal for Edit
  const handleEdit = (alert) => {
    setSelectedAlert(alert);
    setFormData(alert);
    setIsEditing(true);
    openModal();
  };

  // ✅ Open/Close modal helpers
  const openModal = () => {
    const modalEl = document.getElementById("resumeAlertModal");
    if (modalEl) {
      import("bootstrap/dist/js/bootstrap.bundle.min.js").then(({ Modal }) => {
        const modalInstance = Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
      });
    }
  };


  const closeModal = () => {
    const modalEl = document.getElementById("resumeAlertModal");
    if (modalEl) {
      import("bootstrap/dist/js/bootstrap.bundle.min.js").then(({ Modal }) => {
        const modalInstance = Modal.getInstance(modalEl) || Modal.getOrCreateInstance(modalEl);
        modalInstance.hide();
      });
    }
  };


  // ✅ Handle input changes
  const handleChange = (e, path) => {
    const { name, value } = e.target;
    if (path) {
      setFormData((prev) => ({
        ...prev,
        [path]: { ...prev[path], [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Handle comma-separated fields (arrays)
  const handleArrayInput = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [field]: value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
      },
    }));
  };

  // ✅ Submit Create or Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // basic validation
    if (!formData.title) {
      alert("Please enter a title for the resume alert");
      setLoading(false);
      return;
    }

    const endpoint = isEditing
      ? `update/${selectedAlert._id}`
      : "create";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/resume-alerts/${endpoint}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (data.success) {
        alert(
          isEditing
            ? "Resume alert updated successfully!"
            : "Resume alert created successfully!"
        );
        closeModal();
        fetchAlerts();
      } else {
        alert(`Failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error saving alert:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Format criteria for table
  const formatCriteria = (criteria) => {
    const parts = [];
    if (criteria.categories?.length)
      parts.push(`Categories: ${criteria.categories.join(", ")}`);
    if (criteria.location?.city)
      parts.push(`Location: ${criteria.location.city}`);
    if (criteria.experience) parts.push(`Experience: ${criteria.experience}`);
    if (criteria.skills?.length)
      parts.push(`Skills: ${criteria.skills.join(", ")}`);
    if (criteria.salaryRange?.min || criteria.salaryRange?.max)
      parts.push(
        `Salary: ₹${criteria.salaryRange.min / 100000 || 0}L - ₹${
          criteria.salaryRange.max / 100000 || "Any"
        }L`
      );
    return parts.join(", ");
  };

  return (
    <>
      {/* Header with Create Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Resume Alerts</h4>
        <button className="theme-btn btn-style-one" onClick={handleCreateNew}>
          + Create New Alert
        </button>
      </div>

      {/* Resume Alert Table */}
      <table className="default-table manage-job-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Alert Query</th>
            <th>Resumes Found</th>
            <th>Frequency</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {alerts.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                No resume alerts found.
              </td>
            </tr>
          ) : (
            alerts.map((alert) => (
              <tr key={alert._id}>
                <td>{alert.title}</td>
                <td>{formatCriteria(alert.criteria)}</td>
                <td>{alert.stats.totalMatches || 0}</td>
                <td>{alert.frequency}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEdit(alert)}
                  >
                    <i className="la la-edit"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteAlert(alert._id)}
                  >
                    <i className="la la-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
      <div
        className="modal fade"
        id="resumeAlertModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <button
              type="button"
              className="closed-modal"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={closeModal}
            ></button>
            <div className="modal-body">
              <h3>{isEditing ? "Edit Resume Alert" : "Create New Resume Alert"}</h3>
              <form className="default-form" onSubmit={handleSubmit}>
                <div className="row g-3 mt-2">
                  <div className="form-group col-md-6">
                    <label>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label>Frequency</label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option>Instant</option>
                      <option>Daily</option>
                      <option>Weekly</option>
                    </select>
                  </div>

                  <div className="form-group col-md-6">
                    <label>Categories</label>
                    <input
                      type="text"
                      placeholder="e.g. DevOps, Engineering"
                      value={formData.criteria.categories.join(", ")}
                      onChange={(e) =>
                        handleArrayInput("categories", e.target.value)
                      }
                      className="form-control"
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label>Skills</label>
                    <input
                      type="text"
                      placeholder="e.g. AWS, Docker"
                      value={formData.criteria.skills.join(", ")}
                      onChange={(e) =>
                        handleArrayInput("skills", e.target.value)
                      }
                      className="form-control"
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label>Location (City)</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.criteria.location.city}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          criteria: {
                            ...prev.criteria,
                            location: {
                              ...prev.criteria.location,
                              city: e.target.value,
                            },
                          },
                        }))
                      }
                      className="form-control"
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label>Experience</label>
                    <select
                      value={formData.criteria.experience}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          criteria: {
                            ...prev.criteria,
                            experience: e.target.value,
                          },
                        }))
                      }
                      className="form-control"
                    >
                      <option value="">Select</option>
                      <option>Less than 1 year</option>
                      <option>1-3 years</option>
                      <option>3-5 years</option>
                      <option>5-10 years</option>
                      <option>10+ years</option>
                    </select>
                  </div>

                  <div className="form-group col-md-6">
                    <label>Salary Min (₹)</label>
                    <input
                      type="number"
                      placeholder="1500000"
                      value={formData.criteria.salaryRange.min}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          criteria: {
                            ...prev.criteria,
                            salaryRange: {
                              ...prev.criteria.salaryRange,
                              min: Number(e.target.value),
                            },
                          },
                        }))
                      }
                      className="form-control"
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label>Salary Max (₹)</label>
                    <input
                      type="number"
                      placeholder="3000000"
                      value={formData.criteria.salaryRange.max}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          criteria: {
                            ...prev.criteria,
                            salaryRange: {
                              ...prev.criteria.salaryRange,
                              max: Number(e.target.value),
                            },
                          },
                        }))
                      }
                      className="form-control"
                    />
                  </div>

                  <div className="form-group col-md-12">
                    <label>Keywords</label>
                    <input
                      type="text"
                      placeholder="e.g. CI/CD, Kubernetes"
                      value={formData.criteria.keywords.join(", ")}
                      onChange={(e) =>
                        handleArrayInput("keywords", e.target.value)
                      }
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="theme-btn btn-style-one"
                  >
                    {loading ? "Saving..." : isEditing ? "Update Alert" : "Create Alert"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertDataTable;
