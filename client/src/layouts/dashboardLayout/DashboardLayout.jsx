import {RedirectToSignIn, useAuth } from '@clerk/react-router';
import './dashboardLayout.css'
import { Outlet, useNavigate} from 'react-router-dom';
import { useEffect } from 'react';
import ChatList from '../../components/chatList/ChatList';

const DashboardLayout = () => {

  const {userId,isLoaded}=useAuth();
  const navigate =useNavigate();


  useEffect(()=>{
    if(isLoaded&&!userId&& window.location.pathname !== "/sign-in"){
      navigate("/sign-in"); 
    }
    // small change in if condiotion due to reduce an error of redirecting
  },[isLoaded,userId,navigate]);
  
 if(!isLoaded) return "Loading...";

  return (
    <div className='dashboardLayout'>
      <div className="menu"><ChatList/></div>
      <div className="contant"><Outlet/></div>
    </div>
  )
}

export default DashboardLayout