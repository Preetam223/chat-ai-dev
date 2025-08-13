import { useMutation, useQueryClient } from '@tanstack/react-query';
import './dashboardPage.css'
import {useAuth} from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const {getToken} =useAuth() //extra

  const queryClient = useQueryClient()

  const navigate =useNavigate()
  const mutation = useMutation({
    mutationFn:async (text)=>{
    const token = await getToken(); //extra

       return fetch(`${import.meta.env.VITE_API_URL}/api/chats`,{
      method:"POST",
      credentials:"include",
      headers:{
        Authorization: `Bearer ${token}`, // extra include for error unauthenticated
        "Content-Type":"application/json"
      },
      body:JSON.stringify({text})
    }).then(res=>res.json())
    },
   
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['userChats'] });
      navigate(`/dashboard/chats/${id}`);
    },
  })
  const handleSubmit =async (e)=>{

    e.preventDefault();
    const text=e.target.text.value
    if(!text) return
     console.log("TEST =",text);
    mutation.mutate(text)

  }
  return (
    <div className='dashboardPage'>
      <div className="texts">
        <div className="logo">
        <img src="/logo.png" alt="" />
        <h1>CHAT AI</h1>
       </div>
       <div className="options">
         <div className="option">
          <img src="/chat.png" alt="" />
          <span>Create a new Chat</span>
         </div>
         <div className="option">
          <img src="/image.png" alt="" />
          <span>Analyse Images</span>
         </div>
         <div className="option">
          <img src="/code.png" alt="" />
          <span>Help me with my code</span>
         </div>
       </div>
      </div>
      <div className="formContainer">

        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder="Ask me anything..."></input>
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default DashboardPage