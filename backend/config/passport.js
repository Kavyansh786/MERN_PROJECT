const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

// Ensure environment variables are loaded
require('dotenv').config({ path: '.env' });

// Configure Google Strategy
const configureGoogleStrategy = () => {
  // Get environment variables
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    const error = new Error('Google OAuth credentials are missing from environment variables');
    console.error('❌ ' + error.message);
    throw error;
  }

  const strategyOptions = {
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: "/api/auth/google/callback"
  };

  return new GoogleStrategy(strategyOptions, googleOAuthCallback);
};

// Google OAuth callback function
const googleOAuthCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with same email
    const email = profile.emails?.[0]?.value;
    if (!email) {
      console.error('No email found in Google profile');
      return done(new Error('No email found in Google profile'), null);
    }

    user = await User.findOne({ email: email });
    
    if (user) {
      // Link Google account to existing user
      console.log('Linking Google account to existing user:', email);
      user.googleId = profile.id;
      user.isGoogleUser = true;
      
      // Only verify if user was already verified, otherwise require OTP
      if (!user.isEmailVerified) {
        const { generateOTP } = require('../utils/otp');
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        
        // Send OTP email to existing user linking Google account
        try {
          const { sendOTPEmail } = require('./nodemailer');
          await sendOTPEmail(email, otp);
          console.log(`✅ OTP sent to existing user linking Google: ${email}`);
        } catch (emailError) {
          console.error('❌ Failed to send OTP to existing user:', emailError.message);
        }
      }
      
      await user.save();
      return done(null, user);
    }
    
    // Generate a secure random password for Google-authenticated users
    const randomPassword = require('crypto').randomBytes(32).toString('hex');
    const hashedPassword = await require('bcryptjs').hash(randomPassword, 10);
    
    // Generate OTP for new Google users
    const { generateOTP } = require('../utils/otp');
    const otp = generateOTP();
    
    user = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: email,
      phone: '', // Will be empty for Google users initially
      password: hashedPassword, // Store a hashed password
      isGoogleUser: true,
      isEmailVerified: false, // Require OTP verification even for Google users
      otp: otp,
      otpExpires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Send OTP email to new Google user
    try {
      const { sendOTPEmail } = require('./nodemailer');
      await sendOTPEmail(email, otp);
      console.log(`✅ OTP sent to new Google user: ${email}`);
    } catch (emailError) {
      console.error('❌ Failed to send OTP to Google user:', emailError.message);
    }
    
    return done(null, user);
  } catch (error) {
    console.error('Google OAuth Error:', error.message);
    return done(error, null);
  }
};

// Initialize passport with strategies
const initializePassport = () => {
  try {
    // Configure Google Strategy
    const googleStrategy = configureGoogleStrategy();
    passport.use(googleStrategy);

    // Serialize/Deserialize user
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.findById(id);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });

    return passport;
  } catch (error) {
    console.error('Failed to initialize passport');
    throw error;
  }
};

// Create and export the initialized passport instance
const initializedPassport = initializePassport();

module.exports = {
  passport: initializedPassport,
  initializePassport,
  getPassport: () => initializedPassport
};