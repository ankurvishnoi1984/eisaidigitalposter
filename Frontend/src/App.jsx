
import { Route, Routes,} from 'react-router-dom';
import DashboardStyle from './style/DashboardStyle'
import DashboardContent from './components/Dashboard/DashboardContent'
import PosterContent from './components/Poster/PosterContent';
import Login from './components/login/login';
import ProtectdRoute from './protectedRoutes/ProtectdRoute';
import AdminLogin from './Admin/login/ALogin';
import DocReports from './Admin/Reports/DocReports';
import ViewDoc from './Admin/ViewDoc/ViewDoc';
import EmpReports from './Admin/Reports/EmpReports';
import PageNotFound from './components/PageNotFound/PageNotFound';
import AdminProtectdRoute from './AdminprotectedRoutes/AdminProtectdRoute';
import Reports from './Admin/Reports/Reports';
//import { ToastContainer } from 'react-toastify';
//import "react-toastify/dist/ReactToastify.css";
import Category from './components/Category/Category';
import SubCategory from './components/SubCategory/SubCategory';
import { Toaster } from 'react-hot-toast';
import Password from './components/ResetPassword/Password';


function App() {
 
  return (
    <>
      <Routes>
        <Route path='/adminLogin' element={<AdminLogin></AdminLogin>}/>
       <Route path='/' element={<Login/>}/>
       <Route path='/DocReport' element={<AdminProtectdRoute><DocReports/></AdminProtectdRoute>}/>
       <Route path='/dashboard/report' element={<AdminProtectdRoute><EmpReports/></AdminProtectdRoute>}/>
       <Route path='/report' element={<AdminProtectdRoute><Reports/></AdminProtectdRoute>}/>
       <Route path='/viewdoc/:id' element={<AdminProtectdRoute><ViewDoc/></AdminProtectdRoute>}/>
      
      <Route element={<DashboardStyle/>} >
        <Route path='/dashboard' element={<ProtectdRoute><DashboardContent/></ProtectdRoute>}/>
        <Route path='/category' element={<ProtectdRoute><Category/></ProtectdRoute>}/>
        <Route path='/subcategory' element={<ProtectdRoute><SubCategory/></ProtectdRoute>}/>
        <Route path='/reset-password' element={<ProtectdRoute><Password/></ProtectdRoute>}/>
        <Route path='/dashboard/poster/:id' element={<ProtectdRoute><PosterContent/></ProtectdRoute>}/>
      </Route> 
        <Route path='*' element={<PageNotFound></PageNotFound>}></Route>
    </Routes> 
    <Toaster
  position="top-center"
  reverseOrder={false}
  toastOptions={{
    duration: 2000,
  }}
/>
    </>
  )
}

export default App
