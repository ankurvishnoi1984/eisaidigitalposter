// import "../../plugins/daterangepicker/daterangepicker.css";
// import "../../plugins/icheck-bootstrap/icheck-bootstrap.min.css";
// import "../../plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css";
// import "../../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css";
// import "../../plugins/select2/css/select2.min.css";
// import "../../plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css";
// import "../../plugins/bootstrap4-duallistbox/bootstrap-duallistbox.min.css";
// import "../../plugins/fontawesome-free/css/all.min.css";

// import "../../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css";
// import "../../plugins/datatables-responsive/css/responsive.bootstrap4.min.css";
// import "../../plugins/select2/css/select2.min.css";
// import "../../plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css";
// import "../../diste/css/adminlte.min.css";
// import "../../diste/css/style.css";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import axios from "axios";
// import { BASEURL } from "../constant/constant";
// import { useState } from "react";

// const DashboardStyle = () => {
//   const storedUserId = sessionStorage.getItem("userId");
//   const [emp, setEmp] = useState({});

//   if (emp && emp.EmployeeName) {
//     var name = emp.EmployeeName.split(" ")[0];
//   }

//   const navigate = useNavigate();
//   const handelLogout = () => {
//     sessionStorage.removeItem("isLoggedIn");
//     sessionStorage.removeItem("userId");
//     sessionStorage.removeItem('catId');
//     sessionStorage.removeItem('subCatId');
//     navigate("/");
//   };
//   useEffect(() => {
//     axios
//       .get(`${BASEURL}/getemp/${storedUserId}`)
//       .then((res) => setEmp(res.data[0]))
//       .catch((err) => console.log(err));
//   }, []);
//   return (
//     <div className="hold-transition sidebar-mini">
//       <div className="wrapper">
//         <nav className="main-header navbar navbar-expand navbar-dark navbar-navy">
//           <ul className="navbar-nav navbar-dnone">
//             <li className="nav-item">
//               <div className="nav-link" data-widget="pushmenu" role="button">
//                 <i className="fas fa-bars"></i>
//               </div>
//             </li>
//           </ul>

//           <ul className="navbar-nav ml-auto">
//             <li className="nav-item dropdown">
//               <div className="nav-link" data-toggle="dropdown" title="Logout">
//                 Logout <i className="far fa-user-circle fa-lg"></i>
//               </div>
//               <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
//                 <div className="dropdown-item">
//                   <div className="media">
//                     <img
//                       src="/images/avatar5.png"
//                       alt="User Avatar"
//                       className="img-size-50 mr-3 img-circle"
//                     />
//                     <div className="media-body">
//                       <h3 className="dropdown-item-title">
//                         Welcome {name || "Admin"}
//                       </h3>
//                       <p className="text-sm"></p>
//                       {/* <p className="text-sm text-muted">
//                         <i className="far fa-clock mr-1"></i> 4 Hours Ago
//                       </p> */}
//                     </div>
//                   </div>

//                   <div className="dropdown-divider"></div>

//                   <div className="dropdown-item" onClick={handelLogout}>
//                     <i className="fas fa-sign-out-alt mr-2"></i>Logout
//                   </div>
//                 </div>
//               </div>
//             </li>
//           </ul>
//         </nav>

//         <aside className="main-sidebar sidebar-dark-primary elevation-4">
//           <Link to={"/dashboard"} className="brand-link text-center">
//             <span className="brand-text font-weight-light">
//               <img
//                 src="/images/eisai.png"
//                 alt=""
//                 className="logoMainU"
//                 style={{}}
//               />
//             </span>
//           </Link>

//           <div className="sidebar">
//             <nav className="mt-2">
//               <ul
//                 className="nav nav-pills nav-sidebar flex-column"
//                 data-widget="treeview"
//                 role="menu"
//                 data-accordion="false"
//               >
//                 <li className="nav-item sidebar-closed sidebar-collapse">
//                   <Link to="/category" className="nav-link active">
//                     <i className="nav-icon fas fa-user"></i>
//                     <p>Select Category</p>
//                   </Link>
//                 </li>
//                 <li className="nav-item sidebar-closed sidebar-collapse">
//                   <Link to="/reset-password" className="nav-link active">
//                     <i className="nav-icon fas fa-lock"></i>
//                     <p>Change Password</p>
//                   </Link>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </aside>

//         {/* <!-- Content Wrapper. Contains page content --> */}
//         <div className="content-wrapper">
//           {" "}
//           <Outlet />
//         </div>
//         {/* <!-- /.content-wrapper --> */}
//       </div>
//     </div>
//   );
// };

// export default DashboardStyle;


import "../../plugins/daterangepicker/daterangepicker.css";
import "../../plugins/icheck-bootstrap/icheck-bootstrap.min.css";
import "../../plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css";
import "../../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css";
import "../../plugins/select2/css/select2.min.css";
import "../../plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css";
import "../../plugins/bootstrap4-duallistbox/bootstrap-duallistbox.min.css";
import "../../plugins/fontawesome-free/css/all.min.css";
import "../../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css";
import "../../plugins/datatables-responsive/css/responsive.bootstrap4.min.css";
import "../../plugins/select2/css/select2.min.css";
import "../../plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css";
import "../../diste/css/adminlte.min.css";
import "../../diste/css/style.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASEURL } from "../constant/constant";

const DashboardStyle = () => {
  const storedUserId = sessionStorage.getItem("userId");
  const [emp, setEmp] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  if (emp && emp.EmployeeName) {
    var name = emp.EmployeeName.split(" ")[0];
  }

  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("catId");
    sessionStorage.removeItem("subCatId");
    navigate("/");
  };

  useEffect(() => {
    axios
      .get(`${BASEURL}/getemp/${storedUserId}`)
      .then((res) => setEmp(res.data[0]))
      .catch((err) => console.log(err));
  }, [storedUserId]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false); // Close sidebar on mobile by default
      } else {
        setSidebarOpen(true); // Open sidebar on larger screens
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (path) => {
    if (isMobile) {
      setSidebarOpen(false);
    }
    navigate(path);
  };

  return (
    <div className={`hold-transition sidebar-mini ${sidebarOpen ? "sidebar-open" : "sidebar-collapse"}`}>
      <div className="wrapper">
        <nav className="main-header navbar navbar-expand navbar-dark navbar-navy">
          <ul className="navbar-nav navbar-dnone">
            <li className="nav-item">
              <div className="nav-link" role="button" onClick={toggleSidebar}>
                <i className="fas fa-bars"></i>
              </div>
            </li>
          </ul>

          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown">
              <div className="nav-link" data-toggle="dropdown" title="Logout">
                Logout <i className="far fa-user-circle fa-lg"></i>
              </div>
              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <div className="dropdown-item">
                  <div className="media">
                    <img
                      src="/images/avatar5.png"
                      alt="User Avatar"
                      className="img-size-50 mr-3 img-circle"
                    />
                    <div className="media-body">
                      <h3 className="dropdown-item-title">
                        Welcome {name || "Admin"}
                      </h3>
                      <Link to={'/reset-password'} className="dropdown-item-title mt-2">
                        Change Password
                      </Link>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <div className="dropdown-item cpointer" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt mr-2"></i>Logout
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </nav>

        <aside className="main-sidebar sidebar-dark-primary elevation-4">
          <Link to={"/dashboard"} className="brand-link text-center" onClick={() => handleNavigation("/dashboard")}>
            <span className="brand-text font-weight-light">
              <img src="/images/eisai.png" alt="" className="logoMainU" />
            </span>
          </Link>

          <div className="sidebar">
            <nav className="mt-2">
              <ul
                className="nav nav-pills nav-sidebar flex-column"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                <li className="nav-item">
                  <Link to="/category" className="nav-link active" onClick={() => handleNavigation("/category")}>
                    <i className="nav-icon fas fa-user"></i>
                    <p>Select Category</p>
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link to="/reset-password" className="nav-link active" onClick={() => handleNavigation("/reset-password")}>
                    <i className="nav-icon fas fa-lock"></i>
                    <p>Change Password</p>
                  </Link>
                </li> */}
              </ul>
            </nav>
          </div>
        </aside>

        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardStyle;



