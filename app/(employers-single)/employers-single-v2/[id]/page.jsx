import employersInfo from "@/data/topCompany";
import LoginPopup from "@/components/common/form/login/LoginPopup";
import FooterDefault from "@/components/footer/common-footer";
import DefaulHeader from "@/components/header/DefaulHeader";
import MobileMenu from "@/components/header/MobileMenu";
import JobDetailsDescriptions from "@/components/employer-single-pages/shared-components/JobDetailsDescriptions";
import RelatedJobs from "@/components/employer-single-pages/related-jobs/RelatedJobs";
import MapJobFinder from "@/components/job-listing-pages/components/MapJobFinder";
import Social from "@/components/employer-single-pages/social/Social";
import PrivateMessageBox from "@/components/employer-single-pages/shared-components/PrivateMessageBox";
import Image from "next/image";

export const metadata = {
  title:
    "Employers Single Dyanmic V2 || Superio - Job Borad React NextJS Template",
  description: "Superio - Job Borad React NextJS Template",
};

const EmployersSingleV2 = ({ params }) => {
  const id = params.id;

  const employer =
    employersInfo.find((item) => item.id == id) || employersInfo[0];

  return (
    <>
      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      {/* <!-- Job Detail Section --> */}
      <section className="job-detail-section">
        {/* <!-- job-detail-outer--> */}
        <div className="job-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12">
                {/*  job-detail */}
                <JobDetailsDescriptions />
                {/* End job-detail */}

                {/* <!-- Related Jobs --> */}
                <div className="related-jobs">
                  <div className="title-box">
                    <h3>3 Others jobs available</h3>
                    <div className="text">
                      2020 jobs live - 293 added today.
                    </div>
                  </div>
                  {/* End .title-box */}

                  <RelatedJobs />
                  {/* End RelatedJobs */}
                </div>
                {/* <!-- Related Jobs --> */}
              </div>
              {/* End .content-column */}

              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  <div className="btn-box">
                    <button
                      className="theme-btn btn-style-one"
                      data-bs-toggle="modal"
                      data-bs-target="#privateMessage"
                    >
                      Private Message
                    </button>
                    <button className="bookmark-btn">
                      <i className="flaticon-bookmark"></i>
                    </button>
                  </div>
                  {/* End btn-box */}

                  {/* <!-- Modal --> */}
                  <div
                    className="modal fade"
                    id="privateMessage"
                    tabIndex="-1"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                      <div className="apply-modal-content modal-content">
                        <div className="text-center">
                          <h3 className="title">
                            Send message to {employer.name}
                          </h3>
                          <button
                            type="button"
                            className="closed-modal"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        {/* End modal-header */}

                        <PrivateMessageBox />
                        {/* End PrivateMessageBox */}
                      </div>
                      {/* End .send-private-message-wrapper */}
                    </div>
                  </div>
                  {/* End .modal */}

                  <div className="sidebar-widget company-widget">
                    <div className="widget-content">
                      <div className="company-title">
                        <span className="company-logo">
                          <Image
                            width={60}
                            height={60}
                            src={employer?.img}
                            alt="logo"
                          />
                        </span>
                        <h4 className="mb-1">{employer?.name}</h4>
                        <a href="#" className="company-link">
                          Open Jobs – {employer.jobNumber}
                        </a>
                      </div>
                      {/* End company-title */}

                      {/*  compnay-info */}
                      <ul className="company-info">
                        <li>
                          Primary industry: <span>Software</span>
                        </li>
                        <li>
                          Company size: <span>501-1,000</span>
                        </li>
                        <li>
                          Founded in: <span>2011</span>
                        </li>
                        <li>
                          Phone: <span>{employer?.phone}</span>
                        </li>
                        <li>
                          Email: <span>{employer?.email}</span>
                        </li>
                        <li>
                          Location: <span>{employer?.location}</span>
                        </li>
                        <li>
                          Social media:
                          <Social />
                        </li>
                      </ul>
                      {/* End compnay-info */}

                      <div className="btn-box">
                        <a
                          href="#"
                          className="theme-btn btn-style-three"
                          style={{ textTransform: "lowercase" }}
                        >
                          www.{employer?.name}.com
                        </a>
                      </div>
                      {/* btn-box */}
                    </div>
                  </div>
                  {/* End company-widget */}

                  <div className="sidebar-widget">
                    {/* <!-- Map Widget --> */}
                    <h4 className="widget-title">Job Location</h4>
                    <div className="widget-content">
                      <div style={{ height: "300px", width: "100%" }}>
                        <MapJobFinder />
                      </div>
                    </div>
                    {/* <!--  Map Widget --> */}
                  </div>
                  {/* End sidebar-widget */}
                </aside>
                {/* End .sidebar */}
              </div>
              {/* End .sidebar-column */}
            </div>
          </div>
        </div>
        {/* <!-- job-detail-outer--> */}
      </section>
      {/* <!-- End Job Detail Section --> */}

      <FooterDefault footerStyle="alternate5" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default EmployersSingleV2;
