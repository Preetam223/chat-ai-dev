import { Link } from 'react-router-dom'
import './chatList.css';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/react-router';


const ChatList = () => {
 const {getToken} =  useAuth();
const { isPending, error, data } = useQuery({
  queryKey: ['userChats'],
  queryFn: async () => {
    const token = await getToken();
     
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    return res.json();
  },
});

  return (
    <div className='chatList'>
      <span className='title'>Dashboard</span>
        <Link to="/dashboard">Create a new Chat</Link>
        <Link to="/">Explore Chat AI</Link>
        <Link to="/">Contact</Link>
        <hr></hr>
      <span className='title'>REACENT CHATS</span>
         <div className="list">
          {isPending ? "Loading..." :error ?"Something went wrong !":data?.map((chat)=>(
           <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>{chat.title}</Link>
          ))}
          
         </div>
        <hr></hr>
        <div className="upgrade">
           <img src="/logo.png" alt="" />
           <div className="texts">
            <span>Upgrade to Chat AI Pro</span>
            <span>Get unlimited access to all features</span>
           </div>
        </div>
     
    </div>
  )
}

export default ChatList