import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  BrowserRouter,
  Route,
  Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import Chat from "./components/chat";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Hello from "./components/Hello";
import ChatRoom from "./components/ChatRoom";
import ForgotPassword from "./components/ForgotPassword";
import Otp from "./components/Otp";
// import Nav from "./components/Nav";
const clientId =
  "867875222781-touqthjkkbuodoqo58euunuiq1lgge6g.apps.googleusercontent.com";

function App() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    console.log("User signed out");
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <>
      {/* <ChatRoom/> */}
      {/* <Otp/> */}
      <div>
        <div className="App">
          <GoogleOAuthProvider clientId="867875222781-touqthjkkbuodoqo58euunuiq1lgge6g.apps.googleusercontent.com">
            <Routes>
              <Route exact path="/" element={<SignIn />} />

              <Route path="/SignIn" element={<SignIn />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/ForgotPassword" element={<ForgotPassword />} />

              <Route path="/contact" element={<div>Contact Page</div>} />
              <Route path="/chatRoom" element={<ChatRoom />} />
            </Routes>
          </GoogleOAuthProvider>
        </div>
      </div>
    </>
  );
}

export default App;
