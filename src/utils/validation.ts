export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  // Accepts digits, spaces, +, -, parentheses; requires at least 8 digits total
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly.length >= 8;
}

interface RegisterFormValues {
  name: string;
  identifier: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormErrors {
  name?: string;
  identifier?: string;
  password?: string;
  confirmPassword?: string;
}

export function validateRegisterForm(values: RegisterFormValues): RegisterFormErrors {
  const errors: RegisterFormErrors = {};
  const identifier = values.identifier.trim();

  if (!values.name.trim()) {
    errors.name = 'Please enter your name.';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!identifier) {
    errors.identifier = 'Please enter your email or phone number.';
  } else if (identifier.includes('@')) {
    if (!isValidEmail(identifier)) {
      errors.identifier = 'Please enter a valid email address.';
    }
  } else if (!isValidPhone(identifier)) {
    errors.identifier = 'Please enter a valid phone number.';
  }

  if (!values.password) {
    errors.password = 'Please enter a password.';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

interface ForgotPasswordErrors {
  email?: string;
}

export function validateForgotPasswordForm(email: string): ForgotPasswordErrors {
  const errors: ForgotPasswordErrors = {};
  const trimmed = email.trim();

  if (!trimmed) {
    errors.email = 'Please enter your email address.';
  } else if (!isValidEmail(trimmed)) {
    errors.email = 'Please enter a valid email address.';
  }

  return errors;
}

interface ResetPasswordValues {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordErrors {
  password?: string;
  confirmPassword?: string;
}

export function validateResetPasswordForm(values: ResetPasswordValues): ResetPasswordErrors {
  const errors: ResetPasswordErrors = {};

  if (!values.password) {
    errors.password = 'Please enter a new password.';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your new password.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}
