'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import MenuToggler from "../../MenuToggler";
import Select from "react-select";

const CompanyProfile = ({ mode = 'view', profileId }) => {

  // console.log("Params received in [id].jsx:", params);
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    website: '',
    establishedSince: '',
    teamSize: '',
    categories: [],
    description: '',
    allowSearch: 'Yes',
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      googlePlus: '',
    },
    contactInfo: {
      country: '',
      city: '',
      address: '',
    },
  });
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(mode === 'edit');

  const catOptions = [
    { value: "Banking", label: "Banking" },
    { value: "Digital & Creative", label: "Digital & Creative" },
    { value: "Retail", label: "Retail" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Management", label: "Management" },
    { value: "Accounting & Finance", label: "Accounting & Finance" },
    { value: "Digital", label: "Digital" },
    { value: "Creative Art", label: "Creative Art" },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/v1/employer-dashboard/company-profile/get/${profileId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setFormData(data.profile);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch profile data');
      }
    };
    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [name]: value },
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [name]: value },
    }));
  };

  const handleCategoryChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      categories: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/employer-dashboard/company-profile/update/${profileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Profile updated successfully!');
        router.push(`/company-profile/${profileId}`);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>
       {/* <!-- Header Span for hight --> */}

    <LoginPopup />
    {/* End Login Popup Modal */}

    <DashboardHeader />
    {/* End Header */}

    <MobileMenu />
    {/* End MobileMenu */}

    <DashboardEmployerSidebar />
    {/* <!-- End User Sidebar Menu --> */}

    {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
        <BreadCrumb title="Company Profile!" />
            {/* breadCrumb */}

            <MenuToggler />
            {/* Collapsible sidebar button */}

          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>My Profile</h4>
                  </div>
                  <div className="widget-content">
                    <div className="row">
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Company Name</label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="Invision"
                          disabled={!isEditMode}
                        />
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="ib-themes"
                          disabled={!isEditMode}
                        />
                      </div>
                      {/* Add other fields similarly */}
                    </div>
                  </div>

                  {isEditMode && (
                    <div className="form-group col-lg-12 col-md-12">
                      <button onClick={handleSubmit} className="theme-btn btn-style-one">
                        Save Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
       <CopyrightFooter />
        {/* <!-- End Copyright --> */}
    </div>
  );
};

export default CompanyProfile;