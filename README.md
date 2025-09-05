# AICMT International - Biodegradable Solutions

![AICMT International Logo](/public/logo.png)

A comprehensive web platform for AICMT International, showcasing biodegradable plastic products, sustainability initiatives, and corporate information.

## 🌱 Project Overview

AICMT International is a leading manufacturer of biodegradable and compostable plastic alternatives. This web platform serves as the company's digital presence, providing information about products, sustainability initiatives, certifications, and corporate values.

The platform is built with Next.js, uses Supabase for the backend, and features a multilingual interface to serve a global audience.

## ✨ Features

The project is being developed in phases:

### Phase 1: Core Website (Completed)
- ✅ Responsive website design with mobile-first approach
- ✅ Multilingual support (English, Hindi, Tamil, Telugu, Bengali, Marathi, Urdu)
- ✅ Product catalog with detailed product information
- ✅ Company information pages (About, Certifications)
- ✅ Blog system with categorization and tagging
- ✅ Contact form with inquiry tracking
- ✅ Interactive elements (sustainability calculator, biodegradation timeline)
- ✅ SEO optimization

### Phase 2: Admin System (Completed)
- ✅ Secure admin dashboard
- ✅ Content management system for products and blog
- ✅ Inquiry management system
- ✅ User management with roles and permissions
- ✅ Media library management
- ✅ SEO metadata management
- ✅ Backup and restore functionality
- ✅ Analytics dashboard
- ✅ System settings

### Phase 3: Enhanced User Experience (Pending)
- 🔄 Advanced product filtering and search
- 🔄 Product comparison tool
- 🔄 Customer reviews and testimonials system
- 🔄 Enhanced media gallery
- 🔄 Newsletter subscription management
- 🔄 Interactive product demonstrations
- 🔄 Social media integration
- 🔄 Advanced search functionality

### Phase 4: Business Operations (Pending)
- 🔄 E-commerce functionality
- 🔄 Customer account portal
- 🔄 Distributor/Partner portal
- 🔄 Order management system
- 🔄 Inventory management
- 🔄 Advanced analytics
- 🔄 Event calendar/management
- 🔄 Customer support ticketing
- 🔄 Automated marketing tools

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **State Management**: React Context API
- **Styling**: Tailwind CSS, shadcn/ui components
- **Internationalization**: Custom i18n implementation
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account
- Vercel account (optional, for deployment)

## 🚀 Getting Started

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/aicmt-international.git
   cd aicmt-international
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   \`\`\`

4. Set up the database:
   Run the migration script in your Supabase SQL editor:
   \`\`\`sql
   -- Copy the contents of supabase/migrations/20240516_initial_schema.sql
   \`\`\`

5. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

1. Create a new Supabase project
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `supabase/migrations/20240516_initial_schema.sql`
4. Run the SQL script to create all necessary tables and initial data

## 📁 Project Structure

\`\`\`
aicmt-international/
├── app/                    # Next.js app directory
│   ├── [locale]/           # Localized routes
│   ├── admin/              # Admin panel routes
│   ├── api/                # API routes
│   ├── actions/            # Server actions
│   └── auth/               # Authentication routes
├── components/             # React components
│   ├── admin/              # Admin-specific components
│   ├── ui/                 # UI components (shadcn)
│   └── ...                 # Feature-specific components
├── lib/                    # Utility functions and libraries
│   ├── i18n/               # Internationalization
│   ├── supabase/           # Supabase client and types
│   └── ...                 # Other utilities
├── public/                 # Static assets
│   ├── images/             # Images
│   ├── models/             # 3D models
│   └── ...                 # Other static files
├── supabase/               # Supabase configuration
│   └── migrations/         # Database migrations
├── .env.local              # Environment variables (not in repo)
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
\`\`\`

## 🌐 Internationalization

The platform supports multiple languages:
- English (en)
- Hindi (hi)
- Tamil (ta)
- Telugu (te)
- Bengali (bn)
- Marathi (mr)
- Urdu (ur)

Language selection is available in the navigation menu and persists across sessions.

## 👥 Admin Roles

The system supports the following roles:
- **Admin**: Full access to all features
- **Editor**: Can manage content but not users or settings
- **Author**: Can create and edit their own content
- **Viewer**: Read-only access to the admin panel

## 🔒 Authentication

Authentication is handled through Supabase Auth. The system supports:
- Email/password authentication
- Role-based access control
- Protected routes

## 📱 Mobile App Integration

The platform includes components designed for a companion mobile app:
- Product catalog
- Certification verification
- Sustainability calculator
- Inquiry form

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions or support, please contact:
- Email: support@aicmt.com
- Website: https://www.aicmt.com

---

Built with ❤️ for a sustainable future

# Biodegradable Admin Dashboard

A comprehensive admin dashboard for managing your biodegradable products business. This dashboard provides insights into website analytics, inquiries, blog posts, and product management.

## Features

- **Analytics Dashboard**: Track website traffic, pageviews, and unique visitors
- **Inquiry Management**: View and respond to customer inquiries
- **Blog Management**: Create, edit, and publish blog posts
- **Product Management**: Manage your product catalog
- **User Management**: Control user access and permissions
- **Media Library**: Organize and manage your media assets
- **SEO Management**: Optimize your website for search engines
- **Backup System**: Ensure your data is safe with regular backups

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Database Schema

The dashboard uses the following database tables:

- `analytics`: Website traffic data
- `backups`: System backup records
- `blog_posts`: Blog content
- `inquiries`: Customer inquiries
- `media`: Media library assets
- `permissions`: User permissions
- `products`: Product catalog
- `profiles`: User profiles
- `roles`: User roles
- `role_permissions`: Role-permission mappings
- `seo_metadata`: SEO settings

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
\`\`\`

## License

MIT
