// import Applicants from "./Applicants";

// const WidgetContentBox = () => {
//   return (
//     <div className="widget-content">
//       <div className="row">
//         <Applicants />
//       </div>
//       {/* <!-- Pagination --> */}
//       <nav className="ls-pagination mb-5">
//         <ul>
//           <li className="prev">
//             <a href="#">
//               <i className="fa fa-arrow-left"></i>
//             </a>
//           </li>
//           <li>
//             <a href="#">1</a>
//           </li>
//           <li>
//             <a href="#" className="current-page">
//               2
//             </a>
//           </li>
//           <li>
//             <a href="#">3</a>
//           </li>
//           <li className="next">
//             <a href="#">
//               <i className="fa fa-arrow-right"></i>
//             </a>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default WidgetContentBox;



"use client";

import { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Applicants from "./Applicants";

const WidgetContentBox = ({ filters, setFilters, pagination, setPagination }) => {
  const [applicants, setApplicants] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    Total: 0,
    Pending: 0,
    Reviewed: 0,
    Accepted: 0,
    Rejected: 0,
  });
  const [activeTab, setActiveTab] = useState("Total");
  const [jobTitle, setJobTitle] = useState(filters.jobId ? "Applicants for Job" : "Shortlisted Resumes");

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
      setJobTitle("Shortlisted Resumes");
    }
  }, [filters.jobId]);

  // Fetch shortlisted applicants based on filters
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/employer-dashboard/shortlisted-resumes?${filters.jobId ? `jobId=${filters.jobId}&` : ""}status=${filters.status}&dateRange=${filters.dateRange}&search=${filters.search}&page=${pagination.currentPage}&limit=${pagination.limit}`;
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
          console.error("Failed to fetch shortlisted resumes:", data.message);
        }
      } catch (error) {
        console.error("Error fetching shortlisted resumes:", error);
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

  return (
    <div className="widget-content">
      <div className="tabs-box">
        <Tabs selectedIndex={["Total", "Accepted", "Rejected"].indexOf(activeTab)} onSelect={(index) => handleTabChange(["Total", "Accepted", "Rejected"][index])}>
          <div className="aplicants-upper-bar">
            <h6>{jobTitle}</h6>
            <TabList className="aplicantion-status tab-buttons clearfix">
              <Tab className="tab-btn totals"> Total(s): {statusCounts.Total}</Tab>
              <Tab className="tab-btn approved"> Approved: {statusCounts.Accepted}</Tab>
              <Tab className="tab-btn rejected"> Rejected(s): {statusCounts.Rejected}</Tab>
            </TabList>
          </div>
          <div className="tabs-content">
            {["Total", "Accepted", "Rejected"].map((tabStatus, index) => (
              <TabPanel key={index}>
                <div className="row">
                  <Applicants
                    applicants={applicants}
                    setApplicants={setApplicants}
                    filters={filters}
                    setStatusCounts={setStatusCounts}
                  />
                </div>
                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPagination((prev) => ({ ...prev, currentPage: i + 1 }))}
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
    </div>
  );
};

export default WidgetContentBox;