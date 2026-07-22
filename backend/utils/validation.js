const validator = require('validator');
const rateLimit = require('express-rate-limit');

// Server-side validation utilities
class ServerValidation {
  // Email validation
  static validateEmail(email) {
    const errors = [];
    
    if (!email) {
      errors.push('Email is required');
      return { isValid: false, errors };
    }
    
    // Sanitize email
    const sanitizedEmail = validator.normalizeEmail(email.toLowerCase().trim());
    
    if (!sanitizedEmail) {
      errors.push('Invalid email format');
      return { isValid: false, errors };
    }
    
    // Length check
    if (sanitizedEmail.length > 254) {
      errors.push('Email is too long (max 254 characters)');
    }
    
    // Format validation
    if (!validator.isEmail(sanitizedEmail)) {
      errors.push('Please enter a valid email address');
    }
    
    // Check for consecutive dots
    if (sanitizedEmail.includes('..')) {
      errors.push('Email cannot contain consecutive dots');
    }
    
    // Domain validation
    const parts = sanitizedEmail.split('@');
    if (parts.length === 2) {
      const [localPart, domain] = parts;
      
      if (localPart.length > 64) {
        errors.push('Email local part is too long (max 64 characters)');
      }
      
      if (localPart.startsWith('.') || localPart.endsWith('.')) {
        errors.push('Email cannot start or end with a dot');
      }
      
      // Check for valid TLD
      const domainParts = domain.split('.');
      if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
        errors.push('Email must have a valid domain extension');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedEmail
    };
  }
  
  // Password validation
  static validatePassword(password) {
    const errors = [];
    
    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (password.length > 128) {
      errors.push('Password is too long (max 128 characters)');
    }
    
    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    // Check for number
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Check for common weak patterns
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /admin/i,
      /letmein/i
    ];
    
    for (const pattern of commonPatterns) {
      if (pattern.test(password)) {
        errors.push('Password contains common weak patterns');
        break;
      }
    }
    
    // Check for repeated characters
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password cannot contain more than 2 consecutive identical characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // Name validation
  static validateName(name, fieldName = 'Name') {
    const errors = [];
    
    if (!name) {
      errors.push(`${fieldName} is required`);
      return { isValid: false, errors };
    }
    
    // Sanitize name
    const sanitizedName = validator.escape(name.trim());
    
    if (sanitizedName.length < 2) {
      errors.push(`${fieldName} must be at least 2 characters long`);
    }
    
    if (sanitizedName.length > 50) {
      errors.push(`${fieldName} is too long (max 50 characters)`);
    }
    
    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    if (!/^[a-zA-Z\s'-]+$/.test(sanitizedName)) {
      errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
    }
    
    // Check for excessive spaces
    if (/\s{2,}/.test(sanitizedName)) {
      errors.push(`${fieldName} cannot contain multiple consecutive spaces`);
    }
    
    // Check for leading/trailing special characters
    if (sanitizedName.startsWith(' ') || sanitizedName.endsWith(' ') || 
        sanitizedName.startsWith('-') || sanitizedName.endsWith('-') ||
        sanitizedName.startsWith("'") || sanitizedName.endsWith("'")) {
      errors.push(`${fieldName} cannot start or end with spaces or special characters`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedName.replace(/\s+/g, ' ').trim()
    };
  }
  
  // Phone validation (Indian format)
  static validatePhone(phone) {
    const errors = [];
    
    if (!phone) {
      errors.push('Phone number is required');
      return { isValid: false, errors };
    }
    
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length !== 10) {
      errors.push('Phone number must be exactly 10 digits');
    }
    
    // Check if it starts with valid Indian mobile prefix
    if (!/^[6-9]/.test(cleanPhone)) {
      errors.push('Phone number must start with 6, 7, 8, or 9');
    }
    
    // Check for sequential numbers
    const isSequential = /^(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)|9(?=0)){9}\d$/.test(cleanPhone);
    if (isSequential) {
      errors.push('Phone number cannot be sequential');
    }
    
    // Check for repeating numbers
    const isRepeating = /^(\d)\1{9}$/.test(cleanPhone);
    if (isRepeating) {
      errors.push('Phone number cannot be all the same digit');
    }
    
    // Check for common fake numbers
    const fakeNumbers = [
      '1234567890', '0987654321', '1111111111', '2222222222',
      '3333333333', '4444444444', '5555555555', '6666666666',
      '7777777777', '8888888888', '9999999999', '0000000000'
    ];
    
    if (fakeNumbers.includes(cleanPhone)) {
      errors.push('Please enter a valid phone number');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: cleanPhone
    };
  }
}

// Security middleware
class SecurityMiddleware {
  // SQL injection detection
  static detectSQLInjection(input) {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /('|(\\')|(;)|(\\)|(\/\*)|(--)|(\*\/)|(\bOR\b)|(\bAND\b))/i,
      /(UNION\s+SELECT)/i,
      /(DROP\s+TABLE)/i,
      /(INSERT\s+INTO)/i,
      /(DELETE\s+FROM)/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }
  
  // XSS detection
  static detectXSS(input) {
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /<link/i,
      /<meta/i,
      /eval\(/i,
      /expression\(/i
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }
  
  // Input sanitization middleware
  static sanitizeInput(req, res, next) {
    const sanitizeValue = (value) => {
      if (typeof value === 'string') {
        // Remove potential XSS and SQL injection patterns
        let sanitized = validator.escape(value);
        
        // Additional sanitization
        sanitized = sanitized
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
        
        return sanitized;
      }
      return value;
    };
    
    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
      for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          req.body[key] = sanitizeValue(req.body[key]);
        }
      }
    }
    
    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      for (const key in req.query) {
        if (req.query.hasOwnProperty(key)) {
          req.query[key] = sanitizeValue(req.query[key]);
        }
      }
    }
    
    next();
  }
  
  // Security validation middleware
  static validateSecurity(req, res, next) {
    const checkInput = (obj) => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] === 'string') {
          if (SecurityMiddleware.detectSQLInjection(obj[key])) {
            return res.status(400).json({
              message: 'Invalid input detected: SQL injection attempt'
            });
          }
          
          if (SecurityMiddleware.detectXSS(obj[key])) {
            return res.status(400).json({
              message: 'Invalid input detected: XSS attempt'
            });
          }
        }
      }
    };
    
    // Check request body
    if (req.body) {
      checkInput(req.body);
    }
    
    // Check query parameters
    if (req.query) {
      checkInput(req.query);
    }
    
    next();
  }
}

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        message: message,
        retryAfter: Math.ceil(windowMs / 1000 / 60) // minutes
      });
    }
  });
};

// Rate limiting middleware
const rateLimiters = {
  // Login attempts: 5 attempts per 15 minutes
  login: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5,
    'Too many login attempts. Please try again in 15 minutes.'
  ),
  
  // Registration attempts: 3 attempts per 15 minutes
  register: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    3,
    'Too many registration attempts. Please try again in 15 minutes.'
  ),
  
  // OTP requests: 5 attempts per 15 minutes
  otp: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5,
    'Too many OTP requests. Please try again in 15 minutes.'
  ),
  
  // General API: 100 requests per 15 minutes
  general: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    100,
    'Too many requests. Please try again later.'
  )
};

// Validation middleware for registration
const validateRegistration = (req, res, next) => {
  const { name, email, phone, password } = req.body;
  const errors = {};
  
  // Validate name
  if (name) {
    const nameValidation = ServerValidation.validateName(name, 'Name');
    if (!nameValidation.isValid) {
      errors.name = nameValidation.errors;
    } else {
      req.body.name = nameValidation.sanitizedValue;
    }
  } else {
    errors.name = ['Name is required'];
  }
  
  // Validate email
  const emailValidation = ServerValidation.validateEmail(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.errors;
  } else {
    req.body.email = emailValidation.sanitizedValue;
  }
  
  // Validate phone
  const phoneValidation = ServerValidation.validatePhone(phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.errors;
  } else {
    req.body.phone = phoneValidation.sanitizedValue;
  }
  
  // Validate password
  const passwordValidation = ServerValidation.validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors;
  }
  
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

// Validation middleware for login
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};
  
  // Validate email
  const emailValidation = ServerValidation.validateEmail(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.errors;
  } else {
    req.body.email = emailValidation.sanitizedValue;
  }
  
  // Basic password validation for login
  if (!password) {
    errors.password = ['Password is required'];
  } else if (password.length > 128) {
    errors.password = ['Password is too long'];
  }
  
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

module.exports = {
  ServerValidation,
  SecurityMiddleware,
  rateLimiters,
  validateRegistration,
  validateLogin
};
