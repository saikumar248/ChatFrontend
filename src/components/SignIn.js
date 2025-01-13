import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";

import { UserContext } from "./context/UserContext";

import axios from "axios";

import { GoogleLogin } from "@react-oauth/google";
const clientId =
  "867875222781-touqthjkkbuodoqo58euunuiq1lgge6g.apps.googleusercontent.com";

const SignIn = () => {
  const { setUser } = useContext(UserContext);

  // Use context to set user data

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate(); // React Router's navigation hook
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const handleVerifyUser = () => {
    axios
      .post(`${baseUrl}/api/signin`, formData)
      .then((response) => {
        console.log(response);
        const user = response.data.user;
        const userData = {
          message: "Signin successful!",
          user: user,
        };
        console.log(userData.user);
        setUser(userData.user);

        // Navigate to chat room
        navigate("/chatRoom");
      })
      .catch((error) => {
        console.log(error);
        // Handle error and set the error state
        setError(
          `Error ${error.response.status}: ${
            error.response.data.message || "Invalid Credentials."
          }`
        );
      });
  };

  const handleSubmit = async (e) => {
    handleVerifyUser();
    e.preventDefault();
    setIsSubmitted(true);
    // console.log("Submitted Data:", formData);
  };

  const [showState, setshowState] = useState(false);
  const clickClose = () => {
    setshowState(false);
    window.location.reload();
  };

  const [userData, setUserData] = useState(null);

  const onSuccess = (res) => {
    console.log("LOGIN SUCCESS! Current user: ", res.profileObj);
    setshowState(true);
    setUserData(res.profileObj);
    console.log(userData);
    navigate("/chatRoom");
  };
  const onFailure = (res) => {
    console.log("LOGIN FAILED! res: ", res);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div
            className="card shadow"
            style={{
              background: "rgba(0, 0, 0, 0.2)", // Semi-transparent overlay
              backdropFilter: "blur(10px)", // Apply the blur effect
              backgroundPosition: "center", // Centers the background image
              backgroundSize: "cover", // Ensure the image covers the area
              color: "#fff", // Adjust text color for better visibility
              border: "none", // Optional: Remove card border
              padding: "20px", // Optional: Add some padding inside the card
              borderRadius: "8px", // Optional: Add rounded corners
            }}
          >
            <div className="card-body">
              <h3 className="text-center">Sign In</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                {error && <p className="text-danger">{error}</p>}
                <button type="submit" className="btn btn-dark w-100">
                  Sign In
                </button>
              </form>
              <p className="text-center mt-3">
                {/* Don't have an account?{" "} */}
                {/* <button className="btn btn-link p-0" onClick={togglePage}>
                  Sign Up
                </button> */}
                <Link
                  to="/signup"
                  className="text-sm  hover:underline hover:text-blue-600 mt-2 inline-block"
                >
                  {"Don't"} have an account?
                </Link>
                <br></br>
                <Link
                  to="/ForgotPassword"
                  className="text-sm  hover:underline hover:text-blue-600 mt-2 inline-block"
                >
                  Forgot Password
                </Link>
              </p>
              <div className="text-center mt-3">
                <GoogleLogin
                  clientId={clientId}
                  buttonText="Login"
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                  cookiePolicy={"single_host_origin"}
                  issignedIn={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
