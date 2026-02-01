# Authentication Implementation

This document describes the authentication system implemented for the Station Gaming web application.

## Overview

The application now requires authentication via a 6-digit code before users can access the main content. The authentication token is stored in memory (not in browser storage) and is used as a Bearer token for all API requests.

## Components

### 1. AuthContext (`src/components/AuthContext.tsx`)
- Manages authentication state in memory
- Provides `token`, `setToken`, and `isAuthenticated` to child components
- Syncs token with the API utility when updated

### 2. LoginModal (`src/components/LoginModal.tsx`)
- Displays a modal dialog requesting a 6-digit access code
- Uses shadcn/ui InputOTP component for code entry
- Sends POST request to `http://127.0.0.1:3001/v0/code/login`
- Handles success (200) and failure (404) responses
- Cannot be dismissed until successful authentication

### 3. API Utility (`src/utils/api.ts`)
- Provides `authenticatedFetch()` function for making API calls
- Automatically adds `Authorization: Bearer {token}` header to requests
- Token is stored in module-level variable (memory only)

### 4. App Integration (`src/App.tsx`)
- Wrapped with `AuthProvider` at the root level
- Main content is blurred with `pointer-events-none` when not authenticated
- Products are loaded via authenticated API call after successful login
- Shows loading spinner while fetching products

## Authentication Flow

1. **Initial Load**: User sees blurred content and login modal
2. **Code Entry**: User enters 6-digit code in the modal
3. **Verification**: Code is sent to `/v0/code/login` endpoint
4. **Success**: Token is stored in memory, modal closes, blur removed
5. **Failure**: Input is cleared, error toast shown, user can retry
6. **API Calls**: All subsequent requests include Bearer token in Authorization header

## Security Features

- Token stored in memory only (not localStorage/sessionStorage)
- Token is lost on page refresh (requires re-authentication)
- Modal cannot be dismissed without valid authentication
- Main content is non-interactive while unauthenticated

## API Endpoints

### Login
- **URL**: `http://127.0.0.1:3001/v0/code/login`
- **Method**: POST
- **Body**: `{ "code": "123456" }`
- **Success Response (200)**: `{ "data": { "token": "eyJhbG..." } }`
- **Failure Response (404)**: Invalid code

### Products (Authenticated)
- **URL**: `http://localhost:3001/v0/product`
- **Method**: GET
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ "data": [...products] }`

## Usage

To use authenticated API calls in other components:

```typescript
import { authenticatedFetch } from '../utils/api';

// Make authenticated request
const response = await authenticatedFetch('http://localhost:3001/v0/endpoint');
const data = await response.json();
```

To check authentication status in components:

```typescript
import { useAuth } from './components/AuthContext';

function MyComponent() {
  const { isAuthenticated, token } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  // Component content
}
```
