'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CandidateProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch candidate profiles (for this candidate)
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/candidate-dashboard/profile/fetch-all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();
        if (data.success && data.profiles) {
          setProfiles(data.profiles);
        } else {
          console.error("Failed to fetch profiles:", data.message);
        }
      } catch (error) {
        console.error("Error fetching candidate profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Handle delete functionality
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this profile?")) {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/candidate-dashboard/profile/delete/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();
        if (response.ok && data.success) {
          setProfiles(profiles.filter((p) => p._id !== id));
          alert("Profile deleted successfully!");
        } else {
          console.error("Failed to delete profile:", data.message);
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  if (loading) {
    return <p>Loading your candidate profiles...</p>;
  }

  return (
    <div className="tabs-box">
      <div
        className="widget-title"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <h4>My Candidate Profiles</h4>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link
            href="/candidates-dashboard/my-profile/create"
            className="theme-btn btn-style-one"
          >
            Create Profile
          </Link>
        </div>
      </div>

      {/* Table content */}
      <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Full Name</th>
                <th>Job Title</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {profiles.length > 0 ? (
                profiles.map((profile) => (
                  <tr key={profile._id}>
                    <td>
                      {profile.profilePhoto ? (
                        <img
                          width={60}
                          height={60}
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${profile.profilePhoto}`}
                          alt={`${profile.fullName}'s photo`}
                          style={{ borderRadius: "50%" }}
                        />
                      ) : (
                        <img
                          width={60}
                          height={60}
                          src="/images/default-user.png"
                          alt="default profile"
                          style={{ borderRadius: "50%" }}
                        />
                      )}
                    </td>

                    <td>
                      <h5>{profile.fullName}</h5>
                    </td>

                    <td>{profile.jobTitle || "N/A"}</td>
                    <td>{profile.email || "N/A"}</td>
                    <td>{profile.phone || "N/A"}</td>
                    <td>
                      {profile.location?.city && profile.location?.country
                        ? `${profile.location.city}, ${profile.location.country}`
                        : "N/A"}
                    </td>

                    <td>
                      <div className="option-box">
                        <ul className="option-list">
                          <li>
                            <Link
                              href={`/candidates-dashboard/my-profile/view/${profile._id}`}
                              data-text="View Profile"
                            >
                              <span className="la la-eye"></span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href={`/candidates-dashboard/my-profile/${profile._id}`}
                              data-text="Edit Profile"
                            >
                              <span className="la la-pencil"></span>
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={() => handleDelete(profile._id)}
                              data-text="Delete Profile"
                            >
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
                  <td colSpan={7} className="text-center">
                    No profiles found. Please create your candidate profile.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
