import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ValidationRules, sanitizeInput, securityChecks } from '../utils/validation';
import { useToast } from '../components/Toast';


export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    const rule = ValidationRules[name];
    if (!rule || !rule.validate) return [];
    
    if (name === 'name') {
      return rule.validate(value, name === 'firstName' ? 'First name' : 'Last name');
    }
    return rule.validate(value);
  };

  const handleInputChange = (name, value) => {
    let sanitizedValue = value;
    
    // Sanitize based on field type
    switch (name) {
      case 'firstName':
      case 'lastName':
        sanitizedValue = sanitizeInput.name(value);
        break;
      case 'email':
        sanitizedValue = sanitizeInput.email(value);
        break;
      case 'phone':
        sanitizedValue = sanitizeInput.phone(value);
        break;
      case 'password':
      case 'confirmPassword':
        sanitizedValue = sanitizeInput.text(value);
        break;
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
    
    // Update state based on field
    switch (name) {
      case 'firstName':
        setFirstName(sanitizedValue);
        break;
      case 'lastName':
        setLastName(sanitizedValue);
        break;
      case 'email':
        setEmail(sanitizedValue);
        break;
      case 'phone':
        setPhone(sanitizedValue);
        break;
      case 'password':
        setPassword(sanitizedValue);
        break;
      case 'confirmPassword':
        setConfirmPassword(sanitizedValue);
        break;
    }
    
    // Real-time validation for touched fields
    if (touched[name]) {
      let errors = [];
      if (name === 'firstName' || name === 'lastName') {
        errors = validateField('name', sanitizedValue);
      } else if (name === 'confirmPassword') {
        if (sanitizedValue !== password) {
          errors = ['Passwords do not match'];
        }
      } else {
        errors = validateField(name, sanitizedValue);
      }
      
      setFieldErrors(prev => ({ ...prev, [name]: errors }));
    }
  };

  const handleBlur = (name, value) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    let errors = [];
    if (name === 'firstName' || name === 'lastName') {
      errors = validateField('name', value);
    } else if (name === 'confirmPassword') {
      if (value !== password) {
        errors = ['Passwords do not match'];
      }
    } else if (name !== 'agreeTerms') {
      errors = validateField(name, value);
    }
    
    setFieldErrors(prev => ({ ...prev, [name]: errors }));
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate first name
    const firstNameErrors = validateField('name', firstName);
    if (firstNameErrors.length > 0) {
      errors.firstName = firstNameErrors;
    }
    
    // Validate email
    const emailErrors = validateField('email', email);
    if (emailErrors.length > 0) {
      errors.email = emailErrors;
    }
    
    // Validate phone
    const phoneErrors = validateField('phone', phone);
    if (phoneErrors.length > 0) {
      errors.phone = phoneErrors;
    }
    
    // Validate password
    const passwordErrors = validateField('password', password);
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors;
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      errors.confirmPassword = ['Please confirm your password'];
    } else if (password !== confirmPassword) {
      errors.confirmPassword = ['Passwords do not match'];
    }
    
    // Validate terms agreement
    if (!agreeTerms) {
      errors.agreeTerms = ['You must agree to the terms'];
    }
    
    setFieldErrors(errors);
    setTouched({
      firstName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      agreeTerms: true
    });
    
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Rate limiting check
    const rateLimit = securityChecks.checkRateLimit('register_attempts', 3, 300000);
    if (!rateLimit.allowed) {
      showToast({
        type: 'error',
        message: `Too many registration attempts. Please try again in ${Math.ceil(rateLimit.remainingTime / 60)} minutes.`,
        duration: 5000,
      });
      return;
    }
    
    if (!validateForm()) {
      showToast({
        type: 'error',
        message: 'Please fix the errors below',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await axios.post('/api/auth/register', {
        name: `${sanitizeInput.name(firstName)} ${sanitizeInput.name(lastName)}`.trim(),
        email: sanitizeInput.email(email),
        phone: sanitizeInput.phone(phone),
        password,
      });

      // Check if email was sent successfully
      if (response.data.emailError) {
        setErrorMessage(response.data.message);
        return;
      }

      // On successful registration request, navigate to the OTP page
      navigate('/verify-otp', { state: { email } });

    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || 'Registration failed.';
      setErrorMessage(errorMsg);
      showToast({
        type: 'error',
        message: errorMsg,
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-200/80 to-white px-2 py-8"
      style={{
        backgroundImage: "url('bg 2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <form
        onSubmit={handleRegister}
        className="w-full max-w-xl bg-white/95 rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col gap-4"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: '#5a3a1b' }}>
          Create Account
        </h2>
        <p className="text-center text-lg mb-4" style={{ color: '#a58a6a' }}>
          Join our exclusive jewelry collection
        </p>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            onBlur={(e) => handleBlur('firstName', e.target.value)}
            required
            className={`flex-1 px-4 py-3 border rounded-lg transition ${
              touched.firstName && fieldErrors.firstName?.length > 0
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-rose-200'
            }`}
            maxLength={50}
            autoComplete="given-name"
          />
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            onBlur={(e) => handleBlur('lastName', e.target.value)}
            className={`flex-1 px-4 py-3 border rounded-lg transition ${
              touched.lastName && fieldErrors.lastName?.length > 0
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-rose-200'
            }`}
            maxLength={50}
            autoComplete="family-name"
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          onBlur={(e) => handleBlur('email', e.target.value)}
          required
          className={`w-full px-4 py-3 border rounded-lg transition ${
            touched.email && fieldErrors.email?.length > 0
              ? 'border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:ring-rose-200'
          }`}
          maxLength={254}
          autoComplete="email"
        />
        {touched.email && fieldErrors.email?.length > 0 && (
          <div className="mt-1 text-sm text-red-600">
            {fieldErrors.email.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}

        <div className="relative">
          <input
            type="tel"
            placeholder="Phone (10 digits)"
            value={phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            onBlur={(e) => handleBlur('phone', e.target.value)}
            required
            className={`w-full px-4 py-3 border rounded-lg transition ${
              touched.phone && fieldErrors.phone?.length > 0
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-rose-200'
            }`}
            pattern="[0-9]{10}"
            title="Please enter a 10-digit phone number"
            maxLength={10}
            autoComplete="tel"
          />
          {touched.phone && fieldErrors.phone?.length > 0 && (
            <div className="mt-1 text-sm text-red-600">
              {fieldErrors.phone.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}

        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            onBlur={(e) => handleBlur('password', e.target.value)}
            required
            className={`w-full px-4 py-3 border rounded-lg pr-10 transition ${
              touched.password && fieldErrors.password?.length > 0
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-rose-200'
            }`}
            maxLength={128}
            autoComplete="new-password"
          />
          {touched.password && fieldErrors.password?.length > 0 && (
            <div className="mt-1 text-sm text-red-600">
              {fieldErrors.password.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
            👁️
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
            required
            className={`w-full px-4 py-3 border rounded-lg pr-10 transition ${
              touched.confirmPassword && fieldErrors.confirmPassword?.length > 0
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-rose-200'
            }`}
            maxLength={128}
            autoComplete="new-password"
          />
          {touched.confirmPassword && fieldErrors.confirmPassword?.length > 0 && (
            <div className="mt-1 text-sm text-red-600">
              {fieldErrors.confirmPassword.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3">
            👁️
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input 
            type="checkbox" 
            checked={agreeTerms} 
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className={formSubmitted && fieldErrors.agreeTerms ? 'border-red-500' : ''}
          />
          I agree to the Terms of Service
        </label>

        {/* Display all form errors above the submit button */}
        {(formSubmitted && Object.keys(fieldErrors).length > 0) && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="text-red-700">
              <p className="font-semibold">Please fix the following errors:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                {Object.values(fieldErrors).map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`text-white py-3 rounded-xl mt-2 transition-all duration-200 flex items-center justify-center gap-2 ${
            isSubmitting || !agreeTerms || Object.keys(fieldErrors).some(key => fieldErrors[key]?.length > 0)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#B76E79] hover:bg-[#A65D6E] hover:scale-105 active:scale-95'
          }`}
          disabled={isSubmitting || !agreeTerms || Object.keys(fieldErrors).some(key => fieldErrors[key]?.length > 0)}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Creating Account...
            </>
          ) : (
            'Create Account →'
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center w-full my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
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

        <p className="text-center mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-rose-500 font-semibold hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
