# Supabase RLS & Configuration

## � Quick Start

**Follow these steps in order:**

1. **Create tables first** (see "Create Tables" section below)
2. **Then enable RLS** (copy the SQL below)

## �🔐 Enable Row Level Security (RLS)

Run these SQL commands in your Supabase SQL Editor (Dashboard → SQL Editor → New Query):

```sql
-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own projects
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create projects
CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update own projects
CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete own projects
CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view tasks in their projects
CREATE POLICY "Users can view tasks in own projects"
  ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = tasks.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Policy: Users can create tasks in their projects
CREATE POLICY "Users can create tasks in own projects"
  ON tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Policy: Users can update tasks in their projects
CREATE POLICY "Users can update tasks in own projects"
  ON tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = tasks.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Policy: Users can delete tasks in their projects
CREATE POLICY "Users can delete tasks in own projects"
  ON tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = tasks.project_id 
      AND projects.user_id = auth.uid()
    )
  );
```

## ✅ Supabase Configuration Checklist

### Authentication
- [ ] Email provider enabled (Settings → Authentication → Providers)
- [ ] Email templates customized (if needed)
- [ ] URL Configuration set:
  - Development: `http://localhost:5175`
  - Production: `https://your-domain.com`

### Database
- [ ] Projects table created
- [ ] Tasks table created
- [ ] RLS enabled on all tables
- [ ] RLS policies created (use SQL above)

### Storage (Optional)
- [ ] Enable Storage bucket for file uploads
- [ ] Set RLS policies for storage

### Settings
- [ ] JWT Secret configured
- [ ] Database version checked
- [ ] Backups enabled (auto-backup)

## 🧪 Test RLS Policies

After creating policies:

1. **Test in Supabase UI:**
   - Go to SQL Editor
   - Run: `SELECT * FROM projects;` (should only show own projects)

2. **Test in App:**
   - Login as one user
   - Create a project
   - Logout, login as different user
   - Should NOT see first user's project

## 📝 Create Tables (If Not Already Done)

```sql
-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  assigned_to UUID REFERENCES auth.users(id),
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Team members table (for collaboration)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Enable RLS on team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view team members of their projects"
  ON team_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = team_members.project_id 
      AND projects.user_id = auth.uid()
    )
  );
```

## 🚀 That's All!

Your Supabase setup is now secure with:
✅ Authentication enabled
✅ RLS policies protecting data
✅ Users can only access their own data
✅ Production-ready security

Just add your credentials to `.env.local` and you're done!
