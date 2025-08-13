import "./DashboardContent.css";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASEURL } from "../../constant/constant";
import axios from "axios";
//import { toast } from "react-toastify";
import { IdContext } from "../../context/AuthContext";
import CropImg from "../../utils/CropImg";
import ConfirmationPopup from "../../utils/Popup";
import Loader from "../../utils/Loader";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parse, format } from 'date-fns';
import toast from "react-hot-toast";
const DashboardContent = () => {
  

  const catId = sessionStorage.getItem('catId');
  const subCatId = sessionStorage.getItem('subCatId');

  const [doctordata, setDoctordata] = useState([]);
  const [doctordata1, setDoctordata1] = useState([]);
  const [name, setName] = useState("Dr. ");
 // const [birthdate1, setBirthdate] = useState(null);
  const [qualification, setQualification] = useState("");
  const [city,setCity] = useState('');
  const [therapy, setTherapy] = useState('');
  //const [speciality, setSpeciality] = useState("");
 // const [mclcode, setMclcode] = useState("");
 const [mobile, setMobile] = useState('');
 const [hospitalName, setHospitalName] = useState('');
  const [img, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cropmodel, setCropmodel] = useState(false);
  const [img1, setImage1] = useState("");
  const [cropper, setCropper] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [browsePopUp,setBrowsePopUp] = useState(false);
  const [categoryBySubcatId,setCategoryBySubCatId] = useState([])
  const [selectedSubCatId, setSelectedSubCatId] = useState('')
  const empId = sessionStorage.getItem("userId");

  //console.log(" dfdfdgfdgfdg",categoryBySubcatId)
  const [message, setMessage] = useState('');

  const handelNameChange = (e) => {
    const name1 = e.target.value;
    setName(name1);
    // if(name1.length>25){
    //   setMessage('Name not considered');
    // }
     
    //console.log("name",name1);
    // Extract the name after "Doctor"
    // const nameParts = name1.split(' ');
    // console.log("name part", nameParts);
    // if(subCatId == 5){
    //   if (nameParts.length > 1) {
    //     //const afterDoctor = nameParts.slice(1).join('');
    //     //console.log("after doc1", afterDoctor);
    //     if (nameParts[1].length > 15) {
    //       setMessage('Name not considered');
    //     } else {
    //       setMessage('');
    //     }
    //   }
    //   else  {
    //     const afterDoctor = nameParts[0];
    //     console.log("after doc2", afterDoctor);
    //     if (afterDoctor.length > 18) {
    //       setMessage('Name not considered');
    //     } else {
    //       setMessage('');
    //     }
    //   }
    // }
  };

  const getCropData = async () => {
    if (cropper) {
      const file = await fetch(cropper.getCroppedCanvas().toDataURL())
        .then((res) => res.blob())
        .then((blob) => {
          return new File([blob], "docimage.png");
        });
      if (file) {
        setImage(file);
      }
    }
    setCropmodel(false);
  };

  const setCropperFun = (cropvalue) => {
    setCropper(cropvalue);
  };

  useEffect(() => {
    getDoctor();
  }, []);

  async function getDoctor() {
   
    const response = await axios.post(`${BASEURL}/getdoctoremp`,{empId,catId,subCatId});
     
    console.log("getDoctorlist",response)
    setDoctordata(response.data);
    setDoctordata1(response.data);
  }

  const handelSubmit = async (e) => {
    e.preventDefault();

//     if(message){
//       alert(`Doctor name more than 14 char give space
// eg, Dr. Chandrashekarao Puranto, Dr. Harichandranath Raut`)
//          return;
//     }
    if (!img || !name || !therapy ||!hospitalName) {
      toast.error("Missing required fields");
      return;
    }
    if(mobile && mobile.length !== 10){
      toast.error("Please enter valid mobile number")
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    try {
      setShowConfirmation(false);
      setLoading(true);
      const formdata = new FormData();
      //const birthdate2 = birthdate1.toLocaleDateString('en-GB')
      //const birthdate = birthdate2.replace(/\//g, '-');
      //console.log(birthdate)
      formdata.append("empId", empId);
      formdata.append("catId", catId)
      formdata.append("subCatId", subCatId)
      formdata.append("image", img);
      formdata.append("name", name);
      formdata.append('therapy',therapy);
     // formdata.append("birthdate", birthdate);
     // formdata.append("speciality", speciality);
      formdata.append("qualification", qualification);
      formdata.append("city", city);
      formdata.append("hospitalName", hospitalName);
      formdata.append("mobile", mobile);

       const doctorPromise = await axios.post(`${BASEURL}/add-doctor`, formdata);

       //let doctor_id = doctorPromise.data.doctorId;

       await getDoctor();
       setLoading(false);
       toast.success("Doctor created successfully");
      setLoading(false);
      //navigate(`/dashboard/poster/${doctor_id}`)
    } catch (error) {
      console.log(error);
      toast.error("Error in Creating Doctor")
    }
    setName("Dr. ");
    //setBirthdate("");
   // setSpeciality("");
    setImage("");
   // setMclcode("");
    setQualification("");
    setTherapy('');
    setCity('');
    setMobile('');
    setHospitalName('')
    
  };
  const handleCancel = () => {
    setShowConfirmation(false);
  };


  // for file upload 

  

  const handelBrowse = ()=>{
    setBrowsePopUp(true)
  }
  const handelCloseBrowse = ()=>{
    setBrowsePopUp(false);
  }

 async function getCategoryBySubCatId (){
    try {
       const res = await axios.post(`${BASEURL}/getCategoryBySubCatId`,{catId,subCatId});
       if(res.status === 200){
        setCategoryBySubCatId(res.data);
       }
    } catch (error) {
       console.log(error)
    }
  }

  useState(()=>{
    getCategoryBySubCatId();
  },[])

  const handleAddAllDoctor = async(e)=>{
    e.preventDefault();
    if(!selectedSubCatId){
      toast.error("Please Select SubCategory");
      return;
    }
    try {
      
       setLoading(true);
       const res = await axios.post(`${BASEURL}/copy-doctors`,{fromSubCatId :selectedSubCatId, toSubCatId:subCatId, catId:catId});
       if(res.data.errorCode === 1){
          toast.success('Doctor Data copied successfully')
          setBrowsePopUp(false);
          await getDoctor();
       }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data)
    }
    finally{
      setLoading(false);
    }
  }

  const handleSearchChange = (event)=>{
   
    const searchValue = event.target.value;
    const filterData =  doctordata1.filter((doctor)=>{
      return doctor.name.toLowerCase().includes(searchValue.toLowerCase())
    })

    setDoctordata(filterData);
  }
  

  return (
    <div>
      <div
        className="content-header"
        style={{ backgroundColor: "#39a6cf", color: "#fff" }}
      >
        <p className="text-center" style={{ fontSize: "25px" }}>
          {" "}
          <Link to="/subcategory" className=" text-left">
            <button type="button" className="btn btn-primary float-left">
              <i className="fas fa-arrow-left"></i>
            </button>
          </Link>{" "}
        
        </p>
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6"></div>
            <div className="col-sm-12 text-right">
              <p className="text-center" style={{ fontSize: "25px" }}>
                Total Doctor : {doctordata && doctordata.length}
                <button
                  type="button"
                  id="Login1"
                  className="btn btn-primary float-right"
                  data-toggle="modal"
                  data-target="#adddoc"
                >
                  Add Doctor
                </button>
                <button
                  type="button"
                   onClick={handelBrowse}
                  className="btn btn-primary float-right mr-2"
                  
                >
                  Browse
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="filter-search-container m-2 search-box">
          {/* Search Input */}
          <div className="search-input col-md-3">
            <input
              className="form-control search_input"
              type="text"
              placeholder="Search By Name..."
             // value={searchQuery}
             onChange={handleSearchChange}
            />
          </div>
          </div>

      {loading ? (
        <Loader />
      ) : (
        <section className="content mt-5">
          <div className="container-fluid">
            <div className="row">
              {doctordata &&
                doctordata.map((doctor, i) => {
                  return (
                    <DoctorList
                      key={i}
                      uploadFile={""}
                      getDoctor={getDoctor}
                      doctor={doctor}
                    ></DoctorList>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      <div
        className="modal fade show"
        id="adddoc"
        data-backdrop="static"
        data-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        style={{ paddingRight: "17px" }}
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

              <div id="container">
              <div className="contentdiv active">
                    <form id="formlogin" onSubmit={handelSubmit}>
                      <div id="Register" className="AddDocMain text-cente">
                        <h3>Add Doctors Details</h3>
                        <div className="docphoto">
                          <div className=" text-center">
                            <img
                              src={
                                img
                                  ? URL.createObjectURL(img)
                                  : "/images/userimg.png"
                              }
                              alt=""
                              className="avatar1"
                            />
                            <label htmlFor="upload-input">
                              <div className="icon-container">
                                <i className="fas fa-pen"></i>
                              </div>
                            </label>
                            <input
                              id="upload-input"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                console.log("inside input chang", cropmodel)
                
                                setCropmodel(true);
                                setImage1(
                                  URL.createObjectURL(e.target.files[0])
                                );
                              }}
                            />
                            <p>Doctor Photo*</p>
                          </div>
                        </div>
                        <div className="docform">
                          <div className="row mt-2">
                            <div className="col-sm-6">
                              <div className="form-group">
                                <label>Dr. Name*</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  // id="Name"
                                  maxLength={25}
                                  value={name}
                                  // onChange={(e) => {
                                  //   setName(e.target.value);
                                  // }}
                                  onChange={handelNameChange}
                                />
                                {message && <p style={{color: "#ca1111"}}>{message}</p>}
                              </div>
                            </div>
                            {/* <div className="col-sm-6">
                              <div className="form-group">
                                <label>Date of Birth*</label>
                                <DatePicker
                                      selected={birthdate1}
                                      onChange={(date) => setBirthdate(date)}
                                      peekNextMonth
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      minDate={minDate} // Set the minimum date
                                      placeholderText="DD-MM-YYYY"
                                      dateFormat="dd-MM-yyyy"
                                      className="form-control"
                                    />
                              </div>
                            </div> */}
                            <div className="col-sm-6">
                              <div className="form-group">
                                <label>Qualification</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="Qualification"
                                  maxLength={50}
                                  value={qualification}
                                  onChange={(e) => {
                                    setQualification(e.target.value);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row mt-1">
                          <div className="col-sm-6">
                              <div className="form-group">
                                <label>Therapy*</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="therapy"
                                  maxLength="30"
                                  value={therapy}
                                  onChange={(e) => {
                                    setTherapy(e.target.value);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div className="form-group">
                                <label>Hospital/Clinic Name*</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="Hospital"
                                  maxLength="30"
                                  value={hospitalName}
                                  onChange={(e) => {
                                    setHospitalName(e.target.value);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div className="form-group">
                                <label>City</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="city"
                                  value={city}
                              
                                  onChange={(e) => {
                                    setCity(e.target.value);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div className="form-group">
                                <label>Mobile No</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="mclcode"
                                  value={mobile}
                                  maxLength={10}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                      setMobile(value);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="text-center mt-3">
                            <input type="submit" value="Submit" id="Login1" className="docbtn btn btn-success"/>
                            <span className="error regspan"></span>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "#ca1111",
                                textAlign: "left",
                                fontWeight: "700",
                              }}
                            >
                              * Some fields are mandatory to fill.
                              <br />* Image size should be less than 5 MB
                              
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>

                    {cropmodel && (
                      <CropImg
                        img1={img1}
                        setCropperFun={setCropperFun}
                        getCropData={getCropData}
                      />
                    )}
                  </div>
              </div>
            </div>
          </div>
        </div>
        {showConfirmation && (
          <ConfirmationPopup
            message="Are you sure you want to Add Doctor?"
            onConfirm={() => handleConfirm()}
            onCancel={handleCancel}
          />
        )}
      </div>

      {browsePopUp && <div
        className="modal fade show"
        style={{ display:"block"}}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <button
                type="button"
                className="close basicedit"
                onClick={handelCloseBrowse}
              >
                <span aria-hidden="true">×</span>
              </button>

              <div id="container">
              <div className="contentdiv active">
                    <form id="formlogin" onSubmit={handleAddAllDoctor}>
                      <div id="Register" className="AddDocMain text-cente">
                        <h3>Add Doctors List</h3>
                        <div className="docform mt-5">
                          
                            <div className="col-sm-12">
                              <div className="form-group">
                                <label>Select Category</label>
                                <select onChange={(e)=>{
                                    setSelectedSubCatId(e.target.value)
                                }}
                                value={selectedSubCatId}
                                 className="form-control"
                                >
                                  <option value="">Select Category</option>
                                   {categoryBySubcatId && categoryBySubcatId.length>0 &&
                                   categoryBySubcatId.map((e)=>(
                                    <option key={e.subcat_id} value={e.subcat_id}>{e.name} -{e.cat_id ==1 ?" (Medical)":" (Festival)"}</option>
                                   ))}

                                </select>
                              </div>
                            </div>
                          <div className="text-center mt-5">
                            <input type="submit" value="Submit" id="Login1" className="docbtn btn btn-success"/>
                            <span className="error regspan"></span>
                           
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>}
     
    </div>
  );
};

export default DashboardContent;

function DoctorList({ doctor, getDoctor }) {

 // const inputDateString = doctor.dateofbirth;



  // Split the input date string by '-' to get day, month, and year components
  //const [day, month, year] = inputDateString.split('-');
  
  // Rearrange the components to form the "yyyy-mm-dd" format
  //const convertedDateString = `${year}-${month}-${day}`;
  
  //console.log("converted date",convertedDateString);
  // Format the Date object
  //const formattedDate = parsedDate.toString();
  //console.log(for)

  const [img, setImage] = useState(null);
  const [name, setName] = useState(doctor.name);
  //const [birthdate1, setBirthdate] = useState(new Date(convertedDateString));
  const [qualification, setQualification] = useState(doctor.qualification);
  const [city, setCity] = useState(doctor.city)
  const [mobile, setMobile] = useState(doctor.mobile);
  const [hospitalName, setHospitalName] = useState(doctor.hospital);
  const [therapy, setTherapy] = useState(doctor.therapy);
  //const [speciality, setSpeciality] = useState(doctor.speciliaty);
 // const [mclcode, setMclcode] = useState(doctor.mclcode);
  const [cropmodel, setCropmodel] = useState(false);
  const [img1, setImage1] = useState("");
  const [cropper, setCropper] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [delConfirmation, setDelConfirmation] = useState(false);
  const [delId, setDelId] = useState('')
  const [loading1, setLoading1] = useState(false);
  //const minDate = new Date('1960-01-01');
  
  //console.log("in edit section ", birthdate1)
  const getCropData = async () => {
    if (cropper) {
      const file = await fetch(cropper.getCroppedCanvas().toDataURL())
        .then((res) => res.blob())
        .then((blob) => {
          return new File([blob], "docimage.png");
        });
      if (file) {
        setImage(file);
      }
    }
    setCropmodel(false);
  };

  const setCropperFun = (cropvalue) => {
    setCropper(cropvalue);
  };

  const handelEditSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmation(true);

  };

  const handelDelete = async (id) => {
      setDelId(id)
      setDelConfirmation(true)
    
  };


  const handleConfirmDel = async()=>{
    const id = delId
    try {
      await axios.delete(`${BASEURL}/delete/${id}`);
      await getDoctor();
    } catch (error) {
      console.log(error);
    }
    finally{
      setDelConfirmation(false);
    }
  }

  const handleCancelDel = () => {
    // Hide the confirmation popup
    setDelConfirmation(false);
    // Handle cancellation as needed...
  };

  const handleConfirm = async (id) => {
    setShowConfirmation(false);
    setLoading1(true);
    try {
      
      
     

       //let birthdate2 = birthdate1.toLocaleDateString('en-GB')
      // var birthdate = birthdate2.replace(/\//g, '-');
     
      
      const formdata = new FormData();
      formdata.append("image", img);
      formdata.append("name", name);
     // formdata.append("birthdate", birthdate);
      //formdata.append("speciality", speciality);
      formdata.append("qualification", qualification);
      formdata.append("therapy", therapy);
      //formdata.append("mclcode", mclcode);
      formdata.append('city',city);
      formdata.append('mobile',mobile);
      formdata.append('hospitalName',hospitalName);



      const doctorPromise = await axios.patch(
        `${BASEURL}/update/${id}`,
        formdata
      );
      await getDoctor();
      toast.success("Doctor Update successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error in Doctor Updating")
    } finally {
      // Hide the loader when the operation is complete
      setLoading1(false);
    }
  };
  const handleCancel = () => {
    // Hide the confirmation popup
    setShowConfirmation(false);
    // Handle cancellation as needed...
  };

  const modalId = `infodoc-${doctor.id}`;
  const editId = `editdoc-${doctor.id}`;

  return (
    <div className="col-md-2 p-1">
      {loading1 ? (
        <Loader />
      ) : (
        <div className="card doc_card">
          <div style={{ position: "relative" }}>
            <div className="img__wrap text-center">
              <img
                id=""
                src={doctor.imgurl ?`${BASEURL}/uploads/${doctor.imgurl}`:'/images/userimg.png'}
                width="199"
                height="177"
                className="img__img"
              />

              <div id="outer" className="img__description">
                <div className="inner">
                  <Link to={`poster/${doctor.id}`} title="View">
                    <i className="nav-icon fas fa-image"></i>
                  </Link>
                </div>

                <div className="inner">
                  <a
                    title="Info"
                    data-toggle="modal"
                    data-target={`#${modalId}`}
                  >
                    <i className="nav-icon fas fa-info"></i>
                  </a>
                </div>

                <div className="inner">
                  <a
                    href=""
                    title="Edit"
                    data-toggle="modal"
                    data-target={`#${editId}`}
                  >
                    <i className="nav-icon fas fa-edit"></i>
                  </a>
                </div>

                {/* <div className="inner" onClick={() => handelDelete(doctor.id)}>
                  <a title="Delete">
                    <i className="nav-icon fas fa-trash"></i>
                  </a>
                </div> */}
              </div>
            </div>
          </div>
          <div className="card-body ">
            <h5
              className="card-title text-center"
              style={{ fontSize: "1.0rem" }}
            >
              <b>{doctor.name}</b>
            </h5>
          </div>
        </div>
      )}

{delConfirmation && (
              <ConfirmationPopup
                message="Are you sure you want to Delete Doctor?"
                onConfirm={() => handleConfirmDel()}
                onCancel={handleCancelDel}
              />
            )}

<div
        className="modal fade show"
        id={modalId}
        // data-backdrop="static"
        //data-keyboard="false"
        style={{ paddingRight: "17px" }}
        //aria-labelledby={`${modalId}-label`}
        // aria-modal="true"
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
                          value={doctor.name}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Qualification</label>
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
                                <label>Therapy</label>
                                <input
                                  type="text"
                                  id={`city-${doctor.id}`}
                                  className="form-control"
                                  
                                  disabled
                                  value={doctor.therapy}                          
                                />
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div className="form-group">
                                <label>Hospital/Clinic Name</label>
                                <input
                                  type="text"
                                  id={`city-${doctor.id}`}
                                  className="form-control"
                                  
                                  disabled
                                  value={doctor.hospital}                          
                                />
                              </div>
                            </div>
                            
                  </div>

                  <div className="row mt-2">
                    <div className="col-sm-6">
                              <div className="form-group">
                                <label>City</label>
                                <input
                                  type="text"
                                  id={`city-${doctor.id}`}
                                  className="form-control"
                                  
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
                                  id={`city-${doctor.id}`}
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

      <div
        className="modal fade show"
        id={editId}
        style={{ paddingRight: "17px" }}
      >
        <div className="modal-dialog modal-lg">
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
              <form onSubmit={(e) => handelEditSubmit(e)}>
                <div className="AddDocMain text-center">
                  <h3>Edit Doctors Details</h3>
                  <div className="docphoto">
                    <div className=" text-center">
                      <img
                        src={
                          img
                            ? URL.createObjectURL(img)
                            : `${BASEURL}/uploads/${doctor.imgurl}`
                        }
                        alt=""
                        className="avatar1"
                      />

                      {/* <label htmlFor="upload-input1">
                                          <div className="icon-container">
                                            <i className="fas fa-pen"></i>
                                          </div>
                                        </label> */}
                      <input
                        // id="upload-input1"
                        style={{ display: "block" }}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          setCropmodel(true);
                          setImage1(URL.createObjectURL(e.target.files[0]));
                        }}
                      />
                      <p>Doctor Photo</p>
                    </div>
                  </div>
                  <div className="docform">
                    <div className="row mt-2">
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Dr Name*</label>
                          <input
                            type="text"
                            className="form-control"
                            value={name}
                            maxLength={25}
                            onChange={(e) => {
                              setName(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Qualification</label>
                          <input
                            type="text"
                            className="form-control"
                            maxLength="50"
                            value={qualification}
                            onChange={(e) => {
                              setQualification(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mt-2">

                    <div className="col-sm-6">
                        <div className="form-group">
                          <label>Therapy</label>
                          <input
                            type="text"
                            className="form-control"
                            maxLength={30}
                            value={therapy}
                            onChange={(e) => {
                              setTherapy(e.target.value);
                            }}
                          />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                          <label>Hospital/Clinic Name</label>
                          <input
                            type="text"
                            className="form-control"
                            maxLength={30}
                            value={hospitalName}
                            onChange={(e) => {
                              setHospitalName(e.target.value);
                            }}
                          />
                        </div>
                    </div>

                    
                    
                    </div>

                    <div className="row mt-2">
                    <div className="col-sm-6">
                        <div className="form-group">
                          <label>City</label>
                          <input
                            type="text"
                            className="form-control"
                            
                            value={city}
                            onChange={(e) => {
                              setCity(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                          <label>Mobile No.</label>
                          <input
                            type="text"
                            className="form-control"
                            maxLength={10}
                            value={mobile}
                            onChange={(e) => {
                              const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                  setMobile(value);
                                }
                            }}
                          />
                        </div>
                      </div>
                    
                    </div>
                    <div className="text-center mt-3">
                      <input
                        type="submit"
                        value="Submit"
                        // style={{ width: "22%" }}
                        className="docbtn btn btn-success"
                      />
                      <span className="error regspan"></span>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#ca1111",
                          textAlign: "left",
                          fontWeight: "700",
                        }}
                      >
                        * Some fields are mandatory to fill.
                        <br />* Image size should be less than 5 MB
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              {cropmodel && (
                <CropImg
                  img1={img1}
                  setCropperFun={setCropperFun}
                  getCropData={getCropData}
                />
              )}
            </div>
            {showConfirmation && (
              <ConfirmationPopup
                message="Are you sure you want to Edit Doctor?"
                onConfirm={() => handleConfirm(doctor.id)}
                onCancel={handleCancel}
              />
            )}

            
          </div>
        </div>
      </div>
    </div>
  );
}

