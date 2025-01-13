import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/ForgotPassword.css";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mainOtp, setMainOtp] = useState("");
  const [error, setError] = useState("");

  const [oldPassword, setOldPassword] = useState("");

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const handleSendOtp = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      const response = await axios.get(`${baseUrl}/api/fetch/email/${email}`);
      console.log(response);
      console.log(response.data.password);
      setOldPassword(response.data.password);
    } catch (error) {
      console.error("Error fetching email:", error);
      setError("Email Not Found. Please Register.");
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/sendEmailOTPforSignup/${email}`
      );
      console.log(response);
      setMainOtp(response.data);
      alert(`OTP sent to ${email}`);
      setIsOtpSent(true);
      setError(""); // Clear previous error
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = () => {
    if (otp == mainOtp) {
      alert("OTP Verified Successfully");
      setIsOtpVerified(true);
      setError(""); // Clear previous error
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  const handleUpdatePassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password == oldPassword) {
      setError("Your New password is same as OldPassword");
      setConfirmPassword("");
      setPassword("");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (
      !password.split("").some((char) => /[A-Z]/.test(char)) ||
      !password.split("").some((char) => /[0-9]/.test(char)) ||
      !password.split("").some((char) => /[!@#$%^&*]/.test(char))
    ) {
      setError(
        "Password must include one uppercase letter, one number, and one symbol."
      );
      return;
    }

    try {
      await axios.put(`${baseUrl}/api/updatePasswordByEmail`, null, {
        params: { email, newPassword: password },
      });
      alert("Password updated successfully");
      navigate("/SignIn");
      setError(""); 
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Failed to update password. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div
            className="card shadow"
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(10px)",
              backgroundPosition: "center",
              backgroundSize: "cover",
              color: "#fff",
              border: "none",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <div className="card-body">
              <h2 className="forgot-password-heading">Forgot Password</h2>
              {error && <p className="error-text">{error}</p>}
              {!isOtpSent && (
                <div>
                  <label className="forgot-password-label">Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="forgot-password-input"
                  />
                  <button
                    onClick={handleSendOtp}
                    className="forgot-password-button"
                  >
                    Send OTP
                  </button>
                </div>
              )}

              {isOtpSent && !isOtpVerified && (
                <div>
                  <label className="forgot-password-label">OTP:</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="forgot-password-input"
                  />
                  <button
                    onClick={handleVerifyOtp}
                    className="forgot-password-button"
                  >
                    Verify OTP
                  </button>
                </div>
              )}

              {isOtpVerified && (
                <div>
                  <label className="forgot-password-label">New Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="forgot-password-input"
                  />
                  <label className="forgot-password-label">
                    Confirm Password:
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="forgot-password-input"
                  />
                  <button
                    onClick={handleUpdatePassword}
                    className="forgot-password-button"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
