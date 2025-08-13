import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
import './index.css'
import { createBrowserRouter ,RouterProvider} from 'react-router-dom';
import RootLayout from "./layouts/rootLayout/RootLayout.jsx";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout.jsx";
import DashboardPage from './routes/dashboardPage/DashboardPage.jsx';
import ChatPage from "./routes/chatPage/ChatPage.jsx";
import HomePage from "./routes/homepage/HomePage.jsx";
import SignInPage from "./routes/signInPage/SignInPage.jsx";
import SignUpPage from "./routes/signUpPage/SignUpPage.jsx";
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';


const router =createBrowserRouter([
  {
    element :<RootLayout/>,
    children:[
      {path :"/",
        element:<HomePage/>

      },
      {path :"/sign-in/*",
        element:<SignInPage/>

      },
      {path :"/sign-up/*",
        element:<SignUpPage/>

      },
      {
        // there is changes i have make due to falior or rediectional after sign-in
        element:(
    <>        
      <SignedIn>
        <DashboardLayout />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  ), 
  //  here
        children:[
         { path:"/dashboard",
          element:<DashboardPage/>
         },
         { path:"/dashboard/chats/:id",
          element:<ChatPage/>
         },
         ]
      }
    ]
   },
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
