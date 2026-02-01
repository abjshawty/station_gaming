# Testing the Authentication System

## Prerequisites

1. Ensure the backend API server is running on `http://127.0.0.1:3001`
2. The server should have the `/v0/code/login` endpoint available
3. You need a valid 6-digit authentication code

## Testing Steps

### 1. Initial Load Test
- Start the development server: `npm run dev`
- Open the application in your browser
- **Expected**: 
  - Main content should be blurred
  - Login modal should be visible and centered
  - Modal should display "Authentication Required" title
  - 6-digit input field should be visible

### 2. Invalid Code Test
- Enter an invalid 6-digit code (e.g., `000000`)
- Click "Submit Code" or press Enter
- **Expected**:
  - Loading spinner should appear briefly
  - Error toast: "Invalid code. Please try again."
  - Input field should be cleared
  - Modal should remain open
  - Content should remain blurred

### 3. Valid Code Test
- Enter a valid 6-digit code
- Click "Submit Code" or press Enter
- **Expected**:
  - Loading spinner should appear
  - Success toast: "Authentication successful!"
  - Modal should close
  - Blur effect should be removed
  - Loading spinner should appear: "Loading products..."
  - Products should load and display

### 4. Authenticated API Call Test
- After successful login, open browser DevTools (F12)
- Go to Network tab
- Refresh the page (you'll need to log in again)
- After logging in, check the request to `/v0/product`
- **Expected**:
  - Request should include header: `Authorization: Bearer {token}`
  - Products should load successfully

### 5. Modal Interaction Test
- Before logging in, try to:
  - Click outside the modal
  - Press Escape key
- **Expected**:
  - Modal should NOT close
  - Content should remain blurred and non-interactive

### 6. Page Refresh Test
- After successful login and products loaded
- Refresh the page (F5)
- **Expected**:
  - Token is lost (stored in memory only)
  - Login modal should appear again
  - Content should be blurred again
  - User must re-authenticate

## Troubleshooting

### Modal doesn't appear
- Check browser console for errors
- Verify `LoginModal` component is imported correctly
- Check that `AuthProvider` wraps the app

### API calls fail
- Verify backend server is running on correct port
- Check CORS settings on backend
- Verify token is being sent in Authorization header

### Products don't load after login
- Check browser console for errors
- Verify `/v0/product` endpoint is accessible
- Check that token is valid and not expired

### Blur effect doesn't work
- Check CSS classes are applied correctly
- Verify Tailwind CSS is configured properly
- Check browser DevTools for CSS conflicts

## Test Credentials

Contact your backend administrator for valid 6-digit test codes.

## Expected API Behavior

### Login Endpoint
```bash
# Request
curl -X POST http://127.0.0.1:3001/v0/code/login \
  -H "Content-Type: application/json" \
  -d '{"code":"123456"}'

# Success Response (200)
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

# Failure Response (404)
# Empty or error message
```

### Products Endpoint
```bash
# Request
curl http://localhost:3001/v0/product \
  -H "Authorization: Bearer {your_token}"

# Response
{
  "data": [
    {
      "id": 1,
      "title": "Game Title",
      "price": 29.99,
      "category": "Standard",
      ...
    }
  ]
}
```
