import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../components/Toast';
import Footer from '../components/Footer';

export default function GoogleAuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions in React 18 StrictMode
    if (hasProcessed.current) return;
    
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    // Mark as processed
    hasProcessed.current = true;

    const handleError = (message = 'Authentication failed. Please try again.') => {
      showToast({
        type: 'error',
        message,
        duration: 3000,
      });
      navigate('/login');
    };

    if (error) {
      handleError('Google authentication failed. Please try again.');
      return;
    }

    const processSuccess = () => {
      try {
        if (!token || !userParam) {
          handleError('Invalid authentication data received.');
          return;
        }

        const user = JSON.parse(decodeURIComponent(userParam));
        
        // Store user data and token
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        // Dispatch custom event to update navbar
        window.dispatchEvent(new Event('userUpdated'));

        showToast({
          type: 'success',
          message: 'Google login successful!',
          duration: 3000,
        });

        // Redirect to profile
        navigate('/user/profile', { replace: true });
      } catch (error) {
        console.error('Error processing authentication:', error);
        handleError('Failed to process your login. Please try again.');
      }
    };

    // Process the success flow
    if (token && userParam) {
      processSuccess();
    } else {
      handleError();
    }

    // Cleanup function to prevent memory leaks
    return () => {
      // Any cleanup if needed
    };
  }, [searchParams, navigate, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-200 via-pink-100 to-amber-100">
      <div className="bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col items-center max-w-md w-full mx-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-rose-400 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 text-center">Completing your login...</h2>
        <p className="text-gray-500 mt-2 text-center">Please wait while we set up your account.</p>
      </div>
      <Footer />
    </div>
  );
}
