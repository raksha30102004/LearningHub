# IMPORTANT: Update Your Supabase Configuration

## ⚠️ Action Required

You need to update your `.env.local` file with the correct Supabase credentials.

### Current Issue

The `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your `.env.local` is currently set to a URL instead of an API key.

### Steps to Fix

1. **Go to your Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Find Your API Keys**
   - Go to **Project Settings** (gear icon in sidebar)
   - Click on **API** section
   - You'll see two keys:
     - `anon` / `public` key
     - `service_role` key (keep this secret!)

3. **Update `.env.local`**
   
   Replace the current content with:
   
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://ayjzmielpznmbngdxhqt.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste-your-anon-key-here>
   ```

   Your anon key should look something like:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5anptaWVscHpubWJuZ2R4aHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNjgwMDAsImV4cCI6MjA1MzY0NDAwMH0.some-signature-here
   ```

## Database Setup

After fixing the credentials, you need to initialize the database:

1. **Open Supabase SQL Editor**
   - In your Supabase dashboard, click **SQL Editor** in the sidebar
   - Click **New Query**

2. **Run the Schema**
   - Open the file `lib/supabase/schema.sql` in this project
   - Copy ALL the SQL content
   - Paste it into the Supabase SQL Editor
   - Click **Run** or press Cmd+Enter

3. **Create Storage Bucket**
   - Go to **Storage** in Supabase dashboard
   - Click **New bucket**
   - Name it: `course-videos`
   - Set it to **Public**
   - Click **Create bucket**

## Verify Setup

Run this command to test the connection:

```bash
npm run dev
```

Then visit:
- [http://localhost:3000](http://localhost:3000) - Home page
- [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup) - Create account

If you can sign up successfully, your setup is complete! 🎉

## Making Yourself an Instructor

After signing up, run this SQL in Supabase SQL Editor to become an instructor:

```sql
UPDATE profiles 
SET role = 'instructor' 
WHERE email = 'your-email@example.com';
```

Then you can:
- Visit [http://localhost:3000/instructor](http://localhost:3000/instructor)
- Create courses
- Upload videos

## Troubleshooting

### Error: "Invalid API key"
- Double-check you copied the **anon/public** key, not the service_role key
- Make sure there are no extra spaces in the `.env.local` file

### Error: "relation does not exist"
- You haven't run the database schema yet
- Go back to "Database Setup" section above

### Videos won't upload
- Check that the `course-videos` bucket exists in Supabase Storage
- Ensure the bucket is set to **Public**

Need help? The schema SQL file is at: `lib/supabase/schema.sql`
