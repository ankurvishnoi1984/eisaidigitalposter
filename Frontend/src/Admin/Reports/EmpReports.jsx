
import { Link, useNavigate } from "react-router-dom";
import "./EmpReports.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASEURL } from "../../constant/constant";
import FileSaver from "file-saver";
import JSZip from "jszip";
import * as XLSX from "xlsx/xlsx.mjs";
import Navigation from "../Layout/Navigation";
const EmpReports = () => {
  const [emp, setEmp] = useState([]);
  const [emplength, setEmpLength] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totaldoctor, setTotalDoctor] = useState([])

 
  const [employeeData, setEmployeeData] = useState([])
  const [posterlen, setPosterLen] = useState(0);
  const navigate = useNavigate()

  
  const handelNext = () => {
    if ((currentPage * entriesPerPage) < emplength) {
      setCurrentPage(prev => prev + 1);
    }
  };
  const handelPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  useEffect(() => {
    getAllEmp(currentPage);
  }, [currentPage]);

  useEffect(() => {
    getAllEmp1();
    getPosterData();
  }, []);
  async function getAllEmp(page) {
    try {
      // let res = await axios.get(`${BASEURL}/getEmpDoc?page=${page}&limit=20`);
      // setEmp(res.data);
      let res = await axios.get(`${BASEURL}/getAllEmpWithPagination?page=${page}&limit=20`);
      

      console.log(res.data)
    
      setEmp(res.data);
      //setPagLength(res.data.totalResults)
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllEmp1() {
    try {
      let res = await axios.get(`${BASEURL}/getEmpCount`);
      console.log("inside emp count",res)
      setEmpLength(res?.data[0]?.empCount);
    } catch (error) {
      console.log(error);
    }
  }

  async function getPosterData() {
    try {
      let res = await axios.get(`${BASEURL}/getPoster`);
      setEmployeeData(res.data.transformedResult);
      setPosterLen(res.data.poslength)
    } catch (error) {
      console.log(error);
    }
  }
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




  const entriesPerPage = 20;
  const startingEntry = (currentPage - 1) * entriesPerPage + 1;
  //const endingEntry = 20;
  console.log("emplength",emplength)
  const endingEntry = Math.min(startingEntry + entriesPerPage - 1, emplength);
  




 

  const handelLogOut = ()=>{
    
   
    sessionStorage.removeItem("IsAdminLoggedIn");
    navigate("/adminLogin");
  
 }
 
 const handelDocReport = (EmpCode)=>{
    
    const selectedEmp = emp.filter((e)=>e.EmpCode === EmpCode);
    
     if(selectedEmp){
      const headers = [
        "Employee Code",
        "Employee Name",
        "Designation",
        "Hq",
        // "Region",
        // "State",
        // "Zone",
        "Poster Created Count",
        
      ];
  
      // Map the data to match the custom column headers
      const mappedData = selectedEmp.map((item) => ({
        "Employee Code":item.EmpCode,
        "Employee Name":item.EmployeeName,
        "Designation":item.Designation,
        "Hq":item.HQ,
        // "Region":item.Region,
        // "State": item.State,
        // "Zone": item.Zone,
        "Poster Created Count": item.doctorCount,
      }));
  
      const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      XLSX.writeFile(wb, "ESAI_EmpDataWithDoctorCount.xlsx");
    
     }
 }
  

  return (
    <div className="page-container">
      <div className="page-sidebar">
        {/* X-NAVIGATION */}
        <Navigation/>
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
          <h2> All users</h2>
        </div>

        {/* PAGE CONTENT WRAPPER */}
        <div className="page-content-wrap">
          <div className="row">
            <div className="col-md-12">
             
              <div className="">
               
                {/* <button
                  className="btn btn-success btn-block mb-5 createuser float-right"
                  //onClick={handelDownloadZip}
                >
                  Download Zip
                </button> */}
              </div>
              <div className="col-md-5"></div>
              <div className="col-md-3 "></div>

              {/* START DEFAULT DATATABLE */}
                <div className="row treg">
                  <div className="col-md-4 col20">
                    <div className="bgc bgc_4">
                      <span>Total Employees</span>
                      <h2 className="h2cus">
                        {" "}
                        {emplength && (
                          <span id="totalreg">{emplength}</span>
                        )}{" "}
                      </h2>
                    </div>
                  </div>
                  <div className="col-md-4 col20">
                    <div className="bgc bgc_2">
                      <span>Total Doctor</span>
                      <h2 className="h2cus">
                        {" "}
                        {totaldoctor && <span id="totalreg">{totaldoctor.length}</span>}{' '}

                      </h2>
                    </div>
                  </div>

                  <div className="col-md-4 col20">
                    <div className="bgc bgc_5">
                      <span>
                        Total Poster Created <span id="seldatespan"></span>{" "}
                      </span>
                      <h2 className="h2cus">
                        {" "}
                        {posterlen && <span id="totalreg">{totaldoctor.length}</span>}{' '}
                        
                        
                      </h2>
                    </div>
                  </div>
                </div>
              <div className="panel panel-default">
                <div className="panel-body " style={{overflowX:"auto"}}>
                  <table className="table datatable">
                    <thead>
                      <tr>
                        <th>Employee Name</th>
                        <th>Designation</th>
                        {/* <th>Region</th>
                        <th>State</th>
                        <th>Zone</th> */}
                        <th>HQ</th>
                        {/* <th>EmployeeCode</th> */}
                        <th>Poster Created</th>
                        <th>Report</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emp &&
                        emp.map((employee) => {
                          return (
                            <tr key={employee.EmpCode}>
                              <td>{employee.EmployeeName}</td>

                              <td>{employee.Designation}</td>
                             
                              {/* <td>{employee.Region}</td>
                              <td>{employee.State}</td>
                              <td>{employee.Zone}</td> */}
                              <td>{employee.HQ}</td>
                              <td>{employee.doctorCount}</td>
                              <td>
                                <div onClick={()=>handelDocReport(employee.EmpCode)} className="fa fa-download pointer-cursor"></div></td>
                              <td>
                                {" "}
                                <Link to={`/viewdoc/${employee.EmpCode}`}>
                                  {" "}
                                  <button
                                    type="button"
                                    className="btn btn-info active"
                                  >
                                    <span className="fa fa-file"></span>
                                  </button>
                                </Link>
                              </td>
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
                      Showing {startingEntry} to {endingEntry} of {emplength}{" "}
                      entries
                    </div>
                    <div className="resdiv">
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

export default EmpReports;
