import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from state (regular registration) or URL params (Google OAuth)
  const urlParams = new URLSearchParams(location.search);
  const email = location.state?.email || urlParams.get('email');
  const isGoogleUser = urlParams.get('source') === 'google';

  useEffect(() => {
    if (!email) {
      toast.error('No email found. Please register again.');
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (resendDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendDisabled]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/verify-otp', { email, otp });
      toast.success(data.message);
      
      // Store the token and user data after successful verification
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Dispatch custom event to update navbar
        window.dispatchEvent(new Event('userUpdated'));
        
        // Redirect to profile page since user is now logged in
        navigate('/user/profile');
      } else {
        // Fallback to login if no token received
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setResendDisabled(true);
    try {
      const { data } = await axios.post('/api/auth/send-otp', { email });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
      setResendDisabled(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Verify Your Email</h2>
        <p className="text-center text-gray-600 mb-6">
          {isGoogleUser 
            ? `To complete your Google sign-in, an OTP has been sent to ${email}. Please enter it below.`
            : `An OTP has been sent to ${email}. Please enter it below.`
          }
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="otp" className="block text-gray-700 text-sm font-bold mb-2">OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={handleResendOTP}
              className={`font-bold text-sm ${resendDisabled ? 'text-gray-500' : 'text-blue-500 hover:text-blue-800'}`}
              disabled={resendDisabled}
            >
              {resendDisabled ? `Resend in ${countdown}s` : 'Resend OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
