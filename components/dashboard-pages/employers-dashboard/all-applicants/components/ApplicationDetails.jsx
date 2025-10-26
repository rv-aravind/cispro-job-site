"use client";

import { useRouter, useParams } from "next/navigation"; // Use for App Router
import { useState, useEffect } from "react";
import Link from "next/link";

const ApplicationDetails = () => {
  const router = useRouter();
  const params = useParams();
  const { applicationId } = params; // Get applicationId from dynamic route
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (applicationId) {
      const fetchApplication = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/applicants/get/${applicationId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });

          const data = await res.json();
          if (data.success) {
            setApplication(data.application);
          } else {
            setError(data.message || "Failed to fetch application details");
          }
        } catch (err) {
          setError("Error fetching application details");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchApplication();
    }
  }, [applicationId]);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-center py-5 text-red-500">{error}</div>;
  if (!application) return <div className="text-center py-5">No application found</div>;

  return (
    <div className="page-wrapper dashboard">
      <div className="dashboard-outer">
        <div className="container">
          <h2 className="mb-4">Application Details</h2>
          <form className="default-form">
            <div className="row">
              {/* Candidate Name */}
              <div className="form-group col-lg-6 col-md-12">
                <label>Candidate Name</label>
                <input
                  type="text"
                  value={application.name || "N/A"}
                  className="form-control"
                  disabled
                />
              </div>

              {/* Job Title */}
              <div className="form-group col-lg-6 col-md-12">
                <label>Job Title</label>
                <input
                  type="text"
                  value={application.jobTitle || "N/A"}
                  className="form-control"
                  disabled
                />
              </div>

              {/* Designation */}
              <div className="form-group col-lg-6 col-md-12">
                <label>Designation</label>
                <input
                  type="text"
                  value={application.designation || "N/A"}
                  className="form-control"
                  disabled
                />
              </div>

              {/* Location */}
              <div className="form-group col-lg-6 col-md-12">
                <label>Location</label>
                <input
                  type="text"
                  value={application.location || "N/A"}
                  className="form-control"
                  disabled
                />
              </div>

              {/* Expected Salary */}
              <div className="form-group col-lg-6 col-md-12">
                <label>Expected Salary</label>
                <input
                  type="text"
                  value={application.expectedSalary || "N/A"}
                  className="form-control"
                  disabled
                />
              </div>

              {/* Application Status */}
              <div className="form-group col-lg-6 col-md-12">
                <label>Application Status</label>
                <input
                  type="text"
                  value={application.status || "N/A"}
                  className="form-control"
                  disabled
                />
              </div>

              {/* Shortlisted */}
              <div className="form-group col-lg-6 col-md-12">
                <label>Shortlisted</label>
                <input
                  type="text"
                  value={application.shortlisted ? "Yes" : "No"}
                  className="form-control"
                  disabled
                />
              </div>

              {/* Applied At */}
              <div className="form-group col-lg-6 col-md-12">
                <label>Applied At</label>
                <input
                  type="text"
                  value={new Date(application.appliedAt).toLocaleDateString() || "N/A"}
                  className="form-control"
                  disabled
                />
              </div>

              {/* Tags */}
              <div className="form-group col-lg-12 col-md-12">
                <label>Tags</label>
                {/* <input
                  type="text"
                  value={application.tags.join(", ") || "N/A"}
                  className="form-control"
                  disabled
                /> */}
              </div>

              {/* Resume */}
              <div className="form-group col-lg-12 col-md-12">
                <label>Resume</label>
                <div>
                  {application.resume ? (
                    <a
                      href={application.resume}
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

              {/* Back Button */}
              <div className="form-group col-lg-12 col-md-12 d-flex justify-content-end">
                <button
                  type="button"
                  className="theme-btn btn-style-two"
                  onClick={() => router.back()}
                >
                  Back
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;