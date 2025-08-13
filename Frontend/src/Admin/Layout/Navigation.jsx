// import React from 'react'
// import { useState } from 'react'
// import { Link } from 'react-router-dom'

// const Navigation = () => {

//   const [isNavigationOpen, setIsNavigationOpen] = useState(false);

//   const toggleNavigation = () => {
//     setIsNavigationOpen(prevState => !prevState);
//   };

//   return (

//         <ul className={`x-navigation ${isNavigationOpen ? 'x-navigation-open' : ''}`}>
//         <li className="xn-logo">
//           <Link to={"/dashboard/report"} className="brand-link text-center">
//             <span className="brand-text font-weight-light">
//               <img
//                 src="/images/Logo.png"
//                 alt=""
//                 className="logoMain"
//                 style={{ width: "100%" }}
//               />
//             </span>
//           </Link>
//           <a href="#" className="x-navigation-control" onClick={toggleNavigation}>
//             <i className='fa fa-list'></i>
//           </a>
//         </li>

//         <li className='mt-3'>
//           <Link to={"/dashboard/report"} >
//             <span className="fas fa-file p-1"></span>{" "}
//             <span className="xn-text">Dashboard</span>
//           </Link>
//           <Link to={"/report"}>
//             <span className="fas fa-file p-1"></span>{" "}
//             <span className="xn-text">Summary Reports</span>
//           </Link>
//         </li>
//       </ul>
//   )
// }

// export default Navigation

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./nav.css";
const Navigation = () => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  const toggleNavigation = () => {
    setIsNavigationOpen((prevState) => !prevState);
  };

  const location = useLocation();
  const activeItem = location.pathname;
  return (
    <ul
      className={`x-navigation ${isNavigationOpen ? "x-navigation-open" : ""}`}
    >
      <li className="xn-logo">
        <Link to={"/dashboard/report"} className="brand-link text-center">
          <span className="brand-text font-weight-light">
            <img
              src="/images/eisai.png"
              alt=""
              className="logoMain"
              style={{ width: "65%" }}
            />
          </span>
        </Link>
        <a href="#" className="x-navigation-control" onClick={toggleNavigation}>
          <i className="fa fa-list"></i>
        </a>
      </li>

      <li className="">
        <Link
          to={"/dashboard/report"}
          className={activeItem === "/dashboard/report" ? "active-link" : ""}
        >
          <span className="fas fa-file p-1"></span>
          <span className="xn-text">Dashboard</span>
        </Link>
      </li>
      <li>
        <Link
          to={"/report"}
          className={activeItem === "/report" ? "active-link" : ""}
        >
          <span className="fas fa-file p-1"></span>
          <span className="xn-text">Summary Reports</span>
        </Link>
      </li>
    </ul>
  );
};

export default Navigation;
