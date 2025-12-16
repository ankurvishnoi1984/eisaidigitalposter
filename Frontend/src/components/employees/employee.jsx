import { useEffect, useState } from "react";
// import "../../../style/css/sb-admin-2.min.css";
import axios from "axios";


//import { toast } from "react-toastify";
import "./employee.css";

import ConfirmationPopup from "../popup/Popup";
import EditModel from "./editEmpModel";
import toast from "react-hot-toast";
import Loader from "../utils/Loader";
import BulkUploadModal from "./bulkUploadModal";
import { BASEURL } from "../../constant/constant";
import Navigation from "../../Admin/Layout/Navigation";
function Employee() {
  const [name, SetName] = useState("");
  const [empcode, SetEmpcode] = useState("");
  const [state, SetState] = useState("");
  const [hq, SetHq] = useState("");
  const [city, SetCity] = useState("");
  const [pincode, SetPincode] = useState("");
  const [reporting, SetReporting] = useState("");
  const [email, setEmail] = useState('');
  const [password, SetPassword] = useState("");
  const [role, SetRole] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmationDel, setShowConfirmationDel] = useState(false);
  const [delId, setDelId] = useState(null);

  const [addUserModel, setAddUserModel] = useState(false);
  const [uploadUsersModal, setUploadModal] = useState(false);
  const [editUserModel, setEditUserModel] = useState(false);

  const [empData, setEmpData] = useState([]);
  const [singalEmpData, setSingalEmpData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading,setLoading] = useState(false);
const [designation, setDesignation] = useState("");
  const handelAddUser = () => {
    setAddUserModel(true);
  };
  const handleUploadUsers = () => {
    setUploadModal(true);
  };

  const handelEdit = async (id) => {
    console.log(id);
    await GetEmpWithId(id);
    setEditUserModel(true);
    console.log("insdie handeledit", singalEmpData);
  };
  const handelDelete = async (id) => {
    setDelId(id);
    setShowConfirmationDel(true);
    // try {

    //   //const res = await axios.delete(`${BASEURL}/deleteEmp/${id}`)

    //   if(res.data.errorCode=="1"){
    //     toast.success("Employee Deleted successfully");
    //     await GetEmpData();
    //   }
    //   else{
    //     toast.error(`Failed to delete employee with ID ${id}`);
    //   }

    // } catch (error) {
    //   toast.error(error.message)
    // }
  };
  const handleConfirmDel = async () => {
    setShowConfirmationDel(false);
    try {
      const res = await axios.delete(`${BASEURL}/deleteEmp/${delId}`);

      if (res.data.errorCode == "1") {
        toast.success("Employee Deleted successfully");
        await GetEmpData();
      } else {
        toast.error(`Failed to delete employee with ID ${delId}`);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancelDel = () => {
    setShowConfirmationDel(false);
  };

  const handelCloseModel = () => {
    setAddUserModel(false);
    setEditUserModel(false);
    setUploadModal(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !empcode ||
      !email ||
      // !state ||
      // !hq ||
      // !city ||
      // !pincode ||
      // !reporting ||
      !password ||
      !role
    ) {
      toast.error("Missing required fields");
      return;
    }
    const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

    if(!isValidEmail){
      toast.error("Invalid Email");
      return;
    }
    setShowConfirmation(true);
  };
  const handleConfirm = async () => {
    setShowConfirmation(false);
    setAddUserModel(false);
    try {
      const res = await axios.post(`${BASEURL}/addEmp`, {
  name,                 // EmployeeName
  empcode,              // EmpCode
  hq,                   // HQ
  email,                // Email
  password,
  role                  // Role
});
      toast.success("Employee created successfully");
      await GetEmpData();
    } catch (error) {
      console.log(error);
    }

    SetName("");
    SetEmpcode("");
    SetState("");
    SetHq("");
    SetCity("");
    SetPincode("");
    SetReporting("");
    SetPassword("");
    SetRole("");
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

useEffect(() => {
  if (searchQuery.length >= 3 || searchQuery.length === 0) {
    GetEmpData();
  }
}, [currentPage, searchQuery]);

  async function GetEmpWithId(id) {
    try {
     
      const res = await axios.get(`${BASEURL}/getEmpWithId/${id}`);
 setSingalEmpData(res?.data?.user);
    } catch (error) {
      console.log(error);
    }
   
  }

  async function GetEmpData() {
    try {
      // setLoading(true);
      const res = await axios.get(
        `${BASEURL}/getAllEmployee?page=${currentPage}&limit=20&searchName=${searchQuery}`
      );
      console.log("inside empdata", res?.data?.users);
      setTotalCount(res?.data?.totalCount);
      setEmpData(res?.data?.users);
      console.log("setEmpData",res?.data?.users);
      
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false);
    }
  }

  const handelNext = () => {
    if (currentPage * entriesPerPage < totalCount) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const handelPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

const handleSearchChange = (event) => {
  const value = event.target.value;
  setSearchQuery(value);

  if (value.length >= 3 || value.length === 0) {
    setCurrentPage(1);
  }
};
  // pagination logic
  const entriesPerPage = 20;
  const startingEntry = (currentPage - 1) * entriesPerPage + 1;
  const endingEntry = Math.min(startingEntry + entriesPerPage - 1, totalCount);

  return  (
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

                <div className="dropdown-item">
                  <i className="fas fa-sign-out-alt mr-3"></i>Logout
                </div>
              </a>
            </div>
          </li>
        </ul>
        

        <div className="page-title">
          <h2> Employee Manage</h2>
        </div>

        {/* PAGE CONTENT WRAPPER */}
        <div className="page-content-wrap">
         <div className="container-fluid">
     {loading && <Loader />} 
      {/* Page Heading */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <div   className="d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search" onSubmit={(e) => e.preventDefault()} >
          <div className="input-group">
            <input
              type="text"
              className="form-control bg-light border-1 small"
              value={searchQuery} 
              onChange={handleSearchChange}
              placeholder="Search for..."
              aria-label="Search"
              aria-describedby="basic-addon2"
            />
            <div className="input-group-append">
              <button className="btn btn-primary" type="button">
                <i className="fas fa-search fa-sm"></i>
              </button>
            </div>
          </div>
        </div>

        <button
          className="btn btn-info btn-icon-split mt-3 mr-3"
          style={{
            border: "none",
            backgroundColor: "#2f3f6f",
            color: "white",
          }}
          onClick={handleUploadUsers}
        >
          <span className="icon text-white-50">
            <i className="fas fa-plus mr-2"></i>
          </span>
          <span className="text">Upload bulk Users</span>
        </button>

        <button
          className="btn btn-info btn-icon-split mt-3"
          style={{
            border: "none",
            backgroundColor: "#2f3f6f",
            color: "white",
          }}
          onClick={handelAddUser}
        >
          <span className="icon text-white-50">
            <i className="fas fa-plus mr-2"></i>
          </span>
          <span className="text">Add User</span>
        </button>
      </div>
      {/* Content Row */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table table-bordered"
              id="dataTable"
              width="100%"
              cellSpacing="0"
            >
              <thead>
                <tr>
                  <th>Employee Code</th>
                  <th>Employee Name</th>
                  <th>Hq</th>
                  <th>email</th>
                  
                  {/* <th>City</th>
                  
                  <th>Reporting</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
             {empData && empData.length > 0 ? (
    empData.map((e) => (
     <tr key={e.empid}>
  <td>{e.EmpCode}</td>
  <td>{e.EmployeeName}</td>
  <td>{e.HQ || "Not Provided"}</td>
  <td>{e.Email}</td>
        <td>
          <button
            className="btn-sm btn-info btn-circle m-1"
            style={{ border: "none" }}
           onClick={() => handelEdit(e.empid)}
          >
            <i className="fas fa-pencil-alt"></i>
          </button>
          <button
            className="btn-sm btn-danger btn-circle m-1"
            style={{ border: "none" }}
           onClick={() => handelDelete(e.empid)}
          >
            <i className="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="text-center text-muted">
        No employees found
      </td>
    </tr>
  )}
              </tbody>
            </table>
            <div className="textdiv">
              <div>
                {" "}
                Showing {startingEntry} to {endingEntry} of {totalCount} entries
              </div>
              <div className="resdiv">
                <button
                  className="btn btn-light pag-but"
                  onClick={handelPrevious}
                >
                  Previous
                </button>
                <button className="btn btn-light pag-but pag-but-bg">
                  {currentPage}
                </button>
                <button className="btn btn-light pag-but" onClick={handelNext}>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {addUserModel && (
        <div className="addusermodel">
          <div className="modal-dialog">
            <div className="modal-content">
              <div
                className="modal-header bg-primary text-white"
                // style={{ backgroundColor: "#36b9cc", color: "#fff" }}
              >
                <h5 className="modal-title">Add Employee</h5>
                <button
                  onClick={handelCloseModel}
                  type="button"
                  className="close-but"
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="inputName4">Name Of Employee</label>
                      <input
                        type="text"
                        onChange={(e) => {
                          SetName(e.target.value);
                        }}
                        className="form-control"
                        id="inputName4"
                        name="name"
                        placeholder="Name"
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="Code">Employee Code</label>
                      <input
                        type="text"
                        onChange={(e) => {
                          SetEmpcode(e.target.value);
                        }}
                        className="form-control"
                        id="Code"
                        name="code"
                        placeholder="Code"
                      />
                    </div>
                  
                    <div className="form-group col-md-6">
                      <label htmlFor="HQ">HQ</label>
                      <input
                        type="text"
                        onChange={(e) => {
                          SetHq(e.target.value);
                        }}
                        className="form-control"
                        id="HQ"
                        name="hq"
                        placeholder="HQ"
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="Email">Email</label>
                      <input
                        type="text"
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        className="form-control"
                        id="Email"
                        name="Email"
                        placeholder="Email"
                      />
                    </div>
                  
                  <div className="form-group col-md-6">
  <label>Designation</label>
  <select
    className="form-control"
    value={designation}
    onChange={(e) => {
      const value = e.target.value;

      setDesignation(value);

      // map designation → role
      if (value === "Zonal Manager - CNS") SetRole("ZM");
      else if (value === "Regional Manager - CNS") SetRole("RM");
      else if (value === "Health Care Manager - CNS") SetRole("HCE");
      else SetRole("");
    }}
  >
    <option value="">Select Designation</option>
    <option value="Zonal Manager - CNS">Zonal Manager - CNS</option>
    <option value="Regional Manager - CNS">Regional Manager - CNS</option>
    <option value="Health Care Manager - CNS">Health Care Manager - CNS</option>
  </select>
</div>
                    <div className="form-group col-md-6">
                      <label htmlFor="password">Password</label>
                      <input
                        type="text"
                        onChange={(e) => {
                          SetPassword(e.target.value);
                        }}
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Password"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <button type="submit"  style={{ border: "none", backgroundColor:"#2f3f6f",color:"white"}} className="btn  mx-auto">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {showConfirmation && (
            <ConfirmationPopup
              message="Are you sure you want to Add Employee?"
              onConfirm={() => handleConfirm()}
              onCancel={handleCancel}
            />
          )}
        </div>
      )}

      {uploadUsersModal &&<BulkUploadModal
      closeModal={handelCloseModel}
      refreshList={GetEmpData}
      />}

      {showConfirmationDel && (
        <ConfirmationPopup
          message="Are you sure you want to Delete Employee?"
          onConfirm={() => handleConfirmDel()}
          onCancel={handleCancelDel}
        />
      )}

      {editUserModel && (
        <EditModel
          empData={singalEmpData}
          getfun={GetEmpData}
          setEditUserModel={setEditUserModel}
        />
      )}
    </div>
        </div>
        {/* PAGE CONTENT WRAPPER */}
      </div>
      {/* END PAGE CONTENT */}
    </div>
 
  );
}

export default Employee;
