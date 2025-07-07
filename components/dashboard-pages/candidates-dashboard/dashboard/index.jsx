// import MobileMenu from "../../../header/MobileMenu";
// import LoginPopup from "../../../common/form/login/LoginPopup";
// import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
// import BreadCrumb from "../../BreadCrumb";
// import TopCardBlock from "./components/TopCardBlock";
// import ProfileChart from "./components/ProfileChart";
// import Notification from "./components/Notification";
// import CopyrightFooter from "../../CopyrightFooter";
// import JobApplied from "./components/JobApplied";
// import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
// import MenuToggler from "../../MenuToggler";

// const Index = () => {
//   return (
//     <div className="page-wrapper dashboard">
//       <span className="header-span"></span>
//       {/* <!-- Header Span for hight --> */}

//       <LoginPopup />
//       {/* End Login Popup Modal */}

//       <DashboardCandidatesHeader />
//       {/* End Header */}

//       <MobileMenu />
//       {/* End MobileMenu */}

//       <DashboardCandidatesSidebar />
//       {/* <!-- End Candidates Sidebar Menu --> */}

//       {/* <!-- Dashboard --> */}
//       <section className="user-dashboard">
//         <div className="dashboard-outer">
//           <BreadCrumb title="Howdy, Jerome!!" />
//           {/* breadCrumb */}

//           <MenuToggler />
//           {/* Collapsible sidebar button */}

//           <div className="row">
//             <TopCardBlock />
//           </div>
//           {/* End .row top card block */}

//           <div className="row">
//             <div className="col-xl-7 col-lg-12">
//               {/* <!-- Graph widget --> */}
//               <div className="graph-widget ls-widget">
//                 <ProfileChart />
//               </div>
//               {/* End profile chart */}
//             </div>
//             {/* End .col */}

//             <div className="col-xl-5 col-lg-12">
//               {/* <!-- Notification Widget --> */}
//               <div className="notification-widget ls-widget">
//                 <div className="widget-title">
//                   <h4>Notifications</h4>
//                 </div>
//                 <div className="widget-content">
//                   <Notification />
//                 </div>
//               </div>
//             </div>
//             {/* End .col */}

//             <div className="col-lg-12">
//               {/* <!-- applicants Widget --> */}
//               <div className="applicants-widget ls-widget">
//                 <div className="widget-title">
//                   <h4>Jobs Applied Recently</h4>
//                 </div>
//                 <div className="widget-content">
//                   <div className="row">
//                     {/* <!-- Candidate block three --> */}

//                     <JobApplied />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* End .col */}
//           </div>
//           {/* End .row profile and notificatins */}
//         </div>
//         {/* End dashboard-outer */}
//       </section>
//       {/* <!-- End Dashboard --> */}

//       <CopyrightFooter />
//       {/* <!-- End Copyright --> */}
//     </div>
//     // End page-wrapper
//   );
// };

// export default Index;



//new

'use client';

import { useState, useEffect } from 'react';
import MobileMenu from '../../../header/MobileMenu';
import LoginPopup from '../../../common/form/login/LoginPopup';
import DashboardCandidatesSidebar from '../../../header/DashboardCandidatesSidebar';
import BreadCrumb from '../../BreadCrumb';
import TopCardBlock from './components/TopCardBlock';
import ProfileChart from './components/ProfileChart';
import Notification from './components/Notification';
import CopyrightFooter from '../../CopyrightFooter';
import JobApplied from './components/JobApplied';
import DashboardCandidatesHeader from '../../../header/DashboardCandidatesHeader';
import MenuToggler from '../../MenuToggler';

const Index = () => {
  const [name, setname] = useState('User');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      setname(user.name);
    }
  }, []);

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>

      <LoginPopup />
      <DashboardCandidatesHeader />
      <MobileMenu />
      <DashboardCandidatesSidebar />

      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title={`Howdy, ${name}!!`} />
          <MenuToggler />

          <div className="row">
            <TopCardBlock />
          </div>

          <div className="row">
            <div className="col-xl-7 col-lg-12">
              <div className="graph-widget ls-widget">
                <ProfileChart />
              </div>
            </div>

            <div className="col-xl-5 col-lg-12">
              <div className="notification-widget ls-widget">
                <div className="widget-title">
                  <h4>Notifications</h4>
                </div>
                <div className="widget-content">
                  <Notification />
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="applicants-widget ls-widget">
                <div className="widget-title">
                  <h4>Jobs Applied Recently</h4>
                </div>
                <div className="widget-content">
                  <div className="row">
                    <JobApplied />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CopyrightFooter />
    </div>
  );
};

export default Index;