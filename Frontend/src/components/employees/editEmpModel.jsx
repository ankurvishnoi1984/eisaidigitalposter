import ConfirmationPopup from "../popup/Popup";
import "./employee.css";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASEURL } from "../../constant/constant";

function EditModel({ setEditUserModel, empData, getfun }) {

  // NEW FIELD MAPPING
  const [namee, setNamee] = useState("");
  const [empcodee, setEmpcodee] = useState("");
  const [hqe, setHqe] = useState("");
  const [emaile, setEmaile] = useState("");
  const [passworde, setPassworde] = useState("");

  const [designation, setDesignation] = useState("");
  const [rolee, setRolee] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);
const roleToDesignationMap = {
  ZM: "Zonal Manager - CNS",
  RM: "Regional Manager - CNS",
  HCE: "Health Care Manager - CNS"
};
  // PREFILL DATA
  useEffect(() => {
    if (empData) {
      setNamee(empData.EmployeeName || "");
      setEmpcodee(empData.EmpCode || "");
      setHqe(empData.HQ || "");
      setEmaile(empData.Email || "");
      setPassworde(empData.Password || "");
        const role = empData.Role || "";
    setRolee(role);
    setDesignation(roleToDesignationMap[role] || "");
    }
  }, [empData]);

  const handelCloseModel = () => {
     setNamee("");
      setEmpcodee( "");
      setHqe("");
      setEmaile("");
      setPassworde("");
    setRolee("");
    setDesignation("");
    setEditUserModel(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!namee || !empcodee || !emaile || !designation || !passworde) {
      toast.error("Missing required fields");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emaile);
    if (!isValidEmail) {
      toast.error("Invalid Email");
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    setEditUserModel(false);

    try {
      const res = await axios.patch(
        `${BASEURL}/updateEmpWithId/${empData.empid}`,
        {
          name: namee,
          empcode: empcodee,
          hq: hqe,
          email: emaile,
          password: passworde,
          designation,
          role: rolee
        }
      );

      if (res?.data?.errorCode === "1") {
        toast.success("Employee Updated Successfully");
        await getfun();
      } else {
        toast.error("Error while updating employee");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="addusermodel">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Edit Employee</h5>
            <button onClick={handelCloseModel} type="button" className="close-but">
              <span>&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-row">

                <div className="form-group col-md-6">
                  <label>Name Of Employee</label>
                  <input
                    type="text"
                    value={namee}
                    onChange={(e) => setNamee(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group col-md-6">
                  <label>Employee Code</label>
                  <input
                    type="text"
                    value={empcodee}
                    onChange={(e) => setEmpcodee(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group col-md-6">
                  <label>HQ</label>
                  <input
                    type="text"
                    value={hqe}
                    onChange={(e) => setHqe(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group col-md-6">
                  <label>Email</label>
                  <input
                    type="text"
                    value={emaile}
                    onChange={(e) => setEmaile(e.target.value)}
                    className="form-control"
                  />
                </div>

                {/* DESIGNATION DROPDOWN */}
                <div className="form-group col-md-6">
                  <label>Designation</label>
                  <select
                    className="form-control"
                    value={designation}
                    onChange={(e) => {
                      const value = e.target.value;
                      setDesignation(value);

                      if (value === "Zonal Manager - CNS") setRolee("ZM");
                      else if (value === "Regional Manager - CNS") setRolee("RM");
                      else if (value === "Health Care Manager - CNS") setRolee("HCE");
                      else setRolee("");
                    }}
                  >
                    <option value="">Select Designation</option>
                    <option value="Zonal Manager - CNS">Zonal Manager - CNS</option>
                    <option value="Regional Manager - CNS">Regional Manager - CNS</option>
                    <option value="Health Care Manager - CNS">Health Care Manager - CNS</option>
                  </select>
                </div>

                <div className="form-group col-md-6">
                  <label>Password</label>
                  <input
                    type="text"
                    value={passworde}
                    onChange={(e) => setPassworde(e.target.value)}
                    className="form-control"
                  />
                </div>

              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn mx-auto"
                  style={{ border: "none", backgroundColor: "#2f3f6f", color: "white" }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <ConfirmationPopup
          message="Are you sure you want to Edit Employee?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default EditModel;
