import React, { useState, useRef } from 'react';
import { Camera, SendHorizontal } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSendMessage = () => {
    if (message.trim() || selectedFile) {
      if (message.trim()) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'text', content: message },
        ]);
      }

      if (selectedFile) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'file', content: selectedFile },
        ]);
        setSelectedFile(null);
      }

      setMessage('');
    } else {
      alert('Message or file cannot be empty');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setSelectedFile(fileURL);
    }
    fileInputRef.current.value = '';
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="container-fluid h-100 py-3">
      <div className="row justify-content-end h-100">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card h-100 shadow">
            {/* Header */}
            <div className="card-header bg-success text-white text-center py-3">
              <h3 className="mb-0">Chat with us</h3>
            </div>

            {/* Chat Body */}
            <div className="card-body bg-light overflow-auto" style={{ height: '60vh' }}>
              <p className="text-muted">How can I help you...</p>
              
              {messages.length === 0 ? (
                <p className="text-center text-muted">No messages yet. Start chatting!</p>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className="d-flex justify-content-end mb-3">
                    <div className="bg-success text-white rounded-3 px-3 py-2">
                      {msg.type === 'text' ? (
                        <p className="mb-0 w-10">{msg.content}</p>
                      ) : (
                        <img
                          src={msg.content}
                          alt="Uploaded"
                          className="rounded img-fluid"
                          style={{
                            maxWidth: '200px',
                            maxHeight: '200px',
                            display: 'block'
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="card-footer bg-white border-top-0 p-3">
              <div className="input-group">
                <button 
                  className="btn btn-outline-success"
                  onClick={handleCameraClick}
                >
                  <Camera size={24} />
                </button>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="d-none"
                />

                <input
                  type="text"
                  className="form-control mx-2 rounded-pill"
                  placeholder="Enter your query"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                
                />

                <button 
                  className="btn btn-success rounded-circle"
                  onClick={handleSendMessage}
                >
                  <SendHorizontal size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;