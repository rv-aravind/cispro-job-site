// theme code
// 'use client'

// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import employerMenuData from "../../data/employerMenuData";
// import HeaderNavContent from "./HeaderNavContent";
// import { isActiveLink } from "../../utils/linkActiveChecker";
// import { usePathname } from "next/navigation";


// const DashboardHeader = () => {
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
//                                     src="/images/resource/company-6.png"
//                                     width={50}
//                                     height={50}
//                                 />
//                                 <span className="name">My Account</span>
//                             </a>

//                             <ul className="dropdown-menu">
//                                 {employerMenuData.map((item) => (
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

// export default DashboardHeader;


// new
'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import employerMenuData from "../../data/employerMenuData";
import HeaderNavContent from "./HeaderNavContent";
import { isActiveLink } from "../../utils/linkActiveChecker";

const DashboardHeader = () => {
    const [navbar, setNavbar] = useState(false);
    const [name, setName] = useState("My Account");
    const router = useRouter();
    const pathname = usePathname();

    // Change header background on scroll
    const changeBackground = () => {
        setNavbar(window.scrollY >= 0);
    };

    // Add scroll event listener
    useEffect(() => {
        window.addEventListener("scroll", changeBackground);
        return () => window.removeEventListener("scroll", changeBackground);
    }, []);

    // Check authentication and set user name
    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

         // allows employer, admin, or superadmin
        if (!token || !user || !["employer","admin","superadmin"].includes(user.role)) {
            router.push("/login");
        } else {
            setName(user.name || "My Account");
        }
    }, [router]);

    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     const user = JSON.parse(localStorage.getItem("user"));

    //     if (!token || !user || !["employer", "admin", "superadmin"].includes(user.role)) {
    //         router.push("/login");
    //     } else {
    //         setName(user.name || "My Account");
    //     }
    // }, [router]);

    // Handle sign-out
    const handleSignOut = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/auth/sign-out`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/login");
            } else {
                console.error("Sign-out failed");
            }
        } catch (error) {
            console.error("Sign-out error:", error);
        }
    };

    return (
        <header
            className={`main-header header-shaddow ${
                navbar ? "fixed-header " : ""
            }`}
        >
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
                                    src="/images/resource/company-6.png"
                                    width={50}
                                    height={50}
                                />
                                <span className="name">{name}</span>
                            </a>

                            <ul className="dropdown-menu">
                                {employerMenuData.map((item) => (
                                    <li
                                        className={`${
                                            isActiveLink(item.routePath, pathname)
                                                ? "active"
                                                : ""
                                        } mb-1`}
                                        key={item.id}
                                    >
                                        {item.name === "Logout" ? (
                                            <button
                                                onClick={handleSignOut}
                                                className="dropdown-item"
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    padding: 0,
                                                }}
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

export default DashboardHeader;