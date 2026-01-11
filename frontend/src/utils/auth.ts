// Token management utilities

const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_data';
const COMPANY_ID_KEY = 'company_id';
const STUDENT_ID_KEY = 'student_id';

/**
 * Store JWT token in sessionStorage (clears on tab close)
 * Better for short-lived tokens (10 min expiry)
 */
export const setToken = (token: string): void => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get JWT token from sessionStorage
 */
export const getToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY);
};

/**
 * Remove JWT token from sessionStorage
 */
export const removeToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(COMPANY_ID_KEY);
  sessionStorage.removeItem(STUDENT_ID_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  // Check if token is expired
  try {
    const payload = parseJwt(token);
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      removeToken();
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

/**
 * Parse JWT token to get payload
 */
export const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

/**
 * Get user email from token
 */
export const getUserEmail = (): string | null => {
  const token = getToken();
  if (!token) return null;
  
  const payload = parseJwt(token);
  return payload?.email || null;
};

/**
 * Store user data in sessionStorage
 */
export const setUserData = (data: any): void => {
  sessionStorage.setItem(USER_KEY, JSON.stringify(data));
};

/**
 * Get user data from sessionStorage
 */
export const getUserData = (): any => {
  const data = sessionStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

/**
 * Store company ID in sessionStorage
 */
export const setCompanyId = (companyId: string | number): void => {
  sessionStorage.setItem(COMPANY_ID_KEY, companyId.toString());
};

/**
 * Get company ID from sessionStorage
 */
export const getCompanyId = (): string | null => {
  return sessionStorage.getItem(COMPANY_ID_KEY);
};

/**
 * Store student ID in sessionStorage
 */
export const setStudentId = (studentId: string | number): void => {
  sessionStorage.setItem(STUDENT_ID_KEY, studentId.toString());
};

/**
 * Get student ID from sessionStorage
 */
export const getStudentId = (): string | null => {
  return sessionStorage.getItem(STUDENT_ID_KEY);
};