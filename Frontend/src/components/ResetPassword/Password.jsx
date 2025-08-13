import React, { useState } from 'react'

import './Password.css'
import axios from 'axios';
import { BASEURL } from '../../constant/constant';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const Password = () => {
    const empId = sessionStorage.getItem("userId");
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
  
    const handleOldPasswordChange = (e) => setOldPassword(e.target.value);
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

    const navigate = useNavigate();
    const handleSubmit = async(e) => {
      e.preventDefault();
      // Add password reset logic here
     // console.log('Old Password:', oldPassword);
     // console.log('New Password:', newPassword);

      try {
        const res = await axios.post(`${BASEURL}/reset-password`,{empId,oldPassword,newPassword});
        //console.log("password change responce",res);
        if(res?.data?.errorCode == 1){
            toast.success(res?.data?.message)
            navigate('/category')
        }
        
      } catch (error) {
        console.log("inside error")
        console.log(error)
        toast.error(error?.response?.data?.message)
      }
      // Reset form fields
      setOldPassword('');
      setNewPassword('');
    };
  
    const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
    const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Reset Password</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3 position-relative">
                  <label htmlFor="oldPassword" className="form-label">Old Password</label>
                  <input
                    type={showOldPassword ? "text" : "password"}
                    className="form-control"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={handleOldPasswordChange}
                    required
                  />
                  <i
                    className={`fa ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute`}
                    style={{ top: '40px', right: '10px', cursor: 'pointer' }}
                    onClick={toggleShowOldPassword}
                  ></i>
                </div>
                <div className="mb-3 position-relative">
                  <label htmlFor="newPassword" className="form-label">Set New Password</label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    maxLength={10}
                    required
                  />
                  <i
                    className={`fa ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute`}
                    style={{ top: '40px', right: '10px', cursor: 'pointer' }}
                    onClick={toggleShowNewPassword}
                  ></i>
                </div>
                <button type="submit" className="btn btn-primary">Reset Password</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Password