# 🎮 Soul Gaming - Online Video Game Store

A modern, responsive e-commerce platform for video games built with React, TypeScript, and Tailwind CSS. Features a sleek deep blue gaming theme, OTP authentication, and a smooth shopping experience.

> **Original Design:** Based on the [Online Video Game Store Figma design](https://www.figma.com/design/6hmWQzbAA9ftbdQUELTCJd/Online-Video-Game-Store)

## ✨ Features

### 🛒 E-Commerce Functionality
- **Product Catalog**: Browse games across three categories (Standard, Premium, Deluxe)
- **Shopping Cart**: Add/remove items, adjust quantities, and calculate totals
- **Checkout System**: Multiple payment methods (Credit/Debit Card, Wave, Orange Money)
- **Product Details**: Full product information with ratings, pricing, and descriptions

### 🔍 Search & Filtering
- **Real-time Search**: Filter games by title or genre
- **Genre Filter**: 10 game genres (RPG, Action, Racing, Puzzle, Fighting, Adventure, Arcade, Platformer, Shooter, Strategy)
- **Price Range Filter**: 4 price ranges (Under €15, €15-€30, €30-€50, Over €50)

### 🔐 Authentication
- **6-Digit OTP System**: Secure authentication with one-time passwords
- **Protected API Requests**: Bearer token authorization for all API calls
- **Session Management**: In-memory token storage for security

### 🎨 User Experience
- **Auto-Rotating Hero**: Smooth background transitions every 6 seconds
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Toast Notifications**: Real-time feedback for user actions
- **Smooth Animations**: Polished transitions and hover effects
- **Accessible UI**: WCAG-compliant components with keyboard navigation

## 🚀 Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript** - Type-safe development
- **Vite 6.3.5** - Lightning-fast build tool
- **Tailwind CSS 4.1.3** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Efficient form management
- **Axios** - HTTP client for API requests

### UI Components
- **Lucide React** - Modern icon library
- **Embla Carousel** - Touch-friendly carousels
- **Sonner** - Toast notifications
- **Next Themes** - Dark mode support
- **Input OTP** - OTP input component
- **Class Variance Authority** - Component variants

### Build & Deploy
- **SWC** - Super-fast TypeScript/JavaScript compiler
- **GitHub Pages** - Static site hosting
- **gh-pages** - Automated deployment

## 📋 Prerequisites

- **Node.js** 16.x or higher
- **Yarn** 1.22.x or higher (package manager)
- Access to the backend API

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abjshawty/station_gaming.git
   cd station_gaming
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your API base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:3001
   ```

## 🏃 Running the Project

### Development Server
```bash
yarn dev
```
The app will be available at `http://localhost:3000`

### Production Build
```bash
yarn build
```
Outputs optimized files to the `build/` directory

### Preview Production Build
```bash
yarn start
```
Serves the production build locally on port 8080

### Deploy to GitHub Pages
```bash
yarn deploy
```
Builds and deploys to the `gh-pages` branch

## 📁 Project Structure

```
station_gaming/
├── src/
│   ├── components/              # React components
│   │   ├── ui/                 # Reusable UI components (50+)
│   │   ├── figma/              # Figma-specific components
│   │   ├── AuthContext.tsx     # Authentication state
│   │   ├── CartContext.tsx     # Shopping cart state
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Hero.tsx            # Hero section with rotating backgrounds
│   │   ├── Footer.tsx          # Footer section
│   │   ├── LoginModal.tsx      # OTP authentication modal
│   │   ├── ProductScroll.tsx   # Product carousel
│   │   ├── ProductDetailModal.tsx  # Product details
│   │   ├── ShoppingCartSheet.tsx   # Cart & checkout
│   │   └── SearchFilter.tsx    # Search & filter UI
│   ├── styles/
│   │   ├── globals.css         # Global styles & theme variables
│   │   └── index.css           # Tailwind utilities
│   ├── utils/
│   │   └── api.ts              # Authenticated API client
│   ├── App.tsx                 # Main application component
│   └── main.tsx                # React entry point
├── index.html                   # HTML template
├── vite.config.ts              # Vite configuration
├── package.json                # Dependencies & scripts
├── yarn.lock                   # Dependency lock file
└── .env.example                # Environment template
```

## 🔧 Environment Configuration

Create a `.env` file in the root directory:

```env
# API Base URL (required)
VITE_API_BASE_URL=http://localhost:3001

# Alternative for production
# VITE_API_BASE_URL=http://soul_backend.railway.internal
```

## 🌐 API Integration

### Backend Endpoints

The application communicates with a RESTful API:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v0/code/login` | POST | Authenticate with 6-digit code |
| `/v0/product` | GET | Fetch all products |
| `/v0/order` | POST | Submit checkout order |

### Authentication Flow

1. User enters 6-digit OTP code
2. App sends code to `/v0/code/login`
3. Backend returns JWT token
4. Token stored in React Context (in-memory)
5. All subsequent API calls include `Authorization: Bearer {token}`

### API Client

The `authenticatedFetch()` utility in `src/utils/api.ts` handles:
- Automatic token injection
- Bearer token authorization
- Debug logging
- Error handling

## 🎨 Theming & Styling

### Color Scheme

The app uses a **deep blue gaming theme**:

```css
--primary: #0052A3      /* Main brand color */
--secondary: #003d7a    /* Hover states */
--background: #001a3d   /* Page background */
--card: #003366         /* Card backgrounds */
--foreground: #ffffff   /* Text color */
--muted: #002952        /* Inactive elements */
--border: rgba(255, 255, 255, 0.12)  /* Dividers */
--destructive: #f44336  /* Error/delete actions */
```

### Customizing Theme

Edit CSS variables in `src/styles/globals.css`:

```css
@theme {
  --color-primary: #0052A3;
  --color-secondary: #003d7a;
  /* ... more variables */
}
```

### Dark Mode Support

The app uses `next-themes` for theme management. Dark mode variants are defined in the `.dark` selector.

## 🧩 State Management

### Context Providers

**AuthContext** (`AuthContext.tsx`)
- Manages authentication token
- Provides `isAuthenticated` status
- Syncs token with API client

**CartContext** (`CartContext.tsx`)
- Shopping cart state (add, remove, update quantity)
- Cart totals and item count
- Session-based (not persisted)

### Component State

Local state managed with React hooks for:
- Product filtering
- Search queries
- Modal visibility
- Loading states

## 🏗️ Build Configuration

### Vite Settings

Key configurations in `vite.config.ts`:

```typescript
{
  plugins: [react({ plugins: [['@swc/plugin-react']] })],
  base: '/',
  build: { outDir: 'build' },
  server: { port: 3000, host: '0.0.0.0' },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}
```

### Path Aliases

Use `@/` prefix for cleaner imports:

```typescript
// Instead of: import { Button } from '../../../components/ui/button'
import { Button } from '@/components/ui/button'
```

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server (port 3000) |
| `yarn build` | Build for production |
| `yarn start` | Serve production build (port 8080) |
| `yarn deploy` | Deploy to GitHub Pages |
| `yarn lint` | Run ESLint (if configured) |

## 🚢 Deployment

### GitHub Pages

The app is configured for GitHub Pages deployment:

1. **Build the project:**
   ```bash
   yarn build
   ```

2. **Deploy:**
   ```bash
   yarn deploy
   ```

3. **Access your site:**
   ```
   https://<username>.github.io/station_gaming
   ```

### Custom Domain

To use a custom domain:
1. Add a `CNAME` file to the `public/` directory
2. Configure DNS settings with your domain provider
3. Update the `base` path in `vite.config.ts` if needed

## 🔐 Security Considerations

- **Token Storage**: Tokens stored in-memory only (not localStorage)
- **CORS**: Backend handles CORS configuration
- **Input Validation**: Client-side validation for forms
- **Debug Logging**: Should be disabled in production builds

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 🌍 Internationalization

The app currently supports:
- **Language**: Partially French localized
- **Currency**: Euro (€)

### Adding More Languages

To add additional languages:
1. Install i18n library (e.g., `react-i18next`)
2. Extract text strings to translation files
3. Configure language switching

## 🐛 Troubleshooting

### Common Issues

**"Invalid code" error during login**
- Verify your 6-digit OTP code is correct
- Check that the backend API is running
- Confirm `VITE_API_BASE_URL` is set correctly

**Products not loading**
- Ensure you're authenticated first
- Check browser console for API errors
- Verify backend is accessible

**Cart not persisting**
- Cart state is session-based and will clear on refresh
- Implement persistence using localStorage if needed

**Build errors**
- Clear node_modules: `rm -rf node_modules && yarn install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Ensure Node.js version is 16+

## 📚 Documentation

Additional documentation available:
- `AUTHENTICATION.md` - Authentication system details
- `AUTH_DEBUG_GUIDE.md` - Debugging authentication issues
- `COLOR_THEME_REDESIGN.md` - Theme customization guide
- `CSS_VARIABLES_REFACTOR.md` - CSS variable documentation
- `THEME_TROUBLESHOOTING.md` - Theme debugging
- `TESTING_AUTH.md` - Authentication testing guide

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Use functional components with hooks
- Write descriptive commit messages

## 📄 License

This project is based on the Figma design "Online Video Game Store" and is available for educational purposes.

## 🙏 Acknowledgments

- Original design by [Figma Community](https://www.figma.com/design/6hmWQzbAA9ftbdQUELTCJd/Online-Video-Game-Store)
- Built with [Radix UI](https://www.radix-ui.com/) primitives
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation in the repo
- Review API documentation (if available)

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
