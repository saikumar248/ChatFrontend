import axios from "axios";
import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerify, setOtpVerify] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const handlePostUser = () => {
    axios
      .post(`${baseUrl}/api/signup`, formData)
      .then((response) => {
        alert("User registered successfully!");
      })
      .catch((error) => {
        console.log(error);
        setError(
          `Error ${error.response.status}: ${
            error.response.data.message ||
            "Sign-up failed. The user may already exist. Please try again."
          }`
        );
      });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
    } = formData;

    // Validation: Check all fields are filled
    console.log(firstName,lastName,email,phoneNumber,password,confirmPassword)
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      setError("All fields are required!");
      return;
    }

    // Validation: Email format
    if (
      !email.includes("@") ||
      !email.includes(".") ||
      email.indexOf("@") === 0 ||
      email.split("@")[1].indexOf(".") === -1
    ) {
      setError("Invalid email address!");
      return;
    }

    // Validation: Phone number length
    if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
      setError("Phone number must be exactly 10 digits!");
      return;
    }

    // Validation: Password strength
    let hasUppercase = false;
    let hasDigit = false;
    let hasSpecialCharacter = false;
    const specialCharacters = "!@#$%^&*";

    for (const char of password) {
      if (char >= "A" && char <= "Z") hasUppercase = true;
      if (char >= "0" && char <= "9") hasDigit = true;
      if (specialCharacters.includes(char)) hasSpecialCharacter = true;
    }

    if (
      password.length < 8 ||
      !hasUppercase ||
      !hasDigit ||
      !hasSpecialCharacter
    ) {
      setError(
        "Password must be at least 8 characters long, include one uppercase letter, one digit, and one special character."
      );
      return;
    }

    // Validation: Password match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (!otpVerify || otp == "") {
      setError("Verify Mobile Number");
      return;
    }

    // If all validations pass
    setError(""); // Clear any previous errors
    handlePostUser();
    console.log("Form data submitted:", formData);
    navigate("/signin")

    // You can add further logic here to send the data to a backend or API
  };

  const generateAndSendOtp = async () => {




    const phoneNumber = formData.phoneNumber;
    const date = new Date();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const Otpxyz = minutes + seconds; // OTP generated using current minutes and seconds
    setOtp(Otpxyz);
    setOtpSent(true);
    setShowOtpField(true);

    const message = `Dear customer, use this OTP ${Otpxyz} to signup into your Quality Thought Next account. This OTP will be valid for the next 15 mins.`;
    // const message = `Dear customer, use this OTP ${Otpxyz} to complete your signup authentication for the Chat App. This OTP will be valid for the next 15 minutes.`;

    const encodedMessage = encodeURIComponent(message);

    const apiUrl = `https://login4.spearuc.com/MOBILE_APPS_API/sms_api.php?type=smsquicksend&user=qtnextotp&pass=987654&sender=QTTINF&t_id=1707170494921610008&to_mobileno=${phoneNumber}&sms_text=${encodedMessage}`;
    try {
      const response = await axios.get(apiUrl);
      console.log("API Response:", response.data);
    } catch (error) {
      console.log(error);
      setError("");
    }
  };

  const handleOtpSubmit = () => {
    if (otp == formData.otp) {
      setOtpVerify(true);
      setShowOtpField(false);
      setError("");
    } else {
      setFormData({ otp: "" });
      const otpField = document.querySelector("#otpField");
      if (otpField) {
        otpField.focus(); // Bring the cursor back to the OTP field
      }
      setError("Invalid OTP");
    }
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
            {" "}
            <div className="card-body">
              <h3 className="text-center">Sign Up</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your first name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  {formData.email && !formData.email.includes("@") ? (
                    <p style={{ color: "red" }}>Please enter a valid email.</p>
                  ) : null}
                  <br />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter your phone number"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      disabled={otpVerify}
                      onChange={handleChange}
                      required
                    />
                    {!otpVerify ? (
                      <button
                        className="btn btn-success"
                        onClick={generateAndSendOtp}
                        disabled={otpVerify}
                      >
                        Verify
                      </button>
                    ) : (
                      <Check className="text-green-500 w-6 h-6" />
                    )}
                    {otpVerify === false && otpSent && (
                      <X className="text-red-500 w-6 h-6" />
                    )}
                  </div>

                  {error && <p className="text-red-500 mt-1">{error}</p>}

                  {showOtpField && (
                    <div className="mt-3">
                      <label className="form-label">Enter OTP</label>
                      <input
                        type="number"
                        id="otpField"
                        className="form-control"
                        placeholder="Enter OTP"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        required
                      />
                      <button
                        className="btn btn-success mt-2 w-full"
                        onClick={handleOtpSubmit}
                      >
                        Submit OTP
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  {formData.phoneNumber && formData.phoneNumber.length != 10 ? (
                    <p style={{ color: "red" }}>
                      PhoneNumber Must be exactly 10 Digits
                    </p>
                  ) : null}
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  {formData.password &&
                  (formData.password.length < 8 ||
                    !formData.password
                      .split("")
                      .some((char) => char >= "A" && char <= "Z") ||
                    !formData.password
                      .split("")
                      .some((char) => char >= "0" && char <= "9") ||
                    !formData.password
                      .split("")
                      .some((char) => "!@#$%^&*".includes(char))) ? (
                    <p style={{ color: "red" }}>
                      Password must be at least 8 characters long, include one
                      uppercase letter, one digit, and one symbol.
                    </p>
                  ) : null}
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm your password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword ? (
                    <p style={{ color: "red" }}>Password did not match</p>
                  ) : null}
                  <br />
                </div>
                {error && <p className="text-danger">{error}</p>}
                <button type="submit" className="btn btn-dark w-100">
                  Sign Up
                </button>
              </form>
              <p className="text-center mt-3">
                <Link
                  to={"/signIn"}
                  className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
                  href="#"
                >
                  Already have an account?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
