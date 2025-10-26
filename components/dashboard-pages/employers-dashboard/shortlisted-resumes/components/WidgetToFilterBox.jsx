"use client";

import { useState, useEffect } from "react";

const WidgetToTopFilterBox = ({ filters, setFilters, setPagination }) => {
  const [jobs, setJobs] = useState([]);

  // Fetch employer's job posts for the job dropdown
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/jobs`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (data.success) {
          setJobs(data.jobs || []);
        } else {
          console.error("Failed to fetch jobs:", data.message);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  return (
    <div className="chosen-outer">
      {/* <!--search box--> */}
      <div className="search-box-one">
        <form method="post" action="blog.html">
          <div className="form-group">
            <span className="icon flaticon-search-1"></span>
            {/* <input
              type="search"
              name="search-field"
              placeholder="Search"
              required
            /> */}
             <input
              type="text"
              name="search"
              className="chosen-single form-input"
              value={filters.search || ""}
              onChange={handleFilterChange}
              placeholder="Search by name or email"
            />
          </div>
        </form>
      </div>
      {/* End searchBox one */}

      {/* <!--Tabs Box--> */}
      <select
        name="jobId"
        className="chosen-single form-select chosen-container"
        value={filters.jobId || ""}
        onChange={handleFilterChange}
      >
        <option value="">All Jobs</option>
        {jobs.map((job) => (
          <option key={job._id} value={job._id}>
            {job.title}
          </option>
        ))}
      </select>
      <select
        name="status"
        className="chosen-single form-select chosen-container"
        value={filters.status}
        onChange={handleFilterChange}
      >
        <option value="All">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Reviewed">Reviewed</option>
        <option value="Accepted">Accepted</option>
        <option value="Rejected">Rejected</option>
      </select>
      <select
        name="dateRange"
        className="chosen-single form-select chosen-container"
        value={filters.dateRange}
        onChange={handleFilterChange}
      >
        <option value="All">All Time</option>
        <option value="Last 12 Months">Last 12 Months</option>
        <option value="Last 16 Months">Last 16 Months</option>
        <option value="Last 24 Months">Last 24 Months</option>
        <option value="Last 5 year">Last 5 Years</option>
      </select>
    </div>
  );
};

export default WidgetToTopFilterBox;
