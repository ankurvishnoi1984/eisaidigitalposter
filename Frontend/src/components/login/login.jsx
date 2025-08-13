import { useState } from "react";
import s from "./login.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASEURL } from "../../constant/constant";
//import { IdContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
function Login() {
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  //const { handelId } = useContext(IdContext);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(empId, password);
    try {
      let response = await axios.post(`${BASEURL}/login`, { empId, password });

      
     // handelId(response.data.empID);
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userId", response.data.empID);
        
      const isPasswordReset = response?.data?.isPasswordReset;

       if(isPasswordReset === 'Y'){
        navigate('/reset-password');
        return;
       }
       
        navigate("/category");
   
    } catch (error) {
      toast.error('Invalid Credential')
      setError("Invalid Credential");
    }
  };

  const handleForgotPassword = async (e) => {

    const trimmedEmail = email.trim();
    e.preventDefault();
    setLoading(true);
    try {
      
    
      const res = await axios.post(`${BASEURL}/forgot-password`, { email:trimmedEmail });
      if(res.data.errorCode == 1){
        
        setShowModal(false);
        setEmail('');
        toast.success('Email sent successfully');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
    finally {
      setLoading(false);
    }
    
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={s.logbody}>
      <div className={`${s.page_wrapper} ${s.p_b_100} ${s.font_poppins}`}>
        <div className={`${s.wrapper} ${s.wrapper_w780}`}>
          <div className={`${s.card} ${s.card_3}`}>
            <div className={s.card_heading}></div>
            <div className={s.card_body}>
              <div style={{ marginBottom: "36px" }}>
                <h2 className={s.title}>Sign-In</h2>
                <p>Enter your login credentials.</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className={s.input_group}>
                  <input
                    className={s.input_style_3}
                    type="text"
                    placeholder="Employee Id"
                    name="email"
                    onChange={(e) => {
                      setEmpId(e.target.value);
                    }}
                  />
                </div>

                <div className={s.input_group} style={{}}>
                  <input
                    id="password-field"
                    className={s.input_style_3}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <span
                    className={`fa fa-fw  field-icon toggle-password ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                    style={{
                      float: "right",
                      marginLeft: "-25px",
                      marginTop: "14px",
                      paddingRight: "10px",
                      position: "relative",
                      zIndex: 2,
                    }}
                    onClick={togglePasswordVisibility}
                  ></span>
                  <a
                    href=""
                    style={{
                      textAlign: "end",
                      textDecoration: "none",
                      color: "#000",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      setShowModal(true);
                    }}
                  >
                    <p>Forgot Password?</p>
                  </a>
                  {error && <p style={{ color: "red" }}>😈 {error}</p>}
                </div>

                <div className={s.p_t_10} style={{ textAlign: "center" }}>
                  <button className={`${s.btn} ${s.btn_pill}`} type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      

      {showModal && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Forgot Password</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleForgotPassword}>
                  <div className="form-group">
                    <label htmlFor="email">Enter your email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {loading ? (
                    <div style={{color:"#20c997"}}>Sending email...</div>
                  ) : (
                    <button type="submit" className="btn btn-primary">Submit</button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Login;
