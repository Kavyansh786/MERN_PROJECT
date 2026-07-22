// Expert-level validation utilities for forms

export const ValidationRules = {
  // Email validation with comprehensive checks
  email: {
    required: true,
    pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    maxLength: 254,
    validate: (email) => {
      const errors = [];
      
      if (!email) {
        errors.push('Email is required');
        return errors;
      }
      
      // Check length
      if (email.length > 254) {
        errors.push('Email is too long (max 254 characters)');
      }
      
      // Check for valid format
      if (!ValidationRules.email.pattern.test(email)) {
        errors.push('Please enter a valid email address');
      }
      
      // Check for consecutive dots
      if (email.includes('..')) {
        errors.push('Email cannot contain consecutive dots');
      }
      
      // Check for valid domain
      const parts = email.split('@');
      if (parts.length === 2) {
        const [localPart, domain] = parts;
        
        // Local part validation
        if (localPart.length > 64) {
          errors.push('Email local part is too long (max 64 characters)');
        }
        
        if (localPart.startsWith('.') || localPart.endsWith('.')) {
          errors.push('Email cannot start or end with a dot');
        }
        
        // Domain validation
        if (domain.length < 1 || domain.length > 253) {
          errors.push('Invalid email domain length');
        }
        
        // Check for valid TLD
        const domainParts = domain.split('.');
        if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
          errors.push('Email must have a valid domain extension');
        }
      }
      
      return errors;
    }
  },

  // Password validation with security requirements
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    validate: (password) => {
      const errors = [];
      
      if (!password) {
        errors.push('Password is required');
        return errors;
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
      
      return errors;
    }
  },

  // Name validation
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
    validate: (name, fieldName = 'Name') => {
      const errors = [];
      
      if (!name) {
        errors.push(`${fieldName} is required`);
        return errors;
      }
      
      const trimmedName = name.trim();
      
      if (trimmedName.length < 2) {
        errors.push(`${fieldName} must be at least 2 characters long`);
      }
      
      if (trimmedName.length > 50) {
        errors.push(`${fieldName} is too long (max 50 characters)`);
      }
      
      if (!ValidationRules.name.pattern.test(trimmedName)) {
        errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
      }
      
      // Check for excessive spaces
      if (/\s{2,}/.test(trimmedName)) {
        errors.push(`${fieldName} cannot contain multiple consecutive spaces`);
      }
      
      // Check for leading/trailing spaces or special characters
      if (trimmedName.startsWith(' ') || trimmedName.endsWith(' ') || 
          trimmedName.startsWith('-') || trimmedName.endsWith('-') ||
          trimmedName.startsWith("'") || trimmedName.endsWith("'")) {
        errors.push(`${fieldName} cannot start or end with spaces or special characters`);
      }
      
      return errors;
    }
  },

  // Phone validation with Indian number format
  phone: {
    required: true,
    pattern: /^[6-9]\d{9}$/,
    validate: (phone) => {
      const errors = [];
      
      if (!phone) {
        errors.push('Phone number is required');
        return errors;
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
        errors.push('Phone number cannot be sequential (e.g., 1234567890)');
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
      
      return errors;
    }
  }
};

// Real-time validation hook
export const useFormValidation = (initialState, validationRules) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const validateField = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return [];
    
    return rule.validate ? rule.validate(value, name) : [];
  };
  
  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    if (touched[name]) {
      const fieldErrors = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: fieldErrors }));
    }
  };
  
  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldErrors = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: fieldErrors }));
  };
  
  const validateAll = () => {
    const allErrors = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach(name => {
      const fieldErrors = validateField(name, values[name]);
      if (fieldErrors.length > 0) {
        allErrors[name] = fieldErrors;
        isValid = false;
      }
    });
    
    setErrors(allErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return isValid;
  };
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    isValid: Object.keys(errors).every(key => errors[key].length === 0)
  };
};

// Input sanitization utilities
export const sanitizeInput = {
  // Remove potentially dangerous characters
  text: (input) => {
    if (!input) return '';
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/[<>]/g, ''); // Remove angle brackets
  },
  
  // Sanitize email
  email: (input) => {
    if (!input) return '';
    return input.toLowerCase().trim().replace(/[^\w@.-]/g, '');
  },
  
  // Sanitize phone number
  phone: (input) => {
    if (!input) return '';
    return input.replace(/\D/g, '').slice(0, 10);
  },
  
  // Sanitize name
  name: (input) => {
    if (!input) return '';
    return input
      .trim()
      .replace(/[^a-zA-Z\s'-]/g, '') // Only allow letters, spaces, hyphens, apostrophes
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .slice(0, 50); // Limit length
  }
};

// Security checks
export const securityChecks = {
  // Check for SQL injection patterns
  hasSQLInjection: (input) => {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /('|(\\')|(;)|(\\)|(\/\*)|(--)|(\*\/)|(\bOR\b)|(\bAND\b))/i
    ];
    return sqlPatterns.some(pattern => pattern.test(input));
  },
  
  // Check for XSS patterns
  hasXSS: (input) => {
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];
    return xssPatterns.some(pattern => pattern.test(input));
  },
  
  // Rate limiting check (client-side)
  checkRateLimit: (key, maxAttempts = 5, timeWindow = 300000) => { // 5 minutes
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
    
    // Remove old attempts outside time window
    const recentAttempts = attempts.filter(timestamp => now - timestamp < timeWindow);
    
    if (recentAttempts.length >= maxAttempts) {
      return {
        allowed: false,
        remainingTime: Math.ceil((recentAttempts[0] + timeWindow - now) / 1000)
      };
    }
    
    // Add current attempt
    recentAttempts.push(now);
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(recentAttempts));
    
    return { allowed: true, remainingTime: 0 };
  }
};

export default {
  ValidationRules,
  useFormValidation,
  sanitizeInput,
  securityChecks
};
