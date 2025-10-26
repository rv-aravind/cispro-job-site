"use client";
import { useState, useEffect } from "react";
// import candidatesData from "../../../../../data/candidates";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Link from "next/link";
import Image from "next/image";


const WidgetContentBox = ({ filters, setFilters, pagination, setPagination }) => {
  const [applicants, setApplicants] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    Total: 0,
    Pending: 0,
    Reviewed: 0,
    Accepted: 0,
    Rejected: 0,
    Shortlisted: 0,
  });
  const [activeTab, setActiveTab] = useState("Total");
  const [jobTitle, setJobTitle] = useState(filters.jobId ? "Applicants for Job" : "All Applicants");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch job title if jobId is provided
  useEffect(() => {
    if (filters.jobId) {
      const fetchJobTitle = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/jobs/${filters.jobId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          const data = await res.json();
          if (data.success) {
            setJobTitle(data.job.title);
          }
        } catch (error) {
          console.error("Error fetching job title:", error);
        }
      };
      fetchJobTitle();
    } else {
      setJobTitle("All Applicants");
    }
  }, [filters.jobId]);

  // Fetch applicants based on filters
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const endpoint = filters.jobId
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/applicants/${filters.jobId}?status=${filters.status}&dateRange=${filters.dateRange}&search=${filters.search}&page=${pagination.currentPage}&limit=${pagination.limit}`
          : `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/applicants?status=${filters.status}&dateRange=${filters.dateRange}&search=${filters.search}&page=${pagination.currentPage}&limit=${pagination.limit}`;
        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (data.success) {
          setApplicants(data.applicants);
          setStatusCounts(data.statusCounts);
          setPagination((prev) => ({
            ...prev,
            ...data.pagination,
          }));
        } else {
          setApplicants([]); // ensure UI doesn’t retain old state
          console.error("Failed to fetch applicants:", data.message);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };
    fetchApplicants();
  }, [filters, pagination.currentPage, setPagination]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilters((prev) => ({
      ...prev,
      status: tab === "Total" ? "All" : tab,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle shortlist/unshortlist with confirmation
  const handleShortlist = async (applicationId, isShortlisted) => {
    const action = isShortlisted ? "remove from shortlist" : "shortlist";
    if (window.confirm(`Are you sure you want to ${action} this applicant?`)) {
      try {
        const endpoint = isShortlisted
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/applicants/${applicationId}/unshortlist`
          : `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/applicants/${applicationId}/shortlist`;
        const res = await fetch(endpoint, {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (data.success) {
          setApplicants(
            applicants.map((app) =>
              app.applicationId === applicationId
                ? { ...app, shortlisted: !isShortlisted }
                : app
            )
          );
          // Refresh status counts
          const refreshRes = await fetch(
            filters.jobId
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/applicants/${filters.jobId}?status=All`
              : `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/applicants?status=All`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          const refreshData = await refreshRes.json();
          if (refreshData.success) setStatusCounts(refreshData.statusCounts);
          alert(`${action.charAt(0).toUpperCase() + action.slice(1)} successful!`);
        } else {
          alert(`Failed to ${action}: ${data.message}`);
        }
      } catch (error) {
        console.error(`Error updating shortlist status:`, error);
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
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/applicants/${filters.jobId}?status=All`
              : `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/applicants?status=All`,
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
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/applicants/${filters.jobId}?status=All`
              : `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/applicants?status=All`,
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

      // ensure modal DOM exists, then show via Bootstrap JS
      const modalEl = document.getElementById('applicationModal');
      if (modalEl && window.bootstrap) {
        // create instance or get existing one
        const bsModal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        bsModal.show();
      } else {
        // fallback: set local flag to render modal if Bootstrap not available
        setIsModalOpen(true);
      }
    } else {
      alert(`Failed to fetch application: ${data.message}`);
    }
  } catch (error) {
    console.error("Error fetching application:", error);
    alert(`Error: ${error.message}`);
  }
};


// close the modal
const closeModal = () => {
  const modalEl = document.getElementById("applicationModal");
  if (modalEl && window.bootstrap) {
    const bsModal = window.bootstrap.Modal.getInstance(modalEl);
    bsModal?.hide();
  }
  setSelectedApplication(null);
};

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  return (
    <div className="widget-content">
      <div className="tabs-box">
        <Tabs  selectedIndex={["Total", "Accepted", "Rejected", "Shortlisted"].indexOf(activeTab)} onSelect={(index) => handleTabChange(["Total", "Accepted", "Rejected", "Shortlisted"][index])}>
          <div className="aplicants-upper-bar">
           <h6>{jobTitle}</h6>
            <TabList className="aplicantion-status tab-buttons clearfix">
              <Tab className="tab-btn totals"> Total(s): {statusCounts.Total}</Tab>
              <Tab className="tab-btn approved"> Approved: {statusCounts.Accepted}</Tab>
              <Tab className="tab-btn rejected"> Rejected(s): {statusCounts.Rejected}</Tab>
              {/* <Tab className="tab-btn shortlisted"> Shortlisted: {statusCounts.Shortlisted}</Tab> */}
            </TabList>
          </div>

          <div className="tabs-content">
             {["Total", "Accepted", "Rejected", "Shortlisted"].map((tabStatus, index) => (
            <TabPanel key={index}>
              <div className="row">
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
                          <li className="designation">
                            {candidate.designation}
                          </li>
                          <li>
                            <span className="icon flaticon-map-locator"></span>{" "}
                            {candidate.location}
                          </li>
                          <li>
                            <span className="icon flaticon-money"></span> 
                            {candidate.expectedSalary} 
                          </li>
                           {!filters.jobId && <li>Job: {candidate.jobTitle}</li>}
                        </ul>
                        {/* End candidate-info */}

                        <ul className="post-tags">
                          {candidate.tags.map((val, i) => (
                            <li key={i}>
                              <a href="#">{val}</a>
                            </li>
                          ))}
                        </ul>
                        {candidate.shortlisted && tabStatus !== "Shortlisted" && (
                            <span className="shortlisted-badge">Shortlisted</span>
                            )}
                      </div>
                      {/* End content */}

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
                          <li>
                            <button
                                  data-text={
                                    candidate.shortlisted
                                      ? "Remove from Shortlist"
                                      : "Shortlist Applicant"
                                  }
                                  onClick={() =>
                                    handleShortlist(candidate.applicationId, candidate.shortlisted)
                                  }
                                >
                              <span className={candidate.shortlisted ? "la la-star" : "la la-star-o"}></span>
                            </button>
                          </li>
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
                    <div className="no-applicants">No applicants found.</div>
                  )}
              </div>
               {pagination.totalPages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        disabled={pagination.currentPage === i + 1}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
            </TabPanel>
              ))}
          </div>
        </Tabs>
      </div>

   {/* ✅ Always render the modal — do NOT wrap it in isModalOpen && ... */}
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
                {/* Candidate Name */}
                <div className="form-group col-lg-6 col-md-12">
                  <label>Candidate Name</label>
                  <input
                    type="text"
                    value={selectedApplication.candidateProfile?.fullName || "N/A"}
                    className="form-control"
                    disabled
                  />
                </div>

                {/* Job Title */}
                <div className="form-group col-lg-6 col-md-12">
                  <label>Job Title</label>
                  <input
                    type="text"
                    value={selectedApplication.jobPost?.title || "N/A"}
                    className="form-control"
                    disabled
                  />
                </div>

                {/* Designation */}
                <div className="form-group col-lg-6 col-md-12">
                  <label>Designation</label>
                  <input
                    type="text"
                    value={selectedApplication.candidateProfile?.jobTitle || "N/A"}
                    className="form-control"
                    disabled
                  />
                </div>

                {/* Location */}
                <div className="form-group col-lg-6 col-md-12">
                  <label>Location</label>
                  <input
                    type="text"
                    value={
                      selectedApplication.candidateProfile?.location?.completeAddress ||
                      `${selectedApplication.candidateProfile?.location?.city || "N/A"}, ${
                        selectedApplication.candidateProfile?.location?.country || "N/A"
                      }`
                    }
                    className="form-control"
                    disabled
                  />
                </div>

                {/* Expected Salary */}
                <div className="form-group col-lg-6 col-md-12">
                  <label>Expected Salary</label>
                  <input
                    type="text"
                    value={selectedApplication.candidateProfile?.expectedSalary || "N/A"}
                    className="form-control"
                    disabled
                  />
                </div>

                {/* Application Status */}
                <div className="form-group col-lg-6 col-md-12">
                  <label>Application Status</label>
                  <input
                    type="text"
                    value={selectedApplication.status || "N/A"}
                    className="form-control"
                    disabled
                  />
                </div>

                {/* Shortlisted */}
                <div className="form-group col-lg-6 col-md-12">
                  <label>Shortlisted</label>
                  <input
                    type="text"
                    value={selectedApplication.shortlisted ? "Yes" : "No"}
                    className="form-control"
                    disabled
                  />
                </div>

                {/* Applied Date */}
                <div className="form-group col-lg-6 col-md-12">
                  <label>Applied At</label>
                  <input
                    type="text"
                    value={
                      new Date(selectedApplication.createdAt).toLocaleDateString() || "N/A"
                    }
                    className="form-control"
                    disabled
                  />
                </div>

                {/* Email */}
                <div className="form-group col-lg-6 col-md-12">
                  <label>Email</label>
                  <input
                    type="text"
                    value={selectedApplication.candidate?.email || "N/A"}
                    className="form-control"
                    disabled
                  />
                </div>

                {/* Phone */}
                <div className="form-group col-lg-6 col-md-12">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={selectedApplication.candidateProfile?.phone || "N/A"}
                    className="form-control"
                    disabled
                  />
                </div>

                {/* Categories */}
                <div className="form-group col-lg-12 col-md-12">
                  <label>Categories</label>
                  <input
                    type="text"
                    value={
                      selectedApplication.candidateProfile?.categories?.join(", ") || "N/A"
                    }
                    className="form-control"
                    disabled
                  />
                </div>

                {/* Description */}
                <div className="form-group col-lg-12 col-md-12">
                  <label>Description</label>
                  <textarea
                    value={selectedApplication.description || "N/A"}
                    className="form-control"
                    disabled
                    rows={4}
                  />
                </div>

                {/* Resume */}
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

                {/* Close Button */}
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


    </div>
  );
};

export default WidgetContentBox;
