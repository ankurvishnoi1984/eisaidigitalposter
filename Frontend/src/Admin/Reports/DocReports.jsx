
import { Link, useNavigate } from "react-router-dom";
import "./DocReports.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASEURL } from "../../constant/constant";

const DocReports = () => {

 
  const [currentPage, setCurrentPage] = useState(1);
  const [totaldoctor, setTotalDoctor] = useState([])
  const [allDoc,setAllDoc] = useState([])
  
  const navigate = useNavigate();
 


  const handelNext = () => {
    if ((currentPage * entriesPerPage) < totaldoctor.length) {
      setCurrentPage(prev => prev + 1);
    }
  };
  const handelPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };


  useEffect(() => {
    getAllDoc(currentPage);
  }, [currentPage]);
  
  useEffect(()=>{
    getTotalDoc()
  },[])
  
  async function getTotalDoc(){
    try {
       let res = await axios.get(`${BASEURL}/doc-data`);
       setTotalDoctor(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  async function getAllDoc(page) {
    try {
      let res = await axios.get(`${BASEURL}/getDoc?page=${page}&limit=20`);
      setAllDoc(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const entriesPerPage = 10;
  const startingEntry = (currentPage - 1) * entriesPerPage + 1;
  //const endingEntry = 20;
  const endingEntry = Math.min(startingEntry + entriesPerPage - 1, totaldoctor.length)
  
   const hadelDocReportDownload = async()=>{
    try {
      const response = await fetch(`${BASEURL}/exportdoc-csv`); // Replace with your API URL
  
      if (response.ok) {
        // Get the filename from the "Content-Disposition" header
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1]
          : 'exported_Doctor_data.csv';
  
        // Trigger the browser to download the CSV file
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        console.error('API call failed:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
   }

   const handelLogOut = ()=>{
    
   
      sessionStorage.removeItem("IsAdminLoggedIn");
      navigate("/adminLogin");
    
   }
   
  return (
    <div className="page-container">
      <div className="page-sidebar">
        {/* X-NAVIGATION */}
        <ul className="x-navigation">
          <li className="xn-logo">
            <Link to={"/dashboard/report"} className="brand-link text-center">
              <span className="brand-text font-weight-light">
                <img
                  src="/images/Logo.png"
                  alt=""
                  className="logoMain"
                  style={{}}
                />
              </span>
            </Link>
          </li>

          <li>
            <Link to={"/EmpReport"}>
              <span className="fas fa-file p-1"></span>{" "}
              <span className="xn-text">Reports</span>
            </Link>
          </li>
        </ul>
        {/* END X-NAVIGATION */}
      </div>

      {/* PAGE CONTENT */}
      <div className="page-content">
        {/* START X-NAVIGATION VERTICAL */}
        <ul className="x-navigation x-navigation-horizontal x-navigation-panel">
          <li className="xn-icon-button pull-right dropdown">
            <a href="#" data-toggle="dropdown">
             <span className="fa fa-user"></span>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <a className="dropdown-item">
                <div className="media">
                  <img
                    src="/images/avatar5.png"
                    alt="User Avatar"
                    className="img-size-50 mr-3 img-circle"
                  />
                  <div className="media-body">
                    <h3 className="dropdown-item-title">Welcome Admin</h3>
                    <p className="text-sm"></p>
                    {/* <p className="text-sm text-muted">
                        <i className="far fa-clock mr-1"></i> 4 Hours Ago
                      </p> */}
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <div onClick={handelLogOut} className="dropdown-item">
                  <i className="fas fa-sign-out-alt mr-3"></i>Logout
                </div>
              </a>
            </div>
          </li>
        </ul>

        <div className="page-title">
          <h2> All Doctors</h2>
        </div>

        {/* PAGE CONTENT WRAPPER */}
        <div className="page-content-wrap">
          <div className="row">
            <div className="col-md-12">
            
              <div className="">
                <button
                  className="btn btn-success btn-block mb-5 createuser float-right"
                  onClick={hadelDocReportDownload}
                >
                  Download Report
                </button>
              </div>
              <div className="col-md-5"></div>
              <div className="col-md-3 "></div>

              {/* START DEFAULT DATATABLE */}
              <div className="panel panel-default">
                <div className="row treg">
                  
                  <div className="col-md-4 col20">
                    <div className="bgc bgc_2">
                      <span>Total Doctor</span>
                      <h2 className="h2cus">
                        {" "}
                        {totaldoctor && <span id="totalreg">{totaldoctor.length}</span>}{' '}

                      </h2>
                    </div>
                  </div>

                
                </div>
                <div className="panel-body">
                  <table className="table datatable">
                    <thead>
                      <tr>
                        <th>Doctor Name</th>
                        <th>Qualification</th>
                        <th>Speciality</th>
                        <th>Date of Birth</th>
                        <th>MCL Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allDoc &&
                        allDoc.map((doc) => {
                          return (
                            <tr key={doc.id}>
                              <td>{doc.name}</td>
                              <td>{doc.qualification}</td>
                              <td>{doc.speciliaty}</td>
                              <td>{doc.dateofbirth}</td>
                              <td>{doc.mclcode}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0px 10px",
                    }}
                  >
                    <div>
                      {" "}
                      Showing {startingEntry} to {endingEntry} of {totaldoctor.length}{" "}
                      entries
                    </div>
                    <div>
                      <button className="pag-but" onClick={handelPrevious}>
                        Previous
                      </button>
                      <button className="pag-but pag-but-bg">
                        {currentPage}
                      </button>
                      <button className="pag-but" onClick={handelNext}>
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* END DEFAULT DATATABLE */}
            </div>
          </div>
        </div>
        {/* PAGE CONTENT WRAPPER */}
      </div>
      {/* END PAGE CONTENT */}
    </div>
  );
};

export default DocReports;
