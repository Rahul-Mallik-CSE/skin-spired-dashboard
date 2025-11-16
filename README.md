<!-- @format -->

# SkinSpired Dashboard

A modern, feature-rich admin dashboard for managing the SkinSpired platform - a comprehensive skin condition management and product recommendation system.

## 🌟 Features

### Dashboard Overview

- **Real-time Statistics**: Track total users, skin conditions, and products
- **Recent User Activity**: Monitor new user registrations and verification status
- **Transaction Management**: View and manage user transactions with pagination

### User Management

- Comprehensive user list with detailed profiles
- User verification status tracking
- User details modal with full information access

### Skin Condition Management

- Track and manage skin condition records
- Upload and categorize skin condition data
- Monitor skin condition analytics

### Product Management

- Upload and manage product information
- Product catalog administration
- Integration with skin condition recommendations

### Authentication & Authorization

- Secure admin authentication with JWT
- Role-based access control (Admin only)
- Protected routes with middleware
- Password management (change, reset, forgot password)
- OTP verification system

### Settings & Personalization

- Personal information management
- Password change functionality
- User profile editing
- Notification center
- Dark/Light theme support

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.2.4 (React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Radix UI (comprehensive component library)
- **State Management**: Redux Toolkit 2.8.2 with RTK Query
- **Forms**: React Hook Form 7.54.1 with Zod validation
- **Charts**: Chart.js 4.4.9 & Recharts 2.15.0
- **Icons**: Lucide React & React Icons
- **Rich Text Editor**: React Quill 2.0.0

### Core Libraries

- **Authentication**: JWT Decode
- **Date Handling**: date-fns 4.1.0
- **Notifications**: Sonner 1.7.4
- **Theme**: next-themes 0.4.4
- **Carousels**: Embla Carousel React
- **Phone Input**: react-phone-input-2

## 📁 Project Structure

```
skin-spired-dashboard/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── create-account/       # User registration
│   │   ├── signin/               # Login page
│   │   ├── forget-password/      # Password recovery
│   │   ├── reset-password/       # Password reset
│   │   ├── verify-otp/           # OTP verification
│   │   └── verify-password/      # Password verification
│   ├── setting/                  # Settings pages
│   │   ├── personal-information/ # User profile management
│   │   └── change-password/      # Password management
│   ├── users/                    # User management
│   ├── skinCondition/            # Skin condition tracking
│   ├── uploadProduct/            # Product upload
│   ├── notifications/            # Notification center
│   ├── maintenance/              # Maintenance page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Dashboard home
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   ├── share/                    # Shared components
│   ├── dashboard-header.tsx      # Header component
│   ├── dashboard-sidebar.tsx     # Sidebar navigation
│   ├── user-details-modal.tsx    # User details dialog
│   ├── subscription-modal.tsx    # Subscription management
│   ├── logout-modal.tsx          # Logout confirmation
│   └── notification-item.tsx     # Notification display
├── redux/                        # State management
│   ├── api/                      # API configuration
│   │   └── baseAPI.ts            # RTK Query base API
│   ├── feature/                  # Feature-based API slices
│   │   ├── authAPI.ts            # Authentication endpoints
│   │   ├── dashboardAPI.ts       # Dashboard data
│   │   ├── userAPI.ts            # User management
│   │   ├── skinConditionAPI.ts   # Skin conditions
│   │   ├── uploadProductAPI.ts   # Product uploads
│   │   └── notificationAPI.ts    # Notifications
│   ├── store.ts                  # Redux store configuration
│   └── Providers.tsx             # Redux provider wrapper
├── service/                      # Service layer
│   └── authService.ts            # Authentication services
├── hooks/                        # Custom React hooks
│   ├── use-mobile.tsx            # Mobile detection
│   └── use-toast.ts              # Toast notifications
├── lib/                          # Utility functions
│   └── utils.ts                  # Helper utilities
├── public/                       # Static assets
│   ├── icon/                     # Icon images
│   └── issue/                    # Issue-related assets
├── middleware.ts                 # Next.js middleware (Auth)
├── tailwind.config.ts            # Tailwind configuration
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── components.json               # Shadcn UI configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/rahul3507/skin-spired-dashboard.git
   cd skin-spired-dashboard
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=your_api_url
   NEXT_PUBLIC_JWT_SECRET=your_jwt_secret
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## 🔐 Authentication

The dashboard uses JWT-based authentication with role-based access control. Only users with the `ADMIN` role can access the dashboard.

### Protected Routes

The middleware protects the following routes:

- `/` - Dashboard home
- `/users` - User management
- `/settings` - Settings pages
- `/skinCondition` - Skin condition tracking
- `/uploadProduct` - Product uploads
- And more...

Unauthenticated users are automatically redirected to `/signin`.

## 📊 API Integration

The dashboard uses RTK Query for efficient data fetching and caching. All API endpoints are organized in feature-based slices:

- **authAPI**: Authentication and authorization
- **dashboardAPI**: Dashboard statistics and transactions
- **userAPI**: User CRUD operations
- **skinConditionAPI**: Skin condition management
- **uploadProductAPI**: Product upload and management
- **notificationAPI**: Notification system

## 🎨 UI Components

Built with Radix UI and Tailwind CSS, the dashboard includes:

- **Forms**: Input, Select, Checkbox, Radio, Textarea, DatePicker
- **Feedback**: Toast, Alert, Progress, Loading states
- **Overlays**: Modal, Dialog, Sheet, Popover, Tooltip
- **Navigation**: Sidebar, Tabs, Breadcrumb, Pagination
- **Data Display**: Table, Card, Avatar, Badge
- **And many more...**

## 🌙 Theme Support

The dashboard supports both light and dark themes using `next-themes`. Users can toggle between themes in the settings.

## 📱 Responsive Design

Fully responsive design that works seamlessly across:

- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🧪 Development

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting (recommended)

### Scripts

```bash
# Development
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## 🔧 Configuration

### Next.js Configuration

The project includes custom configurations:

- ESLint and TypeScript errors ignored during builds
- Unoptimized images for faster development
- Remote image patterns for external sources

### Tailwind Configuration

Custom Tailwind setup with:

- Extended color palette
- Custom animations
- Component-specific utilities

## 📦 Key Dependencies

- **@reduxjs/toolkit**: State management
- **@radix-ui**: Unstyled, accessible UI components
- **next-themes**: Theme management
- **react-hook-form**: Form handling
- **zod**: Schema validation
- **jwt-decode**: JWT token decoding
- **sonner**: Toast notifications
- **lucide-react**: Icon library

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Team

Developed by the SkinSpired team.

## 📞 Support

For support, please contact the development team or open an issue in the repository.

---

**Note**: This is an admin dashboard. Make sure to configure proper authentication and authorization before deploying to production.
