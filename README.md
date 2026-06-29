# Foodie Cafe and Restaurant

Foodie Cafe and Restaurant is a full-stack restaurant website with a public customer-facing site and a protected admin dashboard.

Public users can browse restaurant information, services/menu items, dining packages, gallery images, blogs, privacy/terms pages, and submit contact messages or table reservation requests.

Admins can manage restaurant content, reservations, tables, users, SEO, banners, gallery, SMTP mail, Cloudinary media storage, and other site settings.

## Project Type

Eta ekta cafe/restaurant management and website CMS app.

Main parts:

- Public restaurant website
- Admin dashboard
- Table reservation / appointment system
- Content management for services, packages, blogs, banners, gallery, team, testimonials, policies, and SEO
- Media upload with Cloudinary
- Email support with SMTP/Nodemailer

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Redux Toolkit and RTK Query
- Redux Persist
- React Hook Form
- Framer Motion
- Swiper
- Jodit React editor
- Lucide React and React Icons
- html2canvas and jsPDF

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT authentication
- bcrypt password hashing
- Zod validation
- Multer file upload
- Sharp image conversion
- Cloudinary media storage
- Nodemailer email sending
- ESLint and Prettier

## Folder Structure

```txt
caferestaurant/
  backend/     Express + TypeScript + MongoDB API
  frontend/    React + Vite customer site and admin dashboard
```

## Prerequisites

- Node.js 20 or newer
- npm
- MongoDB local database or MongoDB Atlas connection string
- Cloudinary account for image/file upload features

## Backend Setup

Go to the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`:

```env
PORT=3311
DB_URL=mongodb://127.0.0.1:27017/caferestaurant
JWT_ACCESS_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:1890
NODE_ENV=development
```

Run the backend in development mode:

```bash
npm run dev
```

Backend will run on:

```txt
http://localhost:3311
```

API base URL:

```txt
http://localhost:3311/api
```

## Frontend Setup

Go to the frontend folder:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend`:

```env
VITE_BACKEND_URL=http://localhost:3311
```

Run the frontend in development mode:

```bash
npm run dev
```

Frontend will run on:

```txt
http://localhost:1890
```

Important: the frontend fallback API URL is `http://localhost:5000`, but this backend uses port `3311` by default. So set `VITE_BACKEND_URL=http://localhost:3311`.

## Default Admin Login

On first backend startup, the app creates a default super admin if no super admin exists.

```txt
Email: sa@mail.com
Password: sa@mail.com
```

Admin login URL:

```txt
http://localhost:1890/login
```

Change this password after first login.

## Main Public Routes

- `/` - Home
- `/about-us` - About restaurant
- `/services` - Services/menu items
- `/service/:slug` - Service details
- `/packages` - Dining packages
- `/gallery` - Gallery
- `/blogs` - Blog list
- `/blog/:slug` - Blog details
- `/appointment` - Table reservation / appointment
- `/contact-us` - Contact page
- `/privacy-policy` - Privacy policy
- `/terms-condition` - Terms and conditions

## Main Admin Routes

- `/admin/dashboard`
- `/admin/services/all`
- `/admin/packages/all`
- `/admin/about`
- `/admin/appointments/all`
- `/admin/contact-message`
- `/admin/setting/general`
- `/admin/setting/banner/all`
- `/admin/setting/gallery/all`
- `/admin/setting/smtp`
- `/admin/setting/cloudinary`
- `/admin/setting/reservation`
- `/admin/setting/tables`
- `/admin/blogs/all`
- `/admin/user/all`
- `/admin/seo`

## Useful Scripts

### Backend

```bash
npm run dev       # Start backend with ts-node-dev
npm run build     # Compile TypeScript to dist
npm start         # Run compiled backend from dist
npm run lint      # Run ESLint
npm run lint:fix  # Fix lint issues
npm run format    # Format files with Prettier
```

### Frontend

```bash
npm run dev      # Start Vite dev server
npm run build    # Type-check and build frontend
npm run start    # Preview production build
npm run lint     # Run ESLint
```

## Production Build

Build backend:

```bash
cd backend
npm run build
npm start
```

Build frontend:

```bash
cd frontend
npm run build
npm run start
```

For deployment, set production environment variables:

Backend:

```env
PORT=3311
DB_URL=your_production_mongodb_url
JWT_ACCESS_SECRET=your_strong_secret
JWT_ACCESS_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

Frontend:

```env
VITE_BACKEND_URL=https://your-backend-domain.com
```

## Notes

- Cloudinary credentials are managed from the admin dashboard under Cloudinary Storage settings.
- SMTP mail settings are managed from the admin dashboard under SMTP Mail settings.
- Protected API requests use the `admin-authorization` header with the JWT token.
- Uploaded images are converted to WebP before Cloudinary upload.
- The frontend includes `vercel.json` for client-side route rewrites on Vercel.
