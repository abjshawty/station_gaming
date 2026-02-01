# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Soul Gaming is a React-based e-commerce platform for video games built with Vite, TypeScript, and Tailwind CSS. The app features OTP authentication, a shopping cart system, and integrates with a REST API backend.

**Tech Stack:**
- React 18.3.1 + TypeScript
- Vite 6.3.5 with SWC compiler
- Tailwind CSS 4.1.3 for styling
- Radix UI components (46 UI components in `src/components/ui/`)
- Axios for API requests

## Development Commands

```bash
# Install dependencies
yarn install

# Start development server (runs on http://localhost:3000)
yarn dev

# Build for production (outputs to build/ directory)
yarn build

# Serve production build locally on port 8080
yarn start

# Deploy to GitHub Pages
yarn deploy
```

## Project Architecture

### State Management

The app uses React Context for global state:

1. **AuthContext** (`src/components/AuthContext.tsx`)
   - Manages authentication token (in-memory only, not persisted)
   - Syncs token with API client utility
   - Provides `isAuthenticated` status and `setToken()` method

2. **CartContext** (`src/components/CartContext.tsx`)
   - Shopping cart state (add, remove, update quantity, clear)
   - Cart totals and item count calculations
   - Not persisted (resets on page refresh)

**Context Provider Hierarchy:**
```tsx
<AuthProvider>
  <CartProvider>
    <AppContent />
  </CartProvider>
</AuthProvider>
```

### Authentication Flow

The app uses a 6-digit OTP authentication system:

1. User enters code in `LoginModal.tsx`
2. Code sent to `POST /v0/code/login`
3. Backend returns JWT token
4. Token stored in AuthContext (in-memory)
5. Token synced to `api.ts` module via `setAuthToken()`
6. All API requests use `authenticatedFetch()` which adds Bearer token header

**Important:** Tokens are stored in-memory only for security (module-level variable in `src/utils/api.ts`). Never use localStorage for tokens.

### API Integration

**Base URL Configuration:**
- Set via `VITE_API_BASE_URL` environment variable
- Defaults to `http://soul_backend.railway.internal/v0` if not set
- `/v0` suffix is added automatically in `api.ts`

**API Endpoints:**
- `POST /v0/code/login` - Authenticate with OTP code
- `GET /v0/product` - Fetch all products (requires auth)
- `POST /v0/order` - Submit order (requires auth, sends email confirmation)

**Full API Specification:** See `CONTRACTS.md` for complete interface contracts that the backend must implement.

**Making Authenticated Requests:**
Always use the `authenticatedFetch()` utility from `src/utils/api.ts` instead of plain `fetch()`:

```typescript
import { authenticatedFetch, API_BASE_URL } from './utils/api';

// Correct usage
authenticatedFetch(`${API_BASE_URL}/product`)
  .then(res => res.json())
  .then(data => console.log(data));

// Don't use plain fetch() for authenticated endpoints
```

### Component Structure

**Main Components** (in `src/components/`):
- `App.tsx` - Root component with product loading and filtering logic
- `Header.tsx` - Navigation with search and cart button
- `Hero.tsx` - Auto-rotating hero section (6-second intervals)
- `ProductScroll.tsx` - Horizontal product carousel using Embla
- `SearchFilter.tsx` - Search and filter UI (genres + price ranges)
- `LoginModal.tsx` - OTP authentication modal
- `ProductDetailModal.tsx` - Product details view
- `ShoppingCartSheet.tsx` - Slide-out cart with checkout

**UI Components** (`src/components/ui/`):
- 46 reusable Radix UI-based components
- All use `class-variance-authority` for variants
- Styled with Tailwind utility classes

**Figma Components** (`src/components/figma/`):
- Design system components from original Figma file

### Product Filtering

Products are filtered in `App.tsx` using a `useMemo` hook:

1. **Search Filter**: Matches against `title` or `genre` (case-insensitive)
2. **Genre Filter**: Multiple selection (RPG, Action, Racing, Puzzle, Fighting, Adventure, Arcade, Platformer, Shooter, Strategy)
3. **Price Range Filter**: Single selection (under €15, €15-€30, €30-€50, over €50)

Products are categorized as Standard, Premium, or Deluxe and displayed in separate carousels.

### Styling & Theming

**Theme System:**
- Deep blue gaming theme defined in `src/styles/globals.css`
- Uses Tailwind CSS v4 with `@theme` directive
- All color variables are defined as custom properties

**Key Colors:**
- Primary: `#0052A3` (brand blue)
- Secondary: `#003d7a` (darker blue for hovers)
- Background: `#001a3d` (deep blue page background)
- Card: `#003366` (card backgrounds)
- Destructive: `#f44336` (error states)

**When modifying theme:**
1. Edit CSS variables in `src/styles/globals.css` under `@theme` block
2. Reference additional theme documentation: `COLOR_THEME_REDESIGN.md`, `THEME_TROUBLESHOOTING.md`

### Path Aliases

Vite is configured with `@/` alias pointing to `src/`:

```typescript
// Use this
import { Button } from '@/components/ui/button';

// Instead of this
import { Button } from '../../../components/ui/button';
```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Set `VITE_API_BASE_URL` to your backend URL (without `/v0` suffix)
3. Backend must be running for authentication and product loading

**Example `.env`:**
```env
VITE_API_BASE_URL=http://localhost:3001
```

## Deployment

The app is configured for GitHub Pages deployment:

- Build output goes to `build/` directory
- `yarn deploy` runs `yarn build` then deploys via `gh-pages` package
- Deployed URL: `https://abjshawty.github.io/station_gaming`

## Additional Documentation

- `CONTRACTS.md` - **API interface contracts (critical for backend integration)**
- `AUTHENTICATION.md` - Detailed auth system documentation
- `AUTH_DEBUG_GUIDE.md` - Debugging authentication issues
- `TESTING_AUTH.md` - Testing authentication flows
- `COLOR_THEME_REDESIGN.md` - Theme customization guide
- `CSS_VARIABLES_REFACTOR.md` - CSS variable reference
- `THEME_TROUBLESHOOTING.md` - Theme debugging tips
- `README.md` - Full project documentation

## Architecture Notes

**Product Loading Flow:**
1. App renders with `isAuthenticated = false`
2. `LoginModal` is shown (blocking main content with blur)
3. User authenticates via OTP
4. Token stored in AuthContext
5. `useEffect` in `App.tsx` detects `isAuthenticated = true`
6. Products fetched via `authenticatedFetch()`
7. Products stored in local state and categorized

**Cart & Checkout Behavior:**
- Items added via `addToCart()` from CartContext
- Quantities updated via `updateQuantity()`
- Checkout requires only customer name and email
- No payment processing on frontend - backend handles order fulfillment
- Order confirmation sent via email by backend
- Cart cleared on successful checkout
- Cart state is NOT persisted (intentional)

**Hero Auto-Rotation:**
The hero section rotates backgrounds every 6 seconds using a `setInterval` in a `useEffect` hook.
