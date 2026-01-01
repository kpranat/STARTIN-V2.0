# JWT Token Handling - Usage Guide

## Overview
Your frontend is now fully configured to handle JWT tokens from your Flask backend. The implementation includes:

1. **Token Storage**: Secure localStorage management
2. **Auto-token Attachment**: Axios interceptors automatically add tokens to requests
3. **Token Expiration**: Automatic detection and redirect on expired tokens
4. **Protected Routes**: Route guards for authenticated-only pages
5. **Global Auth State**: React Context for app-wide authentication state

---

## 🔧 What Was Implemented

### 1. Authentication Utilities (`utils/auth.ts`)
- `setToken(token)` - Store JWT token
- `getToken()` - Retrieve stored token
- `removeToken()` - Clear token (logout)
- `isAuthenticated()` - Check if user is logged in
- `parseJwt(token)` - Decode JWT payload
- `getUserEmail()` - Get email from token

### 2. Auth Context (`context/AuthContext.tsx`)
Global authentication state management:
```tsx
const { isAuthenticated, userEmail, userData, login, logout, loading } = useAuth();
```

### 3. API Service (`services/api.ts`)
- **Axios Interceptors**: Automatically attach JWT to all protected API calls
- **Error Handling**: Redirects to login on 401 (unauthorized)
- **Protected Endpoints**: Pre-configured API methods for student/company routes

### 4. Protected Routes (`components/ProtectedRoute.tsx`)
Wraps routes that require authentication

---

## 📝 How to Use

### A. In Login/Signup Pages

When user successfully logs in or verifies OTP:

```tsx
import { useAuth } from '../context/AuthContext';

function StudentLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await connectToBackend('student_login', { email, password });
      
      if (response.token) {
        // Store token and update auth state
        login(response.token, { email: response.email, name: response.name });
        
        // Redirect to protected route
        navigate('/student/home');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
}
```

### B. In Protected Components

Access user information:

```tsx
import { useAuth } from '../context/AuthContext';

function StudentProfile() {
  const { userEmail, userData, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/student/login');
  };

  return (
    <div>
      <h1>Welcome, {userEmail}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

### C. Making Protected API Calls

Use the `api` object for authenticated requests:

```tsx
import { api } from '../services/api';

// Get student profile (JWT automatically attached)
const fetchProfile = async () => {
  try {
    const response = await api.student.getProfile();
    console.log(response.data);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
};

// Apply to a job
const applyToJob = async (jobId) => {
  try {
    await api.student.applyJob(jobId);
    alert('Application submitted!');
  } catch (error) {
    console.error('Failed to apply:', error);
  }
};
```

### D. Adding Custom Protected Endpoints

Add new endpoints to `services/api.ts`:

```tsx
export const api = {
  student: {
    // Existing endpoints...
    getProfile: () => apiClient.get('/student/profile'),
    
    // Add your new endpoints here
    updateResume: (resumeData) => apiClient.post('/student/resume', resumeData),
    getRecommendations: () => apiClient.get('/student/recommendations'),
  },
};
```

---

## 🛡️ Backend Requirements

Your Flask backend should:

### 1. Return JWT on successful authentication:
```python
@StudentSignup_bp.route("/auth/VerifyOTP", methods=['POST'])
def VerifyOTP():
    # ... verification logic ...
    
    token = jwt.encode(
        {
            "email": email,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=60)
        },
        current_app.config["JWT_SECRET"],
        algorithm="HS256"
    )
    
    return jsonify({"message": "OTP verified", "token": token})
```

### 2. Verify JWT on protected routes:
```python
from functools import wraps
import jwt

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token or not token.startswith('Bearer '):
            return jsonify({"error": "Token is missing"}), 401
            
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(
                token, 
                current_app.config["JWT_SECRET"],
                algorithms=["HS256"]
            )
            current_user_email = data['email']
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
            
        return f(current_user_email, *args, **kwargs)
        
    return decorated

# Use it on protected routes:
@student_bp.route("/student/profile", methods=['GET'])
@token_required
def get_profile(current_user_email):
    # current_user_email is automatically passed
    # Fetch and return user profile
    pass
```

---

## 🔍 Testing the Integration

1. **Test Signup Flow**:
   - Sign up → Receive OTP → Verify OTP
   - Check browser console for token storage
   - Verify redirect to `/student/home`

2. **Test Protected Routes**:
   - Try accessing `/student/home` without logging in
   - Should redirect to `/student/login`

3. **Test Token Attachment**:
   - Open browser DevTools → Network tab
   - Make any API call using `api.student.*`
   - Check request headers for: `Authorization: Bearer <token>`

4. **Test Token Expiration**:
   - Wait for token to expire (based on backend JWT_EXP_MINUTES)
   - Try making a protected API call
   - Should auto-redirect to login

---

## 🎯 Next Steps

1. **Update StudentLogin.tsx** similarly to StudentSignup (handle JWT on login)
2. **Update CompanyLogin.tsx and CompanySignup.tsx** with same pattern
3. **Create backend decorator** for protected routes (`@token_required`)
4. **Add logout buttons** in navbars using `logout()` from useAuth
5. **Add user profile endpoints** in backend and call them using `api.student.*`

---

## 📦 Key Files Modified

- ✅ [frontend/src/utils/auth.ts](frontend/src/utils/auth.ts) - Token management utilities
- ✅ [frontend/src/context/AuthContext.tsx](frontend/src/context/AuthContext.tsx) - Global auth state
- ✅ [frontend/src/services/api.ts](frontend/src/services/api.ts) - API client with interceptors
- ✅ [frontend/src/components/ProtectedRoute.tsx](frontend/src/components/ProtectedRoute.tsx) - Route protection
- ✅ [frontend/src/App.tsx](frontend/src/App.tsx) - Wrapped with AuthProvider
- ✅ [frontend/src/pages/StudentSignup.tsx](frontend/src/pages/StudentSignup.tsx) - Example JWT handling

---

## 🐛 Troubleshooting

**Token not being sent?**
- Check browser console for errors
- Verify `getToken()` returns a value
- Check Network tab for Authorization header

**Always redirecting to login?**
- Check token expiration time in backend
- Verify token format in localStorage
- Check backend JWT_SECRET matches

**401 Errors on protected routes?**
- Verify backend is checking for `Bearer <token>` format
- Check backend JWT_SECRET configuration
- Ensure backend route has `@token_required` decorator

---

✨ Your frontend is now ready to handle JWT tokens from your Flask backend!
