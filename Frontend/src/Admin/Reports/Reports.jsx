
import { useNavigate } from "react-router-dom";
import "./Reports.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASEURL } from "../../constant/constant";
import * as XLSX from "xlsx/xlsx.mjs";

import Navigation from "../Layout/Navigation";
import toast from "react-hot-toast";
const Reports = () => {
  const [emp, setEmp] = useState([]);
  //const [empDownload, setEmpDownload] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [zmList, setZmList] = useState([]);

  const [sm, setSm] = useState("");
  const [getzm ,setGetzm] = useState([])
  const [zm, setZm] = useState("");
  const [getrm ,setGetrm] = useState([])
  const [rm, setRm] = useState("");
  const [getbm ,setGetbm] = useState([])
  const [repo,setRepo] = useState("1")
  const [searchQuery, setSearchQuery] = useState('');
  
  //const [paglength, setPagLength] = useState(0)

  const [category, setCategeory] = useState([]);
  const [cat,setCat] = useState('')
  const [subCat, setSubCat] = useState('');
  const [subCategory, setSubCategory] = useState([]);

  const navigate = useNavigate()

  
  // const handelNext = () => {
  //   if ((currentPage * entriesPerPage) < paglength) {
  //     setCurrentPage(prev => prev + 1);
  //   }
  // };
  // const handelPrevious = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage((prev) => prev - 1);
  //   }
  // };
  useEffect(() => {
    getAllEmpWithPagination(currentPage);
    //getAllEmp();
  }, [currentPage,repo,searchQuery,cat,subCat]);


  async function getAllEmpWithPagination() {
    try {
      let res = await axios.post(`${BASEURL}/getAllEmpReport?search=${searchQuery}`,{
          id:repo,
          catId:cat,
          subCatId:subCat
      });
      
     console.log("my responce",res)
      setEmp(res.data);
      //setPagLength(res.data.totalRecords)
    } catch (error) {
      console.log(error);
    }
  }

  // async function getAllEmp() {
  //   try {
  //     let res = await axios.get(`${BASEURL}/getAllEmp/${repo}?search=${searchQuery}`);

  //     console.log(res)
  //     setEmpDownload(res.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  





  //const entriesPerPage = 20;
  //const startingEntry = (currentPage - 1) * entriesPerPage + 1;
  //const endingEntry = 20;
 
  //const endingEntry = Math.min(startingEntry + entriesPerPage - 1, paglength);
  
  
 
  const hadelReportDownload = ()=>{
    const headers = [
      "Employee Code",
      "Employee Name",
      "Designation",
      "Hq",
      // "State",
      // "Zone",
      // "Region",
      "Poster Created"
    ];

    // Map the data to match the custom column headers
    const mappedData = emp.map((item) => ({
      "Employee Code":item.EmpCode,
      "Employee Name":item.EmployeeName,
      "Designation":item.Designation,
      "Hq": item.HQ,
      // "State":item.State,
      // "Zone": item.Zone,
      // "Region":item.Region,
      "Poster Created":item.doctorCount
    }));

    const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "EISAI_EmpDataWithDoctorCount.xlsx");
   }


   
   const handelDocReport = async(empcode)=>{
    try {
      const response = await axios.post(`${BASEURL}/getAllEmpDocExcel`,{empcode:empcode,catId:cat,subCatId:subCat}); // Replace with your API URL
      console.log(response)
      if(response.status === 200){
        const headers = [
          "Employee Name",
          "Designation",
          "Hq",
          "Doctor Name",
          "Qualification",
          "Therapy",
          "City",
          "Mobile No.",
          "Hospital Name",
        ];
    
        // Map the data to match the custom column headers
        const mappedData = response?.data?.map((item) => ({
          "Employee Name":item.EmployeeName,
          "Designation":item.Designation,
          "Hq":item.HQ,
          "Doctor Name":item.name,
          "Qualification":item.qualification,
          "Therapy":item.therapy,
          "City" : item.city,
          "Mobile No.":item.mobile,
          "Hospital Name": item.hospital,
        }));
    
        const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data");
        XLSX.writeFile(wb, "ESAI_AllDoctorDataWithEmpWise.xlsx");
      
      }
     


    } catch (error) {
      console.error('An error occurred:', error);
    }
   }
   
   const handelDocReport1 = async()=>{
    
    try {
      const response = await axios.post(`${BASEURL}/getAllEmpDocExcel1`,{subCatId:subCat}); // Replace with your API URL
      console.log(response)
      if(response.status === 200){
        const headers = [
          "Employee Name",
          "Designation",
          "Hq",
          "Doctor Name",
          "Qualification",
          "Therapy",
          "City",
          "Mobile No.",
          "Hospital Name",
        ];
    
        // Map the data to match the custom column headers
        const mappedData = response?.data?.map((item) => ({
          "Employee Name":item.EmployeeName,
          "Designation":item.Designation,
          "Hq":item.HQ,
          "Doctor Name":item.name,
          "Qualification":item.qualification,
          "Therapy":item.therapy,
          "City" : item.city,
          "Mobile No.":item.mobile,
          "Hospital Name": item.hospital,
        }));
    
        const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data");
        XLSX.writeFile(wb, "ESAI_AllDoctorData.xlsx");
      
      }
     


    } catch (error) {
      console.error('An error occurred:', error);
    }
   }
   
  async function getAllZmList() {
    try {
      let res = await axios.get(`${BASEURL}/getAllZm`);
      
      setZmList(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getAllZmList()
  },[])

  async function getAllZm(sm) {
    try {
      let res = await axios.get(`${BASEURL}/getZonal/${sm}`);
      
      setGetzm(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
     if(sm){
      getAllZm(sm)
     }
  },[sm])

  async function getAllRm(zm) {
    try {
      let res = await axios.get(`${BASEURL}/getRegional/${zm}`);
      setGetrm(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
     if(zm){
      getAllRm(zm)
     }
  },[zm])


  async function getAllBm(rm) {
    try {
      let res = await axios.get(`${BASEURL}/getBusiness/${rm}`);
     
      setGetbm(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
     if(rm){
      getAllBm(rm)
     }
  },[rm])

 



  const handelLogOut = ()=>{
    
   
    sessionStorage.removeItem("IsAdminLoggedIn");
    navigate("/adminLogin");
  
 }
 const handleSearchChange = event => {
  setSearchQuery(event.target.value);
  setCurrentPage(1)
};

const handelCatChange = (e)=>{
    GetSubCategory(e.target.value);
    setCat(e.target.value);
}

async function GetCategory(){
  try {
    const res = await axios.get(`${BASEURL}/getCategory`) ;
    setCategeory(res.data);
  } catch (error) {
     console.log(error)
  }
 }

 async function GetSubCategory(catId){
  if(!catId){
    setSubCategory([]);
    return;
  }
  try {
    const res = await axios.post(`${BASEURL}/getSubCategory`,{catId}) ;
    setSubCategory(res.data);
  } catch (error) {
     console.log(error)
  }
 }

 useEffect(()=>{
     GetCategory()  
 },[])

const [page, setPage] = useState(1);

  const selectPageHandler = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= Math.ceil(emp.length / 20) &&
      page !== selectedPage
    )
      setPage(selectedPage);
  };


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
          <h2>Summary Report</h2>
        </div>

        {/* PAGE CONTENT WRAPPER */}
        <div className="page-content-wrap">
          <div className="row">
            <div className="col-md-12">
              <div className="">
                
                <select
                  name=""
                  id=""
                  className="filterselect"
                  
                  onChange={(e)=> {
                    setSm(e.target.value)
                    if(e.target.value){
                      setRepo(e.target.value);
                    }
                    else{
                      setRepo("1")
                    }
                  }}
                  value={sm}
                >
                  <option value="">All ZM</option>
                  
                  { zmList && zmList.map((zmdata)=>(
                    <option key={zmdata.EmpCode} value={zmdata.EmpCode}>{zmdata.EmployeeName}</option>
                  ))}
                </select>
               
              </div>
              <div className="">
                <select
                  name=""
                  id=""
                  className="filterselect"
                  
                  onChange={(e)=>{
                    setZm(e.target.value)
                    if(e.target.value){
                      setRepo(e.target.value);
                    }
                    else{
                      setRepo(sm)
                    }
                  }}
                  value={zm}
                > 
                 {sm === "" ? ( <option value="">All RM</option>):(<><option value="">All RM</option>
                 
                  { getzm && getzm.map((zmdata)=>(
                    <option key={zmdata.EmpCode} value={zmdata.EmpCode}>{zmdata.EmployeeName}</option>
                  ))}
                 </>
                  
                 )}
                </select>
                
              </div>
              <div className="">
                <select
                  name=""
                  id=""
                  className="filterselect"
                  
                  onChange={(e)=> {
                    setRm(e.target.value)
                    if(e.target.value){
                      setRepo(e.target.value);
                    }
                    else{
                      setRepo(zm)
                    }
                  }}
                  value={rm}
                >
                  {sm==="" ||zm==="" ? (<option value="">All HCE</option>):<>
                  <option value="">All HCE</option>
                  {getrm && getrm.map((rmdata)=>(
                    <option key={rmdata.EmpCode} value={rmdata.EmpCode}>{rmdata.EmployeeName}</option>
                  ))}
                  
                  </>}
                </select>
              </div>
              {/* <div className="">
                <select
                  name=""
                  id=""
                  className="filterselect"
                  
                  // onChange={(e)=> {
                    
                  //   if(e.target.value){
                  //     setRepo(e.target.value);
                  //   }
                  //   else{
                  //     setRepo(rm)
                  //   }
                  // }}
                > 
                  {sm==="" ||zm==="" || rm==="" ? (<option value="">All HCE</option>) : <>
                  <option value="">All HCE</option>
                  {getbm && getbm.map((bmdata)=>(
                    <option key={bmdata.EmpCode} value={bmdata.EmpCode}>{bmdata.EmployeeName}</option>
                  ))}
                  </> }
                </select>
              </div> */}
                <button
                  className="btn btn-success btn-block mb-5 createuser float-right"
                  onClick={()=>hadelReportDownload(repo)}
                >
                  Download Report
                </button>
                <button
                  className="btn btn-success btn-block mb-5   float-right"
                  onClick={handelDocReport1}
                  style={{width:'150px',marginTop:"10px"}}
                >
                  All Doctor Report
                </button>
              <div className="col-md-5"></div>
              <div className="col-md-3 "></div>
              <div className="col-md-3 mt-2 float-right">
                 <input className="search_input"
                 type="text"
                 placeholder="Search by Employee name, HQ"
                value={searchQuery}
                onChange={handleSearchChange}
                 />
              </div>

             
              
              

              
            </div>
          </div>

          <div className="row">
                <div className="col-md-12">
               
               <div className="">
                
                <select
              
                  className="filterselect"
                  
                  onChange={handelCatChange}
                  value={cat}
                >
                  <option value="">All Category</option>
                  
                  { category && category.map((e)=>(
                    <option key={e.catid} value={e.catid}>{e.name}</option>
                  ))}
                </select>
               
              </div>
            <div className="">
                
                <select
                 
                  className="filterselect subcat_w"
                  // style={{width:"15%"}}
                  onChange={(e)=> {
                    setSubCat(e.target.value)
                  }}
                  value={subCat}
                >
                  <option value="">All SubCategory</option>
                  
                  { subCategory && subCategory.map((e)=>(
                    <option key={e.subcat_id} value={e.subcat_id}>{e.name}</option>
                  ))}
                </select>
               
              </div>
            </div>

               
              </div>

          {/* START DEFAULT DATATABLE */}
              <div className="panel panel-default">
                
                <div className="panel-body" style={{overflowX:"auto"}}>
                  <table className="table datatable">
                    <thead>
                      <tr>
                      <th>Employee Name</th>
                        <th>Designation</th>
                        {/* <th>Region</th> */}
                        {/* <th>State</th> */}
                        {/* <th>Zone</th> */}
                        <th>HQ</th>
                        {/* <th>EmployeeCode</th> */}
                        <th>Poster Created</th>
                        <th>Report</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      {emp &&
                        emp.slice(page * 20 - 20, page * 20).map((employee) => {
                          return (
                            <tr key={employee.EmpCode}>
                            <td>{employee.EmployeeName}</td>

                            <td>{employee.Designation}</td>
                           
                            {/* <td>{employee.Region}</td>
                            <td>{employee.State}</td>
                            <td>{employee.Zone}</td> */}
                            <td>{employee.HQ}</td>
                            <td>{employee.doctorCount}</td>
                              <td><div onClick={()=>handelDocReport(employee.EmpCode)} className="fa fa-download pointer-cursor"></div></td>
                              
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
                      {/* Showing {startingEntry} to {endingEntry} of {paglength}{" "}
                      entries */}
                    </div>
                    <div className="resdiv">
                      <button className="pag-but"  onClick={() => selectPageHandler(page - 1)}>
                        Previous
                      </button>
                      
                      {[
                              ...Array(Math.ceil(emp.length / 20)),
                            ].map((_, i) => {
                              return (
                                <button key={i} className={`pag-but pag-but-bg ${
                                  page === i + 1 ? "showpag" : ""
                                }`}
                                onClick={() => selectPageHandler(i + 1)}
                                >
                                {i+1}
                              </button>
                              );
                            })}
                      <button className="pag-but" 
                      onClick={() => selectPageHandler(page + 1)}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* END DEFAULT DATATABLE */}
        </div>
        {/* PAGE CONTENT WRAPPER */}
      </div>
      {/* END PAGE CONTENT */}
    </div>
  );
};

export default Reports;
