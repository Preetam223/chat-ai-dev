import './chatPage.css'
import NewPrompt from '../../components/newPrompt/NewPrompt';
import { useAuth } from '@clerk/react-router';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import Markdown from 'react-markdown';
import React from 'react';
import { IKImage } from 'imagekitio-react';

const ChatPage = () => {
    const path =useLocation().pathname
    const chatId=path.split("/").pop()

   const {getToken} =  useAuth();
   const { isPending, error, data } = useQuery({
     queryKey: ["chat",chatId],
     queryFn: async () => {
       const token = await getToken();
       
       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
         method: 'GET',
         credentials:"include",
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
    <div className='chatPage'>
      <div className="wrapper">
        <div className="chat">
          {isPending ? "Loading..." :error ?"Something went wrong here":data?.history?.map((message,i)=>(
            <React.Fragment key={i}>
            {message.img&&(
              <IKImage
              urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
              path={message.img}
              height="300"
              width="400"
              transformation={[{height:300,width:400}]}
              loading ="lazy"
              lqip={{active:true,quality:20}}
              
              />
            )}
            <div className={message.role==="user"?"message user":"message"} >
            <Markdown>{message.parts[0].text}</Markdown>
          </div>
          </React.Fragment>
          ))}
          
          {data && <NewPrompt data={data}/>}
         
        </div>
      </div>
    </div>
  )
}

export default ChatPage