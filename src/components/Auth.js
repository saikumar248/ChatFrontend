import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";


const Auth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignInPage, setIsSignInPage] = useState(true);

  const togglePage = () => {
    setIsSignInPage(!isSignInPage);
  };

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  return (
    <div>
      {isAuthenticated ? <div/> : 
        isSignInPage ? 
          <SignIn onSignIn={handleSignIn} togglePage={togglePage} /> : 
          <SignUp togglePage={togglePage} />
      }
    </div>
  );
};

export default Auth;
