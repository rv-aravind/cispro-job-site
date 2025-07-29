// export default FormContent2;
'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect,useState } from 'react';
import { useRouter } from 'next/navigation';
// companyprofiletable.jsx

const CompanyProfileListingsTable = () => {
  const [profiles, setProfiles] = useState([]);

  // Fetch company profiles from the backend API
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const response = await fetch("/api/v1/employer-dashboard/company-profile/fetch-all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setProfiles(data.profiles);
        } else {
          console.error("Failed to fetch profiles:", data.message);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
    fetchProfiles();
  }, []);

  // Handle delete functionality
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this profile?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/v1/employer-dashboard/company-profile/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          // Remove the deleted profile from the state
          setProfiles(profiles.filter((profile) => profile._id !== id));
        } else {
          console.error("Failed to delete profile");
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  return (
    <div className="tabs-box">
      <div className="widget-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4>My Company Profile Listings</h4>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Filter dropdown */}
          <div className="chosen-outer">
            <select className="chosen-single form-select">
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
              <option>Last 16 Months</option>
              <option>Last 24 Months</option>
              <option>Last 5 Years</option>
            </select>
          </div>
          {/* Add Company Profile button */}
          <Link href="/api/v1/employer-dashboard/company-profile/create" className="theme-btn btn-style-one">
            Add Company Profile
          </Link>
        </div>
      </div>

      {/* Table content */}
      <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Website</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.length > 0 ? (
                profiles.map((profile) => (
                  <tr key={profile._id}>
                    <td>
                      <div className="job-block">
                        <div className="inner-box">
                          <div className="content">
                            <span className="company-logo">
                              {profile.logo ? (
                                <img
                                  width={50}
                                  height={49}
                                  src={`http://localhost:5000${profile.logo}`}
                                  alt={`${profile.companyName} logo`}
                                />
                              ) : (
                                <img
                                  width={50}
                                  height={49}
                                  src="/images/default-logo.png"
                                  alt="default logo"
                                />
                              )}
                            </span>
                            <h4>
                              <Link href={`/api/v1/employer-dashboard/company-profile/${profile._id}`}>
                                {profile.companyName}
                              </Link>
                            </h4>
                            <ul className="job-info">
                              <li>
                                <span className="icon flaticon-briefcase"></span>
                                {profile.industry || "N/A"}
                              </li>
                              <li>
                                <span className="icon flaticon-map-locator"></span>
                                {profile.location && profile.location.city && profile.location.country
                                  ? `${profile.location.city}, ${profile.location.country}`
                                  : "N/A"}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{profile.email || "N/A"}</td>
                    <td>{profile.phone || "N/A"}</td>
                    <td>
                      {profile.website ? (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer">
                          {profile.website}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      <div className="option-box">
                        <ul className="option-list">
                          <li>
                            {/* <Link href={`/company-profile/${profile._id}`} data-text="View Profile"> */}
                              <span className="la la-eye"></span>
                            {/* </Link> */}
                          </li>
                          <li>
                            {/* <Link href={`/company-profile/edit/${profile._id}`} data-text="Edit Profile"> */}
                              <span className="la la-pencil"></span>
                            {/* </Link> */}
                          </li>
                          <li>
                            <button onClick={() => handleDelete(profile._id)} data-text="Delete Profile">
                              <span className="la la-trash"></span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">No profiles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileListingsTable;