import emailjs from '@emailjs/browser';

// EmailJS Configuration
// These values are loaded from environment variables (.env file)
// You can get these credentials from https://www.emailjs.com/
export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
};

/**
 * Initialize EmailJS with public key
 * Call this once when the app starts
 */
export const initEmailJS = () => {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
};

/**
 * Send OTP email using EmailJS
 * @param toEmail - Recipient email address
 * @param otp - OTP code to send
 * @param userName - Optional user name for personalization
 * @returns Promise that resolves when email is sent
 */
export const sendOTPEmail = async (
  toEmail: string,
  otp: string,
  userName?: string
): Promise<void> => {
  try {
    // Calculate expiry time (15 minutes from now)
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
    const formattedTime = expiryTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    const templateParams = {
      to_email: toEmail,
      to_name: userName || 'User',
      passcode: otp,  // Changed from otp_code to passcode to match template
      time: formattedTime,  // Changed from validity to time to match template
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send OTP email. Please try again.');
  }
};

/**
 * Send OTP email for student signup
 * @param email - Student email
 * @param otp - OTP code
 * @param name - Student name
 */
export const sendStudentOTPEmail = async (
  email: string,
  otp: string,
  name?: string
): Promise<void> => {
  return sendOTPEmail(email, otp, name);
};

/**
 * Send OTP email for company signup
 * @param email - Company email
 * @param otp - OTP code
 */
export const sendCompanyOTPEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  return sendOTPEmail(email, otp, 'Company Representative');
};
