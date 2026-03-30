# Quick Start - Orange Bank Frontend

Get the app running in 2 minutes ⚡

## Prerequisites
- Node.js 16 or higher
- Backend API running on `http://localhost:8000`

## 1. Install & Configure

```bash
# Navigate to frontend
cd Frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update API URL if needed
# .env: VITE_API_BASE_URL=http://localhost:8000/api
```

## 2. Start Development

```bash
npm run dev
```

Browser opens to `http://localhost:5173` automatically ✨

## 3. Test the App

**Demo Credentials** (from your backend):
- Email: `test@orangebank.com`
- Password: `password123`

Admin Login:
- Email: `admin@orangebank.com`  
- Password: `admin123`

## Available Commands

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Project Structure

```
Frontend/
├── src/
│   ├── pages/          # Full page components
│   ├── components/     # Reusable UI components
│   ├── api/            # Axios configuration
│   ├── context/        # Auth state management
│   ├── layouts/        # Page layouts
│   ├── styles/         # Global CSS & theme
│   └── App.jsx         # Routes & main app
├── package.json        # Dependencies
├── vite.config.js      # Build config
└── index.html          # Entry point
```

## Features at a Glance

✅ User authentication (sign up/login)  
✅ Dashboard with balance & transactions  
✅ Domestic & international transfers  
✅ Direct deposit setup  
✅ Transaction history with filters  
✅ Account statements (PDF download)  
✅ Admin dashboard (user management)  
✅ Fully responsive mobile design  
✅ Dark theme by default  
✅ Form validation on all inputs  

## Key Pages

| Route | Purpose |
|-------|---------|
| `/login` | User login |
| `/register` | Create new account |
| `/admin` | Admin login |
| `/dashboard` | User dashboard |
| `/wire-transfer` | Send domestic transfer |
| `/international-transfer` | Send international transfer |
| `/direct-deposit` | View banking details |
| `/transactions` | Filter & view transactions |
| `/statements` | Download monthly statements |
| `/admin/dashboard` | Admin control panel |

## Debugging Tips

**If page is blank:**
- Check browser console (F12)
- Verify `VITE_API_BASE_URL` in `.env`
- Ensure backend is running

**If login fails:**
- Check backend is accessible
- Verify credentials are correct
- Check browser Network tab for API errors

**If styles look broken:**
- Clear browser cache (Ctrl+Shift+Del)
- Bootstrap should load automatically

## More Info

- **README.md** - Full feature documentation
- **ARCHITECTURE.md** - How the app is built
- **API.md** - Backend API endpoints
- **DEVELOPER_GUIDE.md** - Teaching points & examples
- **DEPLOYMENT.md** - Production deployment

## Need Help?

Check the relevant documentation file above, or read the inline code comments - they explain the "why" behind the code.

---

**That's it!** You're ready to build. Happy coding! 🚀
