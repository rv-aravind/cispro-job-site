// 'use client'

// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import candidatesMenuData from "../../data/candidatesMenuData";
// import HeaderNavContent from "./HeaderNavContent";
// import { isActiveLink } from "../../utils/linkActiveChecker";

// import { usePathname } from "next/navigation";
// const DashboardCandidatesHeader = () => {
//     const [navbar, setNavbar] = useState(false);



//     const changeBackground = () => {
//         if (window.scrollY >= 0) {
//             setNavbar(true);
//         } else {
//             setNavbar(false);
//         }
//     };

//     useEffect(() => {
//         window.addEventListener("scroll", changeBackground);
//     }, []);

//     return (
//         // <!-- Main Header-->
//         <header
//             className={`main-header header-shaddow  ${
//                 navbar ? "fixed-header " : ""
//             }`}
//         >
//             <div className="container-fluid">
//                 {/* <!-- Main box --> */}
//                 <div className="main-box">
//                     {/* <!--Nav Outer --> */}
//                     <div className="nav-outer">
//                         <div className="logo-box">
//                             <div className="logo">
//                                 <Link href="/">
//                                     <Image
//                                         alt="brand"
//                                         src="/images/logo.svg"
//                                         width={154}
//                                         height={50}
//                                         priority
//                                     />
//                                 </Link>
//                             </div>
//                         </div>
//                         {/* End .logo-box */}

//                         <HeaderNavContent />
//                         {/* <!-- Main Menu End--> */}
//                     </div>
//                     {/* End .nav-outer */}

//                     <div className="outer-box">
//                         <button className="menu-btn">
//                             <span className="count">1</span>
//                             <span className="icon la la-heart-o"></span>
//                         </button>
//                         {/* wishlisted menu */}

//                         <button className="menu-btn">
//                             <span className="icon la la-bell"></span>
//                         </button>
//                         {/* End notification-icon */}

//                         {/* <!-- Dashboard Option --> */}
//                         <div className="dropdown dashboard-option">
//                             <a
//                                 className="dropdown-toggle"
//                                 role="button"
//                                 data-bs-toggle="dropdown"
//                                 aria-expanded="false"
//                             >
//                                 <Image
//                                     alt="avatar"
//                                     className="thumb"
//                                     src="/images/resource/candidate-1.png"
//                                     width={50}
//                                     height={50}
//                                 />
//                                 <span className="name">My Account</span>
//                             </a>

//                             <ul className="dropdown-menu">
//                                 {candidatesMenuData.map((item) => (
//                                     <li
//                                         className={`${
//                                             isActiveLink(
//                                                 item.routePath,
//                                                 usePathname()
//                                             )
//                                                 ? "active"
//                                                 : ""
//                                         } mb-1`}
//                                         key={item.id}
//                                     >
//                                         <Link href={item.routePath}>
//                                             <i
//                                                 className={`la ${item.icon}`}
//                                             ></i>{" "}
//                                             {item.name}
//                                         </Link>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                         {/* End dropdown */}
//                     </div>
//                     {/* End outer-box */}
//                 </div>
//             </div>
//         </header>
//     );
// };

// export default DashboardCandidatesHeader;

//new
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import candidatesMenuData from '../../data/candidatesMenuData';
import HeaderNavContent from './HeaderNavContent';
import { isActiveLink } from '../../utils/linkActiveChecker';
import { usePathname } from 'next/navigation';

const DashboardCandidatesHeader = () => {
  const [navbar, setNavbar] = useState(false);
  const [name, setname] = useState('My Account');
  const router = useRouter();
  const pathname = usePathname();

  const changeBackground = () => {
    setNavbar(window.scrollY >= 0);
  };

 useEffect(() => {
    // Check for authentication
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user || user.role !== 'candidate') {
      router.push('/register');
    } else {
      setname(user.name || 'User');
    }
  }, [router]);

  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/auth/sign-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login
        router.push('/login');
      } else {
        console.error('Sign-out failed');
      }
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <header className={`main-header header-shaddow ${navbar ? 'fixed-header' : ''}`}>
      <div className="container-fluid">
        <div className="main-box">
          <div className="nav-outer">
            <div className="logo-box">
              <div className="logo">
                <Link href="/">
                  <Image
                    alt="brand"
                    src="/images/logo.svg"
                    width={154}
                    height={50}
                    priority
                  />
                </Link>
              </div>
            </div>
            <HeaderNavContent />
          </div>

          <div className="outer-box">
            <button className="menu-btn">
              <span className="count">1</span>
              <span className="icon la la-heart-o"></span>
            </button>
            <button className="menu-btn">
              <span className="icon la la-bell"></span>
            </button>

            <div className="dropdown dashboard-option">
              <a
                className="dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Image
                  alt="avatar"
                  className="thumb"
                  src="/images/resource/candidate-1.png"
                  width={50}
                  height={50}
                />
                <span className="name">{name}</span>
              </a>

              <ul className="dropdown-menu">
                {candidatesMenuData.map((item) => (
                  <li
                    className={`${isActiveLink(item.routePath, pathname) ? 'active' : ''} mb-1`}
                    key={item.id}
                  >
                    {item.name === 'Logout' ? (
                      <button
                        onClick={handleSignOut}
                        className="dropdown-item"
                        style={{ background: 'none', border: 'none', padding: 0 }}
                      >
                        <i className={`la ${item.icon}`}></i> {item.name}
                      </button>
                    ) : (
                      <Link href={item.routePath}>
                        <i className={`la ${item.icon}`}></i> {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardCandidatesHeader;