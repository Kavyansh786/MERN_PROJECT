import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/Toast';
import { ValidationRules, sanitizeInput, securityChecks } from '../utils/validation';
import { GOOGLE_AUTH_URL } from '../config/api';

// Key for localStorage
const LOGIN_FORM_DATA = 'loginFormData';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem(LOGIN_FORM_DATA);
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(prev => ({
          ...prev,
          ...parsedData,
          password: '' // Don't pre-fill password for security
        }));
      } catch (error) {
        console.error('Error parsing saved login data:', error);
        localStorage.removeItem(LOGIN_FORM_DATA);
      }
    }
  }, []);
  
  const { email, password, rememberMe } = formData;
  
  const validateField = (name, value) => {
    const rule = ValidationRules[name];
    if (!rule || !rule.validate) return [];
    return rule.validate(value);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let sanitizedValue = value;
    
    // Sanitize input based on field type
    if (name === 'email') {
      sanitizedValue = sanitizeInput.email(value);
      setEmailNotVerified(false);
    } else if (name === 'password') {
      sanitizedValue = sanitizeInput.text(value);
    }
    
    // Security checks
    if (securityChecks.hasSQLInjection(sanitizedValue) || securityChecks.hasXSS(sanitizedValue)) {
      showToast({
        type: 'error',
        message: 'Invalid characters detected. Please use only standard characters.',
        duration: 3000,
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : sanitizedValue
    }));
    
    // Real-time validation for touched fields
    if (touched[name] && name !== 'rememberMe') {
      const fieldErrors = validateField(name, sanitizedValue);
      setErrors(prev => ({ ...prev, [name]: fieldErrors }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (name !== 'rememberMe') {
      const fieldErrors = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: fieldErrors }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate email
    const emailErrors = validateField('email', email);
    if (emailErrors.length > 0) {
      newErrors.email = emailErrors;
    }
    
    // Validate password
    if (!password) {
      newErrors.password = ['Password is required'];
    }
    
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Rate limiting check
    const rateLimit = securityChecks.checkRateLimit('login_attempts', 5, 300000);
    if (!rateLimit.allowed) {
      showToast({
        type: 'error',
        message: `Too many login attempts. Please try again in ${Math.ceil(rateLimit.remainingTime / 60)} minutes.`,
        duration: 5000,
      });
      return;
    }
    
    // Validate form
    if (!validateForm()) {
      showToast({
        type: 'error',
        message: 'Please fix the errors below',
        duration: 3000,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Save form data if rememberMe is checked
    if (rememberMe) {
      localStorage.setItem(LOGIN_FORM_DATA, JSON.stringify({ email, rememberMe: true }));
    } else {
      localStorage.removeItem(LOGIN_FORM_DATA);
    }

    try {
      setEmailNotVerified(false);
      const res = await axios.post('/api/auth/login', {
        email: sanitizeInput.email(email),
        password,
      });

      if (res.data && res.data.user && res.data.token) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('token', res.data.token);

        // Dispatch custom event to update navbar
        window.dispatchEvent(new Event('userUpdated'));

        showToast({
          type: 'success',
          message: 'Login successful!',
          duration: 3000,
        });

        setTimeout(() => {
          navigate('/user/profile');
        }, 1000);
      } else {
        showToast({
          type: 'error',
          message: 'Invalid response from server',
          duration: 3000,
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid credentials';
      if (errorMessage === 'Email not verified. Please verify your email first.') {
        setEmailNotVerified(true);
      }
      showToast({
        type: 'error',
        message: errorMessage,
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center px-2 bg-gradient-to-br from-rose-200 via-pink-100 to-amber-100 relative"
      style={{
        backgroundImage: "url('bg 2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#5a3a1b' }}>
          Welcome Back
        </h2>
        <p className="text-center mb-8 text-lg" style={{ color: '#a58a6a' }}>
          Sign in to your account to continue
        </p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-medium" style={{ color: '#7c5c36' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 transition text-gray-700 ${
                touched.email && errors.email?.length > 0
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-rose-200'
              }`}
              name="email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              autoComplete="email"
              maxLength={254}
            />
            {touched.email && errors.email?.length > 0 && (
              <div className="mt-1 text-sm text-red-600">
                {errors.email.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium" style={{ color: '#7c5c36' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 pr-10 text-gray-700 transition ${
                  touched.password && errors.password?.length > 0
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-rose-200'
                }`}
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                autoComplete="current-password"
                maxLength={128}
              />
              {touched.password && errors.password?.length > 0 && (
                <div className="mt-1 text-sm text-red-600">
                  {errors.password.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-400 focus:outline-none"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {emailNotVerified && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md my-4" role="alert">
              <p className="font-bold">Verification Required</p>
              <p className="text-sm">Your email is not verified. Please check your inbox for an OTP.</p>
              <button
                type="button"
                onClick={() => navigate('/verify-otp', { state: { email } })}
                className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
              >
                Go to Verification Page
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-rose-500 focus:ring-rose-400 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-rose-400 hover:text-rose-500 font-medium transition">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || Object.keys(errors).some(key => errors[key]?.length > 0)}
            className={`w-full text-white py-3 rounded-xl font-semibold text-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#B76E79]/50 ${
              isSubmitting || Object.keys(errors).some(key => errors[key]?.length > 0)
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105 active:scale-95 hover:shadow-lg'
            }`}
            style={{ backgroundColor: '#B76E79' }}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Signing In...
              </>
            ) : (
              <>
                Sign In <span className="text-xl">→</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center w-full my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={() => window.location.href = GOOGLE_AUTH_URL}
          className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold text-lg shadow-md transition-all duration-200 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 hover:shadow-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don&apos;t have an account?
          <a href="/register" className="text-rose-500 font-semibold hover:underline ml-1">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}
