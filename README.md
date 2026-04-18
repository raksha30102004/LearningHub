# LearningHub 📚

A full-stack Learning Management System (LMS) where students can browse courses, enroll, and watch video lessons — even offline. Instructors can create and manage courses with video uploads.

## Features

- **Course Browsing & Enrollment** — Students can explore available courses and enroll with one click.
- **Video Lessons** — Stream course videos directly in the browser.
- **Offline Video Viewing** — Download videos and watch them offline using PWA + IndexedDB caching.
- **Instructor Dashboard** — Instructors can create courses, upload videos, and manage course settings.
- **Student Dashboard** — Track enrolled courses and progress.
- **Authentication** — Sign up / login with Supabase Auth.
- **Role-Based Access** — Supports student, instructor, and admin roles.

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | [Next.js](https://nextjs.org/) 16 (App Router) |
| Language    | TypeScript                        |
| Styling     | Tailwind CSS 4                    |
| Backend/DB  | [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage) |
| Offline     | PWA with IndexedDB (via `idb`)    |
| Deployment  | Vercel (recommended)              |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project

### Installation

```bash
cd learning-platform/my-lms-platform
npm install
```

### Environment Variables

Create a `.env.local` file in `learning-platform/my-lms-platform/`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the SQL schema in your Supabase SQL editor:

```
learning-platform/my-lms-platform/lib/supabase/schema.sql
```

### Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
learning-platform/my-lms-platform/
├── app/                  # Next.js App Router pages
│   ├── auth/             # Login & signup pages
│   ├── courses/          # Course browsing & detail pages
│   ├── dashboard/        # Student dashboard
│   └── instructor/       # Instructor dashboard & course management
├── components/           # Shared UI components
├── lib/
│   ├── auth/             # Auth context provider
│   ├── offline/          # Video caching for offline use
│   └── supabase/         # Supabase client, server helpers & DB types
└── public/               # Static assets & PWA manifest
```

## License

This project is for educational purposes.
