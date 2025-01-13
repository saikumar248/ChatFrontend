import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Otp() {
  const [otp, setOtp] = useState('');
  const phoneNumber = 8247891955; // Replace with dynamic value as needed


    // Function to generate and send OTP
    const generateAndSendOtp = async () => {
      const date = new Date();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const Otpxyz = minutes + seconds; // OTP generated using current minutes and seconds
      setOtp(Otpxyz);

    //   const message = `Dear customer, use this OTP ${Otpxyz} to signup into your Quality Thought Next account. This OTP will be valid for the next 15 mins.`;
      const message = `Dear customer, use this OTP ${Otpxyz} to complete your signup authentication for the Chat App. This OTP will be valid for the next 15 minutes.`;

      const encodedMessage = encodeURIComponent(message);

      // Replace sensitive info with environment variables
      const apiUrl = `https://login4.spearuc.com/MOBILE_APPS_API/sms_api.php?type=smsquicksend&user=qtnextotp&pass=987654&sender=QTTINF&t_id=1707170494921610008&to_mobileno=${phoneNumber}&sms_text=${encodedMessage}`;

      try {
        const response = await axios.get(apiUrl);
        console.log('API Response:', response.data);
      } catch (error) {
        console.error('API Error:', error);
      }
    };

 

  return (
    <div>
      <h1>OTP Component</h1>
      <button onClick={generateAndSendOtp}>Send</button>
      <p>Generated OTP: {otp}</p>
    </div>
  );
}

export default Otp;
