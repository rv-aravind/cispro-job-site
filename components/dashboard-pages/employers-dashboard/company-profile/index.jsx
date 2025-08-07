'use client'

import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import MenuToggler from "../../MenuToggler";
import CompanyProfileForm from "./components/CompanyProfileForm"; // Unified form component

// console.log("indexrgvrd", profileId);

const CompanyProfilePage = ({ mode = 'view', profileId }) => {
  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>

      {/* Login Modal */}
      <LoginPopup />

      {/* Dashboard Header */}
      <DashboardHeader />

      {/* Mobile Sidebar Menu */}
      <MobileMenu />

      {/* Left Sidebar */}
      <DashboardEmployerSidebar />

      {/* Main Content Area */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          {/* Page Title */}
          <BreadCrumb title="Company Profile" />

          {/* Menu toggler (for mobile view) */}
          <MenuToggler />

          {/* Form Box */}
          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                     <h4>{mode === 'edit' ? 'Edit' : 'View'} Company Profile</h4>
                  </div>
                  <div className="widget-content">
                      {/* ✅ PASS PROPS HERE */}
                    <CompanyProfileForm mode={mode} profileId={profileId} />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <CopyrightFooter />
    </div>
  );
};

export default CompanyProfilePage;