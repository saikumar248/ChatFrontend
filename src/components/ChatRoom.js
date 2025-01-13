
import React, { useEffect, useState, useRef, useContext } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Send, Users, MessageSquare, User, LogOut } from "lucide-react";
import { UserContext } from "./context/UserContext";
import "./css/ChatRoom.css";


const ChatRoom = () => {
  const { signedInUser } = useContext(UserContext);
  const [signedInUserData, setSignedInUserData] = useState({
    email: signedInUser?.email || "",
    password: signedInUser?.password || "",
    firstName: signedInUser?.firstName || "",
    lastName: signedInUser?.lastName || "",
    phoneNumber: signedInUser?.phoneNumber || "",
  });
  


  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState("CHATROOM");

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/fetch');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data)
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  fetchUsers();


  const [userData, setUserData] = useState({
    email:'',
    password:'',
    firstName:'',
    lastName:'',
    phoneNumber:'',
    username: "",
    connected: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // console.log(signedInUser);

  useEffect(() => {
    scrollToBottom();
  }, [publicChats, privateChats]);

  const connect = async () => {
    try {
      setLoading(true);
      setError("");
      // const socket = new SockJS("http://localhost:8080/ws");
      const baseUrl = process.env.REACT_APP_BASE_URL; 
      const socket = new SockJS(`${baseUrl}/ws`);
      stompClientRef.current = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {},
        debug: (str) => {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      stompClientRef.current.onConnect = onConnected;
      stompClientRef.current.onStompError = onError;
      stompClientRef.current.activate();
    } catch (err) {
      setError("Failed to connect to chat server");
      setLoading(false);
    }
  };

  const onConnected = () => {
    setLoading(false);
    setUserData((prev) => ({ ...prev, connected: true
      
     }));
    stompClientRef.current.subscribe("/chatroom/public", onMessageReceived);
    stompClientRef.current.subscribe(
      `/user/${userData.username}/private`,
      onPrivateMessage
    );
    userJoin();
  };

  const userJoin = () => {
    if (!stompClientRef.current) return;

    const chatMessage = {
      senderName: userData.username,
      status: "JOIN",
      date: new Date().toISOString(),
    };

    stompClientRef.current.publish({
      destination: "/app/message",
      body: JSON.stringify(chatMessage),
    });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        if (!privateChats.get(payloadData.senderName)) {
          setPrivateChats((prev) => {
            const newMap = new Map(prev);
            newMap.set(payloadData.senderName, []);
            return newMap;
          });
        }
        break;
      case "MESSAGE":
        setPublicChats((prev) => [...prev, payloadData]);
        break;
      default:
        break;
    }
  };

  const onPrivateMessage = (payload) => {
    const payloadData = JSON.parse(payload.body);
    setPrivateChats((prev) => {
      const newMap = new Map(prev);
      const messages = newMap.get(payloadData.senderName) || [];
      newMap.set(payloadData.senderName, [...messages, payloadData]);
      return newMap;
    });
  };

  const onError = (err) => {
    console.error("STOMP error:", err);
    setError("Connection error occurred");
    setLoading(false);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData((prev) => ({ ...prev, message: value }));
  };

  const sendValue = () => {
    if (stompClientRef.current && userData.message.trim()) {
      const chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: "MESSAGE",
        date: new Date().toISOString(),
      };
      stompClientRef.current.publish({
        destination: "/app/message",
        body: JSON.stringify(chatMessage),
      });
      setUserData((prev) => ({ ...prev, message: "" }));
    }
  };

  const sendPrivateValue = () => {
    if (stompClientRef.current && userData.message.trim()) {
      const chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE",
        date: new Date().toISOString(),
      };

      if (userData.username !== tab) {
        setPrivateChats((prev) => {
          const newMap = new Map(prev);
          const messages = newMap.get(tab) || [];
          newMap.set(tab, [...messages, chatMessage]);
          return newMap;
        });
      }

      stompClientRef.current.publish({
        destination: "/app/private-message",
        body: JSON.stringify(chatMessage),
      });
      setUserData((prev) => ({ ...prev, message: "" }));
    }
  };

  const handleUsername = (event) => {
    const { value } = event.target;
    setUserData((prev) => ({ ...prev, username: value }));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (userData.connected) {
        tab === "CHATROOM" ? sendValue() : sendPrivateValue();
      } else {
        registerUser();
      }
    }
  };

  const registerUser = () => {
    userData.username = `${signedInUser.firstName} ${signedInUser.lastName}`;
    if (userData.username.trim()) {
      connect();
    }
  };

  const handleLogout = () => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }
    setUserData({
      username: "",
      connected: false,
      message: "",
    });
    setPrivateChats(new Map());
    setPublicChats([]);
    setTab("CHATROOM");
  };

  return (
    <div className="chatroom-container">
      <div className="relative py-3 sm:max-w-xl md:max-w-4xl lg:max-w-4xl xl:max-w-4xl mx-auto">
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {!userData.connected ? (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        ) : null}

        <div className="relative bg-white shadow-lg sm:rounded-3xl px-4 py-10 bg-white shadow-lg sm:p-20">
          {!userData.connected ? (
            <div className="login-container">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="flex flex-col items-center space-y-4">
                    <Users className="login-icon" />
                    <h1 className="login-title">
                      Welcome to ChatRoom
                    </h1>
                    <button
                      onClick={registerUser}
                      disabled={loading}
                      className="login-button"
                    >
                      {loading ? "Connecting..." : "Join Chat"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="chatroom-main">
              {/* Sidebar */}
              <div className="sidebar">
                <div className="sidebar-header">
                  <div className="flex items-center space-x-2">
                    <User className="sidebar-icon" />
                    <span>{userData.username}</span>
                  </div>
                  <LogOut className="logout-icon" onClick={handleLogout} />
                </div>

                <div className="chat-tabs">
                  <div
                    onClick={() => setTab("CHATROOM")}
                    className={`tab ${tab === "CHATROOM" ? "active" : ""}`}
                  >
                    <MessageSquare />
                    <span>Public Chat</span>
                  </div>

                  {[...privateChats.keys()].map((name, index) => (
                    <div
                      key={index}
                      onClick={() => setTab(name)}
                      className={`tab ${tab === name ? "active" : ""}`}
                    >
                      <User />
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="chat-area">
                <div className="chat-header">
                  <h2>
                    {tab === "CHATROOM"
                      ? "Public Chat Room"
                      : `Chat with ${tab}`}
                  </h2>
                </div>

                <div
                  ref={chatContainerRef}
                  className="chat-messages"
                >
                  {(tab === "CHATROOM"
                    ? publicChats
                    : privateChats.get(tab) || []
                  ).map((chat, index) => (
                    <div
                      key={index}
                      className={`message ${
                        chat.senderName === userData.username ? "sent" : "received"
                      }`}
                    >
                      {chat.senderName !== userData.username && (
                        <div className="message-sender">{chat.senderName}</div>
                      )}
                      <div>{chat.message}</div>
                      <div className="message-time">
                        {formatTime(chat.date)}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-footer">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={userData.message}
                    onChange={handleMessage}
                    onKeyPress={handleKeyPress}
                  />
                  <button onClick={tab === "CHATROOM" ? sendValue : sendPrivateValue}>
                    <Send />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;

