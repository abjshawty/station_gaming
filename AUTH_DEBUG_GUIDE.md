# Authentication Debugging Guide

## Issue Fixed: 401 Unauthorized on POST /order

### Root Cause
The `ShoppingCartSheet` component was using `axios.post()` directly instead of the `authenticatedFetch()` utility function, which meant the Bearer token was not being included in the request headers.

### Solution Applied

#### 1. **ShoppingCartSheet.tsx** - Fixed Order Submission
**Before:**
```typescript
import axios from 'axios';

await axios.post('http://localhost:3001/v0/order', data);
```

**After:**
```typescript
import { authenticatedFetch } from '../utils/api';

const response = await authenticatedFetch('http://localhost:3001/v0/order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});
```

#### 2. **api.ts** - Added Comprehensive Debug Logging

**Token Storage Logging:**
```typescript
export function setAuthToken (token: string | null) {
  authToken = token;
  if (token) {
    console.log('✅ [Auth Debug] Token stored in memory:', {
      tokenPreview: `${token.substring(0, 20)}...`,
      tokenLength: token.length,
    });
  } else {
    console.log('🔓 [Auth Debug] Token cleared from memory');
  }
}
```

**Request Logging:**
```typescript
export async function authenticatedFetch (url: string, options: RequestInit = {}) {
  // ... header setup ...
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
    console.log('🔐 [Auth Debug] Token added to request:', {
      url,
      method: options.method || 'GET',
      tokenPreview: `${authToken.substring(0, 20)}...`,
      hasAuthHeader: !!headers['Authorization'],
    });
  } else {
    console.warn('⚠️ [Auth Debug] No token available for request:', {
      url,
      method: options.method || 'GET',
    });
  }
  
  console.log('📤 [Auth Debug] Request headers:', headers);
  
  return fetch(url, { ...options, headers });
}
```

#### 3. **ShoppingCartSheet.tsx** - Enhanced Error Handling

Added comprehensive try-catch with detailed logging:

```typescript
try {
  console.log('🛒 [Order Debug] Submitting order:', data);
  
  const response = await authenticatedFetch('http://localhost:3001/v0/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  console.log('📥 [Order Debug] Response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ [Order Debug] Order failed:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
    });
    
    if (response.status === 401) {
      toast.error('Authentication failed. Please log in again.');
    } else {
      toast.error(`Order failed: ${response.status} ${response.statusText}`);
    }
    return;
  }
  
  const result = await response.json();
  console.log('✅ [Order Debug] Order successful:', result);
  
  // Success handling...
} catch (error) {
  console.error('💥 [Order Debug] Exception during order submission:', error);
  toast.error('Failed to submit order. Please try again.');
}
```

## Debug Console Output

When the application runs correctly, you should see this sequence in the browser console:

### 1. Login Flow
```
✅ [Auth Debug] Token stored in memory: {
  tokenPreview: "eyJhbGciOiJIUzI1NiIsIn...",
  tokenLength: 147
}
```

### 2. Product Load (GET /v0/product)
```
🔐 [Auth Debug] Token added to request: {
  url: "http://localhost:3001/v0/product",
  method: "GET",
  tokenPreview: "eyJhbGciOiJIUzI1NiIsIn...",
  hasAuthHeader: true
}
📤 [Auth Debug] Request headers: {
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsIn..."
}
```

### 3. Order Submission (POST /v0/order)
```
🛒 [Order Debug] Submitting order: {
  name: "John Doe",
  email: "john@example.com",
  ...
}
🔐 [Auth Debug] Token added to request: {
  url: "http://localhost:3001/v0/order",
  method: "POST",
  tokenPreview: "eyJhbGciOiJIUzI1NiIsIn...",
  hasAuthHeader: true
}
📤 [Auth Debug] Request headers: {
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsIn...",
  Content-Type: "application/json"
}
📥 [Order Debug] Response status: 200
✅ [Order Debug] Order successful: { ... }
```

## Troubleshooting

### If you still see 401 errors:

#### Check 1: Token Storage
Look for the token storage log after login:
```
✅ [Auth Debug] Token stored in memory
```
If you see `🔓 Token cleared from memory` instead, the token is not being saved.

#### Check 2: Token in Request
Look for the token being added to requests:
```
🔐 [Auth Debug] Token added to request
```
If you see `⚠️ No token available for request`, the token was cleared or never set.

#### Check 3: Request Headers
Verify the Authorization header is present:
```
📤 [Auth Debug] Request headers: {
  Authorization: "Bearer ..."
}
```

#### Check 4: Response Status
Check the response status code:
```
📥 [Order Debug] Response status: 401
```
If 401, the token might be invalid or expired.

### Common Issues

**Issue: Token cleared after page refresh**
- **Expected Behavior**: Token is stored in memory only and will be lost on refresh
- **Solution**: This is by design. Users must log in again after refresh.

**Issue: Token not added to specific requests**
- **Check**: Ensure you're using `authenticatedFetch()` and not `fetch()` or `axios()` directly
- **Fix**: Replace direct fetch/axios calls with `authenticatedFetch()`

**Issue: 401 on some endpoints but not others**
- **Check**: Verify all API calls use `authenticatedFetch()`
- **Common culprit**: Direct axios/fetch calls in components

## Testing Checklist

- [ ] Login with valid code → See token storage log
- [ ] Load products → See token added to GET /v0/product
- [ ] Add items to cart → Cart updates successfully
- [ ] Submit order → See token added to POST /v0/order
- [ ] Check console → No 401 errors
- [ ] Check console → All requests show Authorization header
- [ ] Verify order success → See success toast message

## Files Modified

1. **src/utils/api.ts**
   - Added debug logging to `setAuthToken()`
   - Added debug logging to `authenticatedFetch()`
   - Logs token storage, request details, and headers

2. **src/components/ShoppingCartSheet.tsx**
   - Replaced `axios.post()` with `authenticatedFetch()`
   - Added comprehensive error handling
   - Added debug logging for order submission
   - Added specific 401 error handling

## Expected Behavior

✅ **All requests to `http://localhost:3001/*` include:** `Authorization: Bearer {token}`  
✅ **POST /order endpoint receives authentication token**  
✅ **No 401 errors when valid token exists**  
✅ **Detailed console logs for debugging**  
✅ **User-friendly error messages via toast notifications**  

## Removing Debug Logs (Production)

When ready for production, remove or comment out the console.log statements in:
- `src/utils/api.ts` (lines 10-16, 23-37)
- `src/components/ShoppingCartSheet.tsx` (lines 46, 57, 61-65, 76, 97)

Or use a conditional based on environment:
```typescript
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Debug info...');
}
```
