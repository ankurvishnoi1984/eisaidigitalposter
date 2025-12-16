import React, { useEffect, useState } from 'react'
import './SubCategory.css'
import axios from 'axios'
import { BASEURL } from '../../constant/constant'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
//import { toast } from 'react-toastify'
const SubCategory = () => {


  const catId = sessionStorage.getItem('catId');
    const [subCategory, setSubCategory] = useState([]);
const catName = sessionStorage.getItem("catName") || "Category";
    const navigate = useNavigate()

    async function GetSubCategory(){
     try {
       const res = await axios.post(`${BASEURL}/getSubCategory`,{catId}) ;
       setSubCategory(res.data);
     } catch (error) {
        console.log(error)
     }
    }

    useEffect(()=>{
      GetSubCategory()
    },[])

    const handelSubCatChange = async(subCatId,isPoster,subCatName,CatName)=>{
      
      if(isPoster === "N"){
        toast.error("Poster coming soon")
        return;
      }
      sessionStorage.setItem("subCatId",subCatId);
       sessionStorage.setItem("subCatName", subCatName);  
         sessionStorage.setItem("CatName", CatName);  
      navigate('/dashboard')
      
    }
  return (
    <>
    <div className="breadcrumb-wrapper">
  <div className=" breadcrumb-inner">
  

    <nav aria-label="breadcrumb" className="breadcrumb-nav">
      <ol className="breadcrumb-list">
        <li className="crumb crumb-current">
 
            {catName || "Category"}
         
        </li>

       
      </ol>
    </nav>
  </div>
</div>
    <div
        className="content-header"
        style={{ backgroundColor: "#39a6cf", color: "#fff", height:"50px" }}
      >
        <p className="text-center" style={{ fontSize: "25px" }}>
          {" "}
          <Link to="/category" className=" text-left">
            <button type="button" className="btn btn-primary float-left">
              <i className="fas fa-arrow-left"></i>
            </button>
          </Link>{" "}
        
        </p>

        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6"></div>
          </div>
        </div>
      </div>
       <div className='d-flex sub_cat_main_div row'>
        {subCategory.map((e)=><div key={e.subcat_id} onClick={()=>handelSubCatChange(e.subcat_id,e.isPoste,e.name)} className='sub_cat_sub_div col-sm-3'>{e.name}</div>)}
          
       </div>
    </>
  )
}

export default SubCategory