/**
 * Validation utilities for form inputs
 */
import React from 'react';

export const validators = {
  // Email validation
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email is required';
    if (!emailRegex.test(value)) return 'Invalid email format';
    return null;
  },

  // Username validation
  username: (value) => {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (value.length > 20) return 'Username must be less than 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
    return null;
  },

  // Password validation
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (value.length > 100) return 'Password is too long';
    return null;
  },

  // Strong password validation
  strongPassword: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
    return null;
  },

  // Generic required field
  required: (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  // Number range validation
  numberRange: (value, min, max, fieldName = 'Value') => {
    const num = Number(value);
    if (isNaN(num)) return `${fieldName} must be a number`;
    if (num < min) return `${fieldName} must be at least ${min}`;
    if (num > max) return `${fieldName} must be at most ${max}`;
    return null;
  },

  // Age validation
  age: (value) => {
    return validators.numberRange(value, 1, 120, 'Age');
  },

  // BMI validation
  bmi: (value) => {
    return validators.numberRange(value, 10, 60, 'BMI');
  },

  // Blood pressure validation
  bloodPressure: (value) => {
    return validators.numberRange(value, 80, 200, 'Blood Pressure');
  },

  // Cholesterol validation
  cholesterol: (value) => {
    return validators.numberRange(value, 100, 600, 'Cholesterol');
  },

  // Glucose level validation
  glucose: (value) => {
    return validators.numberRange(value, 50, 300, 'Glucose Level');
  },

  // Phone validation (simple)
  phone: (value) => {
    if (!value) return null; // Optional field
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(value)) return 'Invalid phone number format';
    const digits = value.replace(/\D/g, '');
    if (digits.length < 10) return 'Phone number must be at least 10 digits';
    return null;
  },
};

/**
 * Validate multiple fields at once
 * @param {Object} data - Object with field values
 * @param {Object} rules - Object with validation rules
 * @returns {Object} - Object with errors (empty if valid)
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = data[field];
    
    if (typeof rule === 'function') {
      const error = rule(value);
      if (error) errors[field] = error;
    } else if (Array.isArray(rule)) {
      // Multiple validators for one field
      for (const validator of rule) {
        const error = validator(value);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    }
  });
  
  return errors;
};

/**
 * Check if there are any errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Real-time field validation
 */
export const useFieldValidation = (initialValues, validationRules) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const validateField = (name, value) => {
    if (validationRules[name]) {
      const rule = validationRules[name];
      const error = typeof rule === 'function' ? rule(value) : null;
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleChange = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, values[name]);
  };

  const validateAll = () => {
    const allErrors = validateForm(values, validationRules);
    setErrors(allErrors);
    return !hasErrors(allErrors);
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    setValues,
  };
};
