'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const JobListingsTable = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token"); // Adjust token usage based on your auth flow
        const response = await fetch("/api/v1/employer-dashboard/jobs/fetch-all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setJobs(data.jobPosts);
        } else {
          console.error("Failed to fetch job posts:", data.message);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this job post?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/v1/employer-dashboard/jobs/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setJobs(jobs.filter((job) => job._id !== id));
        } else {
          console.error("Failed to delete job post");
        }
      } catch (error) {
        console.error("Error deleting job post:", error);
      }
    }
  };

  return (
    <div className="tabs-box">
      <div className="widget-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4>My Job Listings</h4>
        <div className="chosen-outer">
          <select className="chosen-single form-select">
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
            <option>Last 16 Months</option>
            <option>Last 24 Months</option>
            <option>Last 5 Years</option>
          </select>
        </div>
      </div>

      <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Applications</th>
                <th>Created & Expired</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">Loading...</td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No job posts found.</td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <div className="job-block">
                        <div className="inner-box">
                          <div className="content">
                            {/* <span className="company-logo">
                              <Image
                                width={50}
                                height={49}
                                src={`http://localhost:5000${job.companyProfile?.logo || "/images/default-logo.png"}`}
                                alt={job.companyProfile?.companyName || "Company Logo"}
                              />
                            </span> */}
                            <h4>
                              <Link href={`/employer/job/edit/${job._id}`}>
                                {job.title}
                              </Link>
                            </h4>
                            <ul className="job-info">
                              <li>
                                <span className="icon flaticon-map-locator"></span>
                                {job.location?.city}, {job.location?.country}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="applied">
                      <a href="#">3+ Applied</a> {/* Make dynamic later if needed */}
                    </td>
                    <td>
                      {new Date(job.createdAt).toLocaleDateString()} <br />
                      {new Date(job.applicationDeadline).toLocaleDateString()}
                    </td>
                    <td className="status">{job.status}</td>
                    <td>
                      <div className="option-box">
                        <ul className="option-list">
                          <li>
                            <Link href={`/employers-dashboard/post-jobs/view/${job._id}`} data-text="View Job">
                              <span className="la la-eye"></span>
                            </Link>
                          </li>
                          <li>
                            <Link href={`/employers-dashboard/post-jobs/edit/${job._id}`} data-text="Edit Job">
                              <span className="la la-pencil"></span>
                            </Link>
                          </li>
                          <li>
                            <button onClick={() => handleDelete(job._id)} data-text="Delete Job">
                              <span className="la la-trash"></span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobListingsTable;
