
import { Navigate } from "react-router-dom";

const ProtectdRoute = ({children}) => {
    
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if(!isLoggedIn){
        return <Navigate to='/'  replace={true}></Navigate>
     }
     return children;
}

export default ProtectdRoute