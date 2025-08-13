import { Link, useNavigate, useParams } from "react-router-dom";
import "./ViewDoc.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { BASEURL } from "../../constant/constant";
import { saveAs } from 'file-saver';
import Navigation from "../Layout/Navigation";
const ViewDoc = () => {
 
    const {id} = useParams();
    const [docdata , setDocData] = useState([])
    const navigate = useNavigate();
    useEffect(()=>{
        getAllDoc();
    },[])

    async function getAllDoc(){
        try {
            const res = await axios.post(`${BASEURL}/getDoctorList`,{empId:id});
            setDocData(res.data)
        } catch (error) {
            console.log(error)
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
       
        
          <div className="row mb-2">
            <div className="col-sm-6"></div>
            <Link to="/dashboard/report" className="col-sm-12 text-left">
                  <button type="button"  className="btn btn-primary">
                            <i className="fas fa-arrow-left"></i>
                  </button>
            </Link>
          </div>
        </div>
     
        

        {/* PAGE CONTENT WRAPPER */}
        <div className="page-content-wrap">
          <div id="imageList">
            <div className="row  tablist text-center mx-auto">
              <div className="mb-3 headt">
                <h3 style={{color:"white"}}>
                  Total Doctor : {docdata && docdata.length}
                </h3>
              </div>

              {docdata && docdata.map((doc)=>(
                <DocList key={doc.id} doctor={doc}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDoc;

function DocList({doctor}){

  const modalId = `infodoc-${doctor.id}`;

  const handleDownload = async (imgurl) => {
     saveAs(imgurl,"docimage.jpg")
  };
  return (
    <div className="col-md-2 no-pads " key={doctor.id}>
                <div className="cont imglist">
                  <div className="cont-overlay" style={{cursor:"pointer"}}></div>
                  <div className="cont-details fadeIn-top">
                    <a
                      title="View"
                      className="poweredtext"
                      data-toggle="modal"
                      data-target={`#${modalId}`}
                    >
                      <i
                        style={{fontSize:"15px",margin:"5px"}}
                        className="fa fa-eye"
                      ></i>
                    </a>

                    <a
                    
                      title="Download"
                      
                      className="poweredtext"
                      onClick={()=>handleDownload(`${BASEURL}/uploads/${doctor.imgurl}`)}
                    >
                      <i
                        style={{fontSize:"15px",margin:"5px"}}
                        className="fa fa-download"
                      ></i>
                    </a>
                  </div>
                  <div className="brick bimg">
                    <img
                      id="2162"
                      height="200"
                      //src="../images/no-image.jpg"
                      src={`${BASEURL}/uploads/${doctor.imgurl}`}
                      className="boxlogo"
                    />
                  </div>
                  <div className="namet">
                    {doctor.name}
                  </div>
                </div>

                <div
          className="modal fade show"
          id={modalId}
          data-backdrop="static"
          data-keyboard="false"
          style={{ paddingRight: "17px" }}
          aria-labelledby={`${modalId}-label`}
          aria-modal="true"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <button
                  type="button"
                  className="close basicedit"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>

                <div id="Register1" className="AddDocMain text-center">
                  <h3> Doctors Details</h3>
                  <div className="docphoto">
                    <img
                      // src="dist/img/avatar04.png"
                      src={`${BASEURL}/uploads/${doctor.imgurl}`}
                      alt="doctor-photo"
                      //className="img-circle img-fluid"
                      className="avatar1"
                    />

                    <p>Doctor Photo</p>
                  </div>
                  <div className="docform">
                  <div className="row mt-2">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Dr Name*</label>
                        <input
                          type="text"
                          className="form-control"
                          id="Name1"
                          maxLength="50"
                          //tabIndex="1"
                          placeholder=" "
                          value={`Dr. ${doctor.name}`}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Qualification*</label>
                        <input
                          type="text"
                          className="form-control"
                          id={`Qualification-${doctor.id}`}
                          maxLength="18"
                          disabled
                          value={doctor.qualification}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-2">
                    

                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Hospital Name</label>
                        <input
                          type="text"
                          id={`Hospital-${doctor.id}`}
                          className="form-control"
                          maxLength="200"
                          placeholder=" "
                          disabled
                          value={doctor.hospital}                          
                        />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          id={`city-${doctor.id}`}
                          className="form-control"
                          maxLength="200"
                          placeholder=" "
                          disabled
                          value={doctor.city}                          
                        />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Mobile No.</label>
                        <input
                          type="text"
                          id={`mobile-${doctor.id}`}
                          className="form-control"
                          
                          disabled
                          value={doctor.mobile}                          
                        />
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}