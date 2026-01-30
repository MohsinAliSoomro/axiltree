# Database Setup for Contact Form

## Run the Migration

You need to create the `contacts` table in your Supabase database. You have two options:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `supabase/migrations/create_contacts_table.sql`
6. Click **Run** to execute the SQL

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Link your project (if not already linked)
supabase link --project-ref your-project-ref

# Apply the migration
supabase db push
```

## Verify the Table

After running the migration, verify the table was created:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see a new table called `contacts`
3. The table should have these columns:
   - `id` (uuid, primary key)
   - `name` (text)
   - `email` (text)
   - `subject` (text)
   - `message` (text)
   - `created_at` (timestamp)

## Testing the Contact Form

1. Start your development server: `npm run dev`
2. Navigate to the home page
3. Scroll down to the "Get in Touch" section
4. Fill out the contact form and submit
5. Check your Supabase Dashboard → Table Editor → contacts to see the submission

## Security

The table has Row Level Security (RLS) enabled:
- **Anyone** (authenticated or not) can submit contact forms
- **Only authenticated users** can read/view contact submissions (for admin purposes)

This ensures that form submissions are public but viewing them requires authentication.
