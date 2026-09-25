/**
 * Centralized Request Input Validators
 * Validates, sanitizes, and normalizes input data for production safety.
 */

export function validateRegister(req, res, next) {
  const { name, mobile, email, password } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Valid full name (minimum 2 characters) is required.' });
  }

  const cleanMobile = String(mobile || '').replace(/^\+91/, '').replace(/[\s-]/g, '').trim();
  if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit Indian mobile number.' });
  }

  const cleanEmail = String(email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }

  req.body.name = name.trim();
  req.body.mobile = cleanMobile;
  req.body.email = cleanEmail;
  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }
  req.body.email = String(email).trim().toLowerCase();
  next();
}

export function validateProfileUpdate(req, res, next) {
  const { age, willing_to_relocate } = req.body;

  if (age !== undefined && age !== null) {
    const numAge = Number(age);
    if (isNaN(numAge) || numAge < 14 || numAge > 85) {
      return res.status(400).json({ success: false, message: 'Age must be a valid number between 14 and 85.' });
    }
    req.body.age = numAge;
  }

  if (willing_to_relocate !== undefined) {
    req.body.willing_to_relocate = Boolean(willing_to_relocate);
  }

  next();
}

export function validateAssistantMessage(req, res, next) {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message content is required.' });
  }
  if (message.length > 1000) {
    return res.status(400).json({ success: false, message: 'Message exceeds maximum length of 1000 characters.' });
  }
  next();
}

export default {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validateAssistantMessage
};
