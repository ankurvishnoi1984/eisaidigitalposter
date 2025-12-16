
import { useEffect, useState } from "react";
import "./RequestPopup.css"
import { BASEURL } from "../constant/constant";
import axios from "axios";
const RequestPopup = ({ message, onApproved, onReject, onCancel,isApproved,pathlabId }) => {
  
  const [comment, setComment] = useState('')
  const [pathlabList, setPathlabList] = useState([]);
  
  const [pathlab, setPathlab] = useState(pathlabId);
  const [pathlabName, setPathlabName] = useState('');
  const [pathlabEmail,setPathlabEmail] = useState('');
  const getPathlabList = async () => {
    try {
      const res = await axios.get(`${BASEURL}/report/getPathLab`);
      setPathlabList(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handelPathlabChange = (event) => {
    if (!event.target.value) {
      setPathlab("");
      setPathlabName("");
      setPathlabEmail("");
      return;
    }

    const selectedPathlab = pathlabList.find(
      (e) => e.pathlab_id == event.target.value
    );

    if (selectedPathlab) {
      setPathlab(selectedPathlab.pathlab_id);
      setPathlabName(selectedPathlab.pathlab_name);
      setPathlabEmail(selectedPathlab.pathlab_email);
    }
  };


   const handelApproved =()=>{
      onApproved(comment,pathlab,pathlabName,pathlabEmail)
   }

   const handelReject =()=>{
     onReject(comment,pathlab,pathlabName,pathlabEmail)
   }

   useEffect(()=>{
       getPathlabList();
   },[])

  

    return (
<div
          className="popup-container fade show"
        >
          <div className="modal-dialog m-width" >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Update Request Status
                </h5>
                <button
                  className="close"
                  type="button"
                  onClick={onCancel}
                >
                  <span>×</span>
                </button>
              </div>
              <div className="modal-body">
              <form>
              <div className="form-group col-md-12">
              <label className="form-label">Name of Pathlab</label>
                      <select
                        className="form-control"
                        

                        onChange={handelPathlabChange}
                        value={pathlab}
                      >
                        {/* <option value="">Select...</option> */}
                        {pathlabList.map((e) => (
                          <option key={e.pathlab_id} value={e.pathlab_id}>
                            {e.pathlab_name}
                          </option>
                        ))}
                      </select>
                       
                    </div>
           <div className="mb-3">
             <label htmlFor="message-text" className="col-form-label">Message:</label>
             <textarea onChange={(e)=>{
               setComment(e.target.value)
            }} className="form-control"></textarea>
           </div>
           </form>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  type="button"
                 
                  onClick={onCancel}
                >
                  Cancel
                </button>
                {isApproved === "Y" ? "":<button
                  className="btn btn-success"
                  onClick={handelApproved}
                 
                >
                  Approved
                </button>}
                {isApproved === "R" ? "":<button
                  className="btn btn-danger"
                  onClick={handelReject}
                 
                >
                  Reject
                </button>}
              </div>
            </div>
          </div>
        </div>


//       <div className="modal fade" id="exampleModal"  aria-labelledby="exampleModalLabel" aria-hidden="true">
//   <div className="modal-dialog">
//     <div className="modal-content">
//       <div className="modal-header">
//         <h1 className="modal-title fs-5" id="exampleModalLabel">New message</h1>
//         <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//       </div>
//       <div className="modal-body">
//         <form>
//           <div className="mb-3">
//             <label htmlFor="recipient-name" className="col-form-label">Recipient:</label>
//             <input type="text" className="form-control" id="recipient-name"/>
//           </div>
//           <div className="mb-3">
//             <label htmlFor="message-text" className="col-form-label">Message:</label>
//             <textarea className="form-control" id="message-text"></textarea>
//           </div>
//         </form>
//       </div>
//       <div className="modal-footer">
//         <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//         <button type="button" className="btn btn-primary">Send message</button>
//       </div>
//     </div>
//   </div>
// </div>
    );
  };
  
  export default RequestPopup;