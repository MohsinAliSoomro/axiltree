# AxilTree - Project Overview

## 📋 Project Introduction

**AxilTree** is a modern **Bio Link** or **Links-in-Bio** platform. This platform allows users to share all their important links in one place. It's basically a **Linktree-like** platform where users can:

- Create a unique username
- Add social media links
- Customize their profile (themes, fonts, colors)
- Reorder links using drag & drop
- Share their public profile page

## 🎯 Project Purpose

This project is specifically built for social media platforms like **Instagram, TikTok, and Twitter** where users can only put one link in their bio. With AxilTree, users can:

1. Share **one link** to access all their important links
2. Create **customizable profiles** with different themes and fonts
3. Make **real-time updates** to their links
4. Use a **mobile-friendly** interface

## 🛠️ Technologies & Libraries Used

### Core Framework & Language
- **Next.js 16.1.0** - React framework for production
- **React 19.2.3** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Node.js** - Runtime environment

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - `@supabase/ssr` (v0.8.0) - Server-side rendering support
  - `@supabase/supabase-js` (v2.89.0) - Supabase client library
  - **PostgreSQL Database** - Through Supabase
  - **Authentication** - Supabase Auth
  - **Row Level Security (RLS)** - Database security

### UI Components & Styling
- **Mantine UI** - Complete UI component library
  - `@mantine/core` (v8.3.10) - Core components
  - `@mantine/hooks` (v8.3.10) - React hooks
  - `@mantine/form` (v8.3.10) - Form management
  - `@mantine/notifications` (v8.3.10) - Notifications
  - `@mantine/nprogress` (v8.3.10) - Progress bars
  - `@mantine/spotlight` (v8.3.10) - Spotlight search
  - `@mantine/carousel` (v8.3.10) - Carousel component
  - `@mantine/charts` (v8.3.10) - Charts (if needed)

- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - CSS processing
  - `postcss-preset-mantine` - Mantine PostCSS preset
  - `postcss-simple-vars` - CSS variables

### Icons & Graphics
- **Lucide React** (v0.562.0) - Modern icon library
- **Tabler Icons React** (v3.36.0) - Additional icons

### Drag & Drop
- **@hello-pangea/dnd** (v18.0.1) - Drag and drop functionality for links reordering

### Fonts
- **Google Fonts** (via Next.js):
  - Inter
  - Poppins
  - Space Mono
  - Quicksand
  - Amarna
  - Delius
  - Borel
  - Iceland

### Charts (if needed)
- **Recharts** (v3.6.0) - Chart library
- **Embla Carousel** (v8.5.2) - Carousel library

### Development Tools
- **ESLint 9** - Code linting
- **eslint-config-next** - Next.js ESLint config
- **TypeScript** - Type checking

## 📁 Project Structure

```
axiltree/
├── app/                          # Next.js App Router
│   ├── [username]/              # Dynamic route for public profiles
│   │   ├── page.tsx             # Public profile page
│   │   └── ProfileView.tsx      # Profile view component
│   ├── account/                 # User account management
│   │   ├── page.tsx             # Account dashboard
│   │   ├── account-form.tsx     # Account form
│   │   ├── links/               # Links management
│   │   │   ├── Links.tsx        # Main links dashboard
│   │   │   └── page.tsx         # Links page
│   │   └── username/            # Username management
│   │       ├── page.tsx
│   │       └── username-form.tsx
│   ├── auth/                    # Authentication routes
│   │   ├── callback/            # OAuth callback
│   │   ├── confirm/             # Email confirmation
│   │   └── signout/             # Sign out
│   ├── components/              # Reusable components
│   │   ├── button.tsx
│   │   ├── layout.tsx           # App shell layout
│   │   └── why.tsx              # Landing page component
│   ├── error/                   # Error pages
│   ├── lib/                     # Utility libraries
│   │   └── supabase/            # Supabase clients
│   │       ├── client.ts        # Client-side Supabase
│   │       ├── server.ts        # Server-side Supabase
│   │       └── proxy.ts         # Proxy for auth
│   ├── login/                   # Login page
│   ├── signup/                  # Signup page
│   ├── theme/                   # Theme configuration
│   │   └── mantineTheme.ts      # Mantine theme setup
│   ├── utils/                   # Utility functions
│   │   └── theme.ts             # Theme definitions
│   ├── verification/            # Email verification
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── public/                      # Static assets
├── proxy.ts                     # Proxy configuration
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
└── README.md                    # Project documentation
```

## 🗄️ Database Schema

### Tables

1. **profiles** - User profiles
   - `id` (UUID, Primary Key)
   - `username` (TEXT, Unique, 3-30 characters)
   - `full_name` (TEXT)
   - `bio` (TEXT)
   - `avatar_url` (TEXT)
   - `theme_id` (UUID, Foreign Key)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

2. **links** - User links
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key to profiles)
   - `title` (TEXT, 1-100 characters)
   - `url` (TEXT)
   - `icon` (TEXT)
   - `position` (INTEGER)
   - `clicks` (INTEGER, default 0)
   - `is_active` (BOOLEAN, default true)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

3. **themes** - Custom themes
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key to profiles)
   - `name` (TEXT)
   - `background_type` (TEXT: 'solid', 'gradient', 'image')
   - `background_value` (TEXT)
   - `button_style` (TEXT: 'rounded', 'sharp', 'pill')
   - `button_color` (TEXT)
   - `text_color` (TEXT)
   - `font_family` (TEXT)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

### Security Features
- **Row Level Security (RLS)** enabled on all tables
- **Policies** for SELECT, INSERT, UPDATE, DELETE operations
- **Automatic profile creation** on user signup via triggers
- **Automatic timestamp updates** via triggers

## ✨ Main Features

### 1. User Authentication
- Email/password signup & login
- OAuth authentication (via Supabase)
- Email verification
- Session management
- Secure signout

### 2. Profile Management
- Unique username creation
- Profile information (name, bio, avatar)
- Username validation (3-30 chars, alphanumeric + underscore)
- Profile editing

### 3. Links Management
- Add multiple links
- Social media links support:
  - Instagram
  - TikTok
  - Twitter/X
  - Facebook
  - WhatsApp
- URL validation for each social platform
- Drag & drop reordering
- Delete links
- Link activation/deactivation
- Click tracking (clicks counter)

### 4. Theme Customization
- 20+ pre-built themes:
  - Gradient themes (Sunset Glow, Ocean Breeze, Purple Haze, etc.)
  - Solid color themes (Classic White, Dark Mode, etc.)
- Custom background colors
- Button style customization
- Text color customization

### 5. Font Customization
- 8 different font options:
  - Inter (Clean & Modern)
  - Poppins (Stylish)
  - Space Mono (Techy)
  - Quicksand (Friendly)
  - Amarna (Elegant)
  - Delius (Handwritten)
  - Borel (Playful)
  - Iceland (Futuristic)

### 6. Real-time Updates
- Real-time link updates using Supabase subscriptions
- Live preview of changes
- Instant UI updates

### 7. Public Profile Pages
- Dynamic routes: `/[username]`
- Public profile view
- Active links display
- Theme-based styling
- Mobile-responsive design

### 8. Mobile Preview
- Live mobile preview in dashboard
- Real-time theme preview
- Responsive design

### 9. Landing Page
- Hero section
- Features showcase
- How it works section
- Benefits section
- Call-to-action buttons

## 🔧 Configuration Files

### Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

### Key Configuration Files
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `postcss.config.mjs` - PostCSS configuration
- `eslint.config.mjs` - ESLint configuration
- `package.json` - Dependencies and scripts

## 🚀 How to Run

### Prerequisites
- Node.js installed
- npm or yarn
- Supabase account and project

### Steps
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Create `.env.local` file
   - Add Supabase URL and keys

3. Set up database:
   - Run the SQL script from README.md in Supabase SQL editor

4. Run development server:
   ```bash
   npm run dev
   ```

5. Open browser:
   - Navigate to `http://localhost:3000`

## 📱 Supported Social Platforms

- Instagram
- TikTok
- Twitter/X
- Facebook
- WhatsApp

## 🎨 Available Themes

### Gradient Themes
1. Sunset Glow
2. Ocean Breeze
3. Purple Haze
4. Morning Sky
5. Electric Blue
6. Pink Sunset
7. Aurora
8. Mint Breeze
9. Fire & Ice
10. Twilight

### Solid Color Themes
1. Classic White
2. Dark Mode
3. Ocean Blue
4. Forest Green
5. Sunset Orange
6. Soft Pink
7. Neon Green
8. Royal Purple
9. Sunny Yellow
10. Deep Gray

## 🔐 Security Features

- Row Level Security (RLS) on all database tables
- User-specific data access policies
- Secure authentication via Supabase
- Server-side and client-side Supabase clients
- Cookie-based session management
- URL validation for social links

## 📊 Key Functionalities

1. **User Registration & Login**
   - Secure signup process
   - Email verification
   - Session management

2. **Dashboard**
   - Profile editing
   - Links management
   - Theme selection
   - Font selection
   - Live preview

3. **Public Profile**
   - Username-based routing
   - Theme-based styling
   - Active links display
   - Mobile-responsive

4. **Real-time Features**
   - Live link updates
   - Instant UI refresh
   - Real-time subscriptions

## 🎯 Use Cases

1. **Social Media Influencers** - To share all their social links
2. **Content Creators** - To promote their content
3. **Businesses** - To share their products/services
4. **Personal Branding** - To strengthen their online presence

## 📝 Notes

- Project uses **Next.js App Router** (not Pages Router)
- All components are **TypeScript** based
- Both **Server Components** and **Client Components** are used
- Supabase provides **real-time subscriptions**
- **Drag & Drop** functionality implemented with `@hello-pangea/dnd`
- **Mantine UI** provides a complete UI solution
- **Tailwind CSS** used for utility classes

## 🔄 Future Enhancements

Potential features that can be added:
- Analytics dashboard (link clicks tracking)
- Custom domain support
- More social platform integrations
- Link scheduling
- QR code generation
- Custom button styles
- Image upload for avatars
- Social media preview cards

---

**Project Status:** ✅ Active Development  
**Version:** 0.1.0  
**Last Updated:** 2024

