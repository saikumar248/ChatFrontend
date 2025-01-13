import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const clientId =
  "867875222781-touqthjkkbuodoqo58euunuiq1lgge6g.apps.googleusercontent.com";

function Hello() {
  const [showState, setShowState] = useState(false);
  const [userData, setUserData] = useState(null);

  const clickClose = () => {
    setShowState(false);
    setUserData(null);
    window.location.reload();
  };

  const onSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Decoded User Data: ", decoded);
      console.log(decoded.name)
      setUserData(decoded);
      setShowState(true);
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  };

  const onFailure = (error) => {
    console.log("LOGIN FAILED! Error: ", error);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="d-flex justify-content-center w-100">
        <div id="signInButton" className="my-3 ms-2">
          {!showState ? (
            <GoogleLogin onSuccess={onSuccess} onError={onFailure} />
          ) : (
            <div
              className="card text-center p-3"
              style={{ backgroundColor: "white", borderRadius: "0.2rem" }}
            >
              <h3 className="card-title">Welcome, {userData?.name}!</h3>
              <img
                src={userData?.picture || "https://via.placeholder.com/150"}
                alt="Profile"
                className="rounded-circle mx-auto d-block"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <p className="mt-3">Email: {userData?.email}</p>
              <button className="btn btn-primary" onClick={clickClose}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Hello;
