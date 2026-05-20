# GotAccepted - Official Web Platform

GotAccepted is a modern, premium web platform designed to help Latino students navigate international admissions, secure scholarships, and join world-class academic programs. The platform includes a public-facing website with beautiful animations and a secure, role-based Admin Dashboard for content and contact management.

---

## Tech Stack

This project is built on a modern, high-performance web stack:

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) utilizing Turbopack for rapid compilation
- **Language**: [TypeScript](https://www.typescriptlang.org/) for robust type safety
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with native CSS-first configuration and `@tailwindcss/typography` for rich text layouts
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL) with Row-Level Security (RLS) policies
- **Email Delivery**: [Resend](https://resend.com/) for reliable contact form notifications and custom templates
- **Icons & Animations**: [React Icons](https://react-icons.github.io/react-icons/) and [Framer Motion](https://www.framer.com/motion/)

---

## Features

### Public Website
- **Dynamic Content rendering**: Fully responsive pages for Programs, Scholarships, Blog, and Team Members pulling directly from Supabase.
- **Premium UI/UX**:
  - Custom scrollbars tailored specifically for the GotAccepted brand identity.
  - Smooth animation packages (`animate-fadeIn`, `animate-slideUp`) coupled with Framer Motion transitions.
  - Consistent branding palette: Slate Blues (`#1f4594`), Bright Gold/Amber (`#f19520`), and sleek glassmorphism panels.
- **Interactive Contact Form**: Inbound leads submit queries directly to the admin dashboard, triggering instant email notifications.

### Admin Dashboard (CMS)
- **Role-Based Access Control (RBAC)**: Secure access routes separating `Admin` and `Editor` roles.
- **Inbound Lead Manager**: Read, delete, and reply directly to messages. Displays intuitive status badges (`unread`, `read`, `replied`) synced across client state and the Supabase database.
- **Content Management**: Complete CRUD operations for Blog Posts, Programs, Scholarships, and Team members.
- **Real-time Live Preview**: Full-screen modal live previews for Blogs and Programs using actual presentational components (`BlogPostContent`, `ProgramPostContent`).
- **Markdown & HTML Parser**: Embedded `react-markdown` with GFM and Raw HTML plugins allows you to customize the layouts of your blog and program descriptions (insert lists, links, titles, images, and embedded media seamlessly).

---

## Local Development Setup

Follow these steps to clone and run the project locally.

### 1. Clone and Install Dependencies
```bash
git clone https://github.com/SebasHuaypar/got-accepted-web-platform.git
cd got-accepted-web-platform
npm install
```

### 2. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**
- **Supabase**: Active PostgreSQL project instance
- **Resend**: Free account with a verified domain (or domain key for testing)

### 3. Environment Variables
Create a `.env.local` file in the root directory based on the `.env.example` structure.

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email Configuration (Resend)
RESEND_API_KEY=re_your_resend_api_key
NEXT_PUBLIC_SENDER_EMAIL=info@gotaccepted.org
NEXT_PUBLIC_EMAIL_BANNER_URL=https://your-storage-url.co/banner_email.jpg
NEXT_PUBLIC_CONTACT_EMAIL=info@gotaccepted.org

# Social Links (Configured Globally)
NEXT_PUBLIC_SOCIAL_INSTAGRAM=https://www.instagram.com/gotacceptedorg/
NEXT_PUBLIC_SOCIAL_LINKEDIN=https://www.linkedin.com/company/gotacceptedorg/
NEXT_PUBLIC_SOCIAL_TIKTOK=https://www.tiktok.com/@gotacceptedorg
NEXT_PUBLIC_SOCIAL_YOUTUBE=https://www.youtube.com/@gotacceptedorg
NEXT_PUBLIC_SOCIAL_FACEBOOK=https://www.facebook.com/gotacceptedorg
```
> [!IMPORTANT]
> Never commit `.env.local` to version control. The file has been automatically added to `.gitignore`.

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.  
Access the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## Database Schema Model (Supabase)

This application connects to a PostgreSQL database hosted on Supabase. Below is a conceptual overview of the tables used:

- **profiles**: Stores user metadata linked to Supabase Auth (`id`, `full_name`, `avatar_url`, `updated_at`).
- **roles**: Manages security permissions (`id`, `name` such as Admin/Editor).
- **contact_submissions**: Stores inbound contact messages (`id`, `name`, `email`, `subject`, `message`, `status` [unread, read, replied], `created_at`).
- **blog_posts**: Stores articles (`id`, `title`, `slug`, `excerpt`, `content` [Markdown/HTML], `author`, `author_role`, `author_avatar`, `category`, `image_url`, `reading_time`, `date`).
- **programs**: Stores dynamic courses/services offered (`id`, `title`, `slug`, `category`, `duration`, `image_url`, `description` [Markdown/HTML], `next_intake`, `availability`).
- **scholarships**: Stores scholarship records (`id`, `title`, `institution`, `institution_logo`, `amount`, `deadline`, `category` [array], `description`, `requirements` [array], `link`).
- **members**: Stores team profile information (`id`, `name`, `role`, `category` [BOARD/TEAM], `avatar_url`, `linkedin`, `instagram`, `group`).

---

## Production Deployment

This application is fully optimized for **Vercel**:

1. Push your code to a Git repository (e.g., GitHub).
2. Connect your repository to Vercel.
3. Paste all environment variables from `.env.local` to the Vercel project configuration dashboard.
4. Deploy!

---

## Author

<div align="center">

### Sebastián Huaypar Acurio

Computer Science Student @ UNI  
AI, Data Science & Analytics Engineering Enthusiast. Building websites just for fun  
[LinkedIn](https://www.linkedin.com/in/sebashuaypar)

</div>
