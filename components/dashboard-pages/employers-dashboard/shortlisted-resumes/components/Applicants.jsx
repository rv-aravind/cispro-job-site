"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Applicants = ({ applicants, setApplicants, filters, setStatusCounts }) => {
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Handle unshortlist with confirmation
  const handleUnshortlist = async (applicationId) => {
    if (window.confirm("Are you sure you want to remove this applicant from shortlist?")) {
      try {
        const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/applicants/${applicationId}/unshortlist`;
        const res = await fetch(endpoint, {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (data.success) {
          setApplicants(applicants.filter((app) => app.applicationId !== applicationId));
          // Refresh status counts
          const refreshRes = await fetch(
            filters.jobId
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer/shortlisted-resumes?jobId=${filters.jobId}&status=All`
              : `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer/shortlisted-resumes?status=All`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          const refreshData = await refreshRes.json();
          if (refreshData.success) setStatusCounts(refreshData.statusCounts);
          alert("Removed from shortlist successfully!");
        } else {
          alert(`Failed to unshortlist: ${data.message}`);
        }
      } catch (error) {
        console.error("Error unshortlisting applicant:", error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  // Handle status update (approve/reject) with confirmation
  const handleStatusUpdate = async (applicationId, status) => {
    if (window.confirm(`Are you sure you want to ${status.toLowerCase()} this application?`)) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/applicants/${applicationId}/status`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });
        const data = await res.json();
        if (data.success) {
          setApplicants(
            applicants.map((app) =>
              app.applicationId === applicationId ? { ...app, status } : app
            )
          );
          // Refresh status counts
          const refreshRes = await fetch(
            filters.jobId
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer/shortlisted-resumes?jobId=${filters.jobId}&status=All`
              : `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer/shortlisted-resumes?status=All`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          const refreshData = await refreshRes.json();
          if (refreshData.success) setStatusCounts(refreshData.statusCounts);
          alert(`${status} successful!`);
        } else {
          alert(`Failed to update status: ${data.message}`);
        }
      } catch (error) {
        console.error(`Error updating status to ${status}:`, error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  // Handle delete application with confirmation
  const handleDelete = async (applicationId) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/applicants/delete/${applicationId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (data.success) {
          setApplicants(applicants.filter((app) => app.applicationId !== applicationId));
          // Refresh status counts
          const refreshRes = await fetch(
            filters.jobId
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer/shortlisted-resumes?jobId=${filters.jobId}&status=All`
              : `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer/shortlisted-resumes?status=All`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          const refreshData = await refreshRes.json();
          if (refreshData.success) setStatusCounts(refreshData.statusCounts);
          alert("Application deleted successfully!");
        } else {
          alert(`Failed to delete: ${data.message}`);
        }
      } catch (error) {
        console.error("Error deleting application:", error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  // Handle view application
  const handleViewApplication = async (applicationId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/applicants/get/${applicationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) {
        setSelectedApplication(data.application);
        const modalEl = document.getElementById("applicationModal");
        if (modalEl && window.bootstrap) {
          const bsModal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
          bsModal.show();
        }
      } else {
        alert(`Failed to fetch application: ${data.message}`);
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Close the modal
  const closeModal = () => {
    const modalEl = document.getElementById("applicationModal");
    if (modalEl && window.bootstrap) {
      const bsModal = window.bootstrap.Modal.getInstance(modalEl);
      bsModal?.hide();
    }
    setSelectedApplication(null);
  };

  return (
    <>
      {applicants.length > 0 ? (
        applicants.map((candidate) => (
          <div
            className="candidate-block-three col-lg-6 col-md-12 col-sm-12"
            key={candidate.id}
          >
            <div className="inner-box">
              <div className="content">
                <figure className="image">
                  <Image
                    width={80}
                    height={80}
                    src={candidate.avatar}
                    alt="candidates"
                    className="rounded-full object-cover border"
                  />
                </figure>
                <h4 className="name">
                  <Link href={`/candidates-single-v1/${candidate.id}`}>
                    {candidate.name}
                  </Link>
                </h4>
                <ul className="candidate-info">
                  <li className="designation">{candidate.designation}</li>
                  <li>
                    <span className="icon flaticon-map-locator"></span>{" "}
                    {candidate.location}
                  </li>
                  <li>
                    <span className="icon flaticon-money"></span>{" "}
                    {candidate.hourlyRate}
                  </li>
                  {!filters.jobId && <li>Job: {candidate.jobTitle}</li>}
                </ul>
                <ul className="post-tags">
                  {candidate.tags.map((val, i) => (
                    <li key={i}>
                      <a href="#">{val}</a>
                    </li>
                  ))}
                </ul>
                {/* <span className="shortlisted-badge">Shortlisted</span> */}
              </div>
              <div className="option-box">
                <ul className="option-list">
                  <li>
                    <button
                      data-text="View Application"
                      onClick={() => handleViewApplication(candidate.applicationId)}
                      data-bs-toggle="modal"
                      data-bs-target="#applicationModal"
                    >
                      <span className="la la-eye"></span>
                    </button>
                  </li>
                  {/* <li>
                    <button
                      data-text="Remove from Shortlist"
                      onClick={() => handleUnshortlist(candidate.applicationId)}
                    >
                      <span className="la la-star-o"></span>
                    </button>
                  </li> */}
                  <li>
                    <button
                      data-text="Approve Application"
                      onClick={() => handleStatusUpdate(candidate.applicationId, "Accepted")}
                      disabled={candidate.status === "Accepted"}
                      className={candidate.status === "Accepted" ? "disabled" : ""}
                    >
                      <span className="la la-check"></span>
                    </button>
                  </li>
                  <li>
                    <button
                      data-text="Reject Application"
                      onClick={() => handleStatusUpdate(candidate.applicationId, "Rejected")}
                      disabled={candidate.status === "Rejected"}
                      className={candidate.status === "Rejected" ? "disabled" : ""}
                    >
                      <span className="la la-times-circle"></span>
                    </button>
                  </li>
                  <li>
                    <button
                      data-text="Delete Application"
                      onClick={() => handleDelete(candidate.applicationId)}
                    >
                      <span className="la la-trash"></span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-applicants">No shortlisted resumes found.</div>
      )}

      {/* Modal for Application Details */}
      <div
        className="modal fade"
        id="applicationModal"
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
              {!selectedApplication ? (
                <div className="p-5 text-center">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="mt-3">Loading application details...</p>
                </div>
              ) : (
                <div className="form-inner">
                  <h3 className="mb-3">Application Details</h3>
                  <form className="default-form">
                    <div className="row g-3">
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Candidate Name</label>
                        <input
                          type="text"
                          value={selectedApplication.candidateProfile?.fullName || selectedApplication.name || "N/A"}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Job Title</label>
                        <input
                          type="text"
                          value={selectedApplication.jobPost?.title || selectedApplication.jobTitle || "N/A"}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Designation</label>
                        <input
                          type="text"
                          value={selectedApplication.candidateProfile?.jobTitle || selectedApplication.designation || "N/A"}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Location</label>
                        <input
                          type="text"
                          value={
                            selectedApplication.candidateProfile?.location?.completeAddress ||
                            `${selectedApplication.candidateProfile?.location?.city || selectedApplication.location || "N/A"}, ${
                              selectedApplication.candidateProfile?.location?.country || "N/A"
                            }`
                          }
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Expected Salary</label>
                        <input
                          type="text"
                          value={selectedApplication.candidateProfile?.expectedSalary || selectedApplication.hourlyRate || "N/A"}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Application Status</label>
                        <input
                          type="text"
                          value={selectedApplication.status || "N/A"}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Shortlisted</label>
                        <input
                          type="text"
                          value={selectedApplication.shortlisted ? "Yes" : "No"}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Applied At</label>
                        <input
                          type="text"
                          value={
                            new Date(selectedApplication.appliedAt || selectedApplication.createdAt).toLocaleDateString() || "N/A"
                          }
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Email</label>
                        <input
                          type="text"
                          value={selectedApplication.candidate?.email || "N/A"}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Phone</label>
                        <input
                          type="text"
                          value={selectedApplication.candidateProfile?.phone || "N/A"}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group col-lg-12 col-md-12">
                        <label>Categories</label>
                        <input
                          type="text"
                          value={selectedApplication.candidateProfile?.categories?.join(", ") || selectedApplication.tags?.join(", ") || "N/A"}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group col-lg-12 col-md-12">
                        <label>Description</label>
                        <textarea
                          value={selectedApplication.description || "N/A"}
                          className="form-control"
                          disabled
                          rows={4}
                        />
                      </div>
                      <div className="form-group col-lg-12 col-md-12">
                        <label>Resume</label>
                        <div>
                          {selectedApplication.resume ? (
                            <a
                              href={selectedApplication.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="theme-btn btn-style-one"
                            >
                              Download Resume
                            </a>
                          ) : (
                            <span>No resume available</span>
                          )}
                        </div>
                      </div>
                      <div className="form-group col-lg-12 col-md-12 d-flex justify-content-end mt-4">
                        <button
                          type="button"
                          className="theme-btn btn-style-two"
                          data-bs-dismiss="modal"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Applicants;