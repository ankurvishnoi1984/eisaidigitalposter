import React, { useEffect, useState } from 'react'
import './Category.css'
import axios from 'axios'
import { BASEURL } from '../../constant/constant'
import { useNavigate } from 'react-router-dom'
const Category = () => {


    const [category, setCategeory] = useState([]);

    const navigate = useNavigate()

    async function GetCategory(){
     try {
       const res = await axios.get(`${BASEURL}/getCategory`) ;
       setCategeory(res.data);
     } catch (error) {
        console.log(error)
     }
    }

    useEffect(()=>{
        GetCategory()
    },[])

    const handelCatChange = async(catId)=>{
      //console.log(catId)
       if(catId === 3){
        return
       }
      sessionStorage.setItem("catId",catId);
      navigate('/subcategory')
      
    }
  return (
    <>
       <div className='row'>
            {category.map((e) => (
                <div key={e.catid} className='col-md-6' onClick={() => handelCatChange(e.catid)}>
                    <div className='cat_sub_div'>{e.name}</div>
                </div>
            ))}
        </div>
    </>
  )
}

export default Category