import { Outlet ,Link } from 'react-router-dom'
import './rootLayout.css'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/react-router'

import {QueryClient,QueryClientProvider} from "@tanstack/react-query";
// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY


if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}
const queryClient =new QueryClient();
const RootLayout = () => {
  return (
     <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
 
    <QueryClientProvider client={queryClient}>

    <div className='rootLayout'>
      <header>
        <Link to="/" className='logo'>
        <img src="/logo.png" alt=""></img>
        <span>AI</span>
        </Link>
        <div className="user"> 
         
      <SignedIn>
        <UserButton />
      </SignedIn></div>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
    </QueryClientProvider>
     </ClerkProvider>
  )
}


export default RootLayout;