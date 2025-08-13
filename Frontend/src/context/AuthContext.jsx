import { createContext, useState } from "react";

export const IdContext = createContext();

export const IdContexProvider = ({children})=>{

       const [empId,setEmpId] = useState();

       const handelId = (value)=>{
         setEmpId(value);
       }

    return <IdContext.Provider value={{handelId,empId}}>{children}</IdContext.Provider>
}