# LMS Platform - Learning Management System

A modern, full-featured Learning Management System (LMS) built with Next.js 15, Supabase, and PWA capabilities. Students can enroll in courses and watch videos offline.

## Features

- 🎓 **Course Management** - Create, edit, and publish courses
- 📹 **Video Upload & Streaming** - Upload course videos with Supabase Storage
- 👥 **User Authentication** - Secure signup/login with Supabase Auth
- 📱 **Progressive Web App** - Install as app on mobile/desktop
- 💾 **Offline Video Viewing** - Download videos and watch without internet
- 📊 **Progress Tracking** - Track student progress through courses
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 🌙 **Dark Mode** - Full dark mode support
- 🔒 **Role-Based Access** - Student, Instructor, and Admin roles

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS v4
- **PWA**: next-pwa + Workbox
- **Offline Storage**: IndexedDB (via idb)
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to find your credentials
3. Update `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Initialize Database

1. Go to Supabase SQL Editor
2. Run the SQL schema from `lib/supabase/schema.sql`
3. This creates all necessary tables, RLS policies, and triggers

### 4. Set Up Storage

1. Go to Supabase Storage
2. Create a new bucket called `course-videos`
3. Set bucket to **Public** for video access

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Schema

### Tables

- **profiles** - User profiles with roles (student/instructor/admin)
- **courses** - Course information and metadata
- **enrollments** - Student course enrollments with progress
- **videos** - Course video content and metadata
- **video_progress** - Individual video watch progress

## Usage Guide

### For Students

1. **Sign Up** - Create an account at `/auth/signup`
2. **Browse Courses** - View available courses at `/courses`
3. **Enroll** - Click "Enroll Now" on any course
4. **Watch Videos** - Access course content after enrollment
5. **Download for Offline** - Click download icon next to videos

### For Instructors

1. **Become Instructor** - Update role in Supabase profiles table:
   ```sql
   UPDATE profiles SET role = 'instructor' WHERE email = 'your@email.com';
   ```
2. **Create Course** - Go to `/instructor` and click "Create Course"
3. **Add Videos** - Upload videos in course management page
4. **Publish Course** - Check "Publish" to make visible to students

## PWA & Offline Features

- **Service Worker** caches videos and assets
- **IndexedDB** stores video blobs for offline playback
- Users can download individual videos for offline viewing
- Progress syncs when connection is restored

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## License

MIT License

---

Built with Next.js and Supabase

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
