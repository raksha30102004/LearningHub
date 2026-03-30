# 🚀 Quick Start Guide

Get your LMS up and running in 5 minutes!

## Step 1: Fix Supabase Credentials (2 min)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Open your project
3. Go to **Settings** → **API**
4. Copy the **anon/public** key
5. Open `.env.local` in this project
6. Replace the `NEXT_PUBLIC_SUPABASE_ANON_KEY` value with your key

Your `.env.local` should look like:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ayjzmielpznmbngdxhqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6Ik... (your actual key)
```

## Step 2: Set Up Database (1 min)

1. In Supabase dashboard, click **SQL Editor**
2. Click **New Query**
3. Open `lib/supabase/schema.sql` in this project
4. Copy ALL the SQL and paste into Supabase
5. Click **Run** (or Cmd+Enter)

✅ You should see "Success. No rows returned"

## Step 3: Create Storage Bucket (30 sec)

1. In Supabase dashboard, click **Storage**
2. Click **New bucket**
3. Name it: `course-videos`
4. Toggle **Public bucket** to ON
5. Click **Create bucket**

## Step 4: Start Development Server (30 sec)

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

## Step 5: Create Your Account (1 min)

1. Click **Sign Up**
2. Enter your email and password
3. You're in! 🎉

## Bonus: Become an Instructor

To create courses, run this SQL in Supabase:

```sql
UPDATE profiles 
SET role = 'instructor' 
WHERE email = 'your-email@example.com';
```

Then visit: [http://localhost:3000/instructor](http://localhost:3000/instructor)

---

## What You Can Do Now

### As a Student:
- Browse courses at `/courses`
- Enroll in courses
- Watch videos
- Download videos for offline viewing

### As an Instructor:
- Create courses at `/instructor`
- Upload videos
- Publish courses

---

## Troubleshooting

**Can't sign up?**
→ Check that you ran the database schema SQL

**Videos won't upload?**
→ Make sure the `course-videos` bucket exists and is public

**Still stuck?**
→ Check `SETUP.md` for detailed instructions

---

## That's It! 🎉

You now have a working LMS with offline video capabilities!
