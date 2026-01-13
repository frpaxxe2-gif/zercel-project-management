# AI Task Generation - Setup & Usage Guide

## 🚀 Overview

Your project now has **AI-powered task generation** that automatically parses Product Requirements Documents (PRD) or Technical Design Documents (TDD) and generates a complete task breakdown with:

- ✅ Epic grouping
- ✅ Dependency mapping
- ✅ Complexity estimates (1-24 hour ranges)
- ✅ Type classification (frontend/backend/devops/database/testing)
- ✅ Risk analysis
- ✅ Required skills per task

## 🔧 Setup (2 Steps)

### Step 1: Get an AI API Key

Choose **one** option:

#### **Option A: OpenRouter (Recommended for Development)**
- **Free tier available** with $5 monthly credits
- Supports Claude, GPT, and other models
- Great for prototyping

1. Go to https://openrouter.ai
2. Sign up and create an account
3. Go to **Settings → API Keys**
4. Copy your API key

Then in `.env.local`:
```env
VITE_OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxx
VITE_OPENROUTER_MODEL=claude-3.5-mini
```

#### **Option B: Anthropic Claude (Production)**
- **Pay-as-you-go** pricing (~$0.15 per task)
- Most reliable performance
- Dedicated support

1. Go to https://console.anthropic.com
2. Sign up and add payment method
3. Go to **API Keys**
4. Create a new key

Then in `.env.local`:
```env
VITE_CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxx
```

### Step 2: Verify Configuration

The app checks for API keys in this order:
1. `VITE_OPENROUTER_API_KEY` (if set, uses OpenRouter)
2. `VITE_CLAUDE_API_KEY` (if set, uses Claude API)
3. **No key?** The UI will show a helpful error message

## 📄 How to Use

### 1. **Navigate to Task Generator**
From the sidebar, click **"Task Generator"** (✨ icon)

Or go directly to: `http://localhost:5173/task-generator`

### 2. **Upload Your Document**
- Click **"Upload Document"** button
- Select your PRD or TDD file (`.txt`, `.md`, or `.pdf`)
- Choose document type (PRD vs TDD)
- The AI analyzes your document (5-15 seconds)

### 3. **Review Generated Tasks**
The interface shows:
- **Summary stats**: Total tasks, epics, selected count
- **Epics breakdown**: Major features or modules
- **Task list** with:
  - Title & description
  - Task type (frontend/backend/etc)
  - Complexity level
  - Estimated hours
  - Dependencies on other tasks

### 4. **Select Tasks to Create**
- Check/uncheck tasks as needed
- Count updates in real-time
- View risk warnings

### 5. **Select Target Project**
- Choose which project these tasks belong to
- Must have at least one project created

### 6. **Create Tasks**
- Click **"✅ Create X Tasks"**
- Tasks save to your database
- Success notification confirms

## 📋 Example Workflow

**Say you have this PRD:**
```
# Blog Platform Requirements

## Authentication System
- User registration with email
- Password reset via email
- OAuth with GitHub/Google

## Blog Features
- Create/edit/delete blog posts
- Markdown support
- Image uploads
- Draft/publish workflow
- Tagging system

## Admin Dashboard
- User management
- Content moderation
- Analytics dashboard
```

**AI will generate:**
- **5 epics**: Authentication, Blog Features, Admin Dashboard, etc.
- **20-30 tasks**: One for each feature
- **Dependencies**: Task B depends on Task A
- **Complexity**: 1-24 hour estimates
- **Skills**: Required React, Node.js, PostgreSQL, etc.

Then you can:
1. Review and adjust
2. Select which to create (maybe skip some)
3. Save to your project
4. Assign team members
5. Spawn Codespaces per task

## 🔄 Complete Feature Integration

After creating tasks, these features work together:

```
PRD Document
    ↓
AI Task Generation (← YOU ARE HERE)
    ↓
Tasks in Database
    ↓
Create GitHub Repo (ProjectSettings)
    ↓
Auto-create Task Branches (one per task)
    ↓
Spawn Codespace (per task)
    ↓
Develop & Create PR
    ↓
Update Task Status
```

## 🐛 Troubleshooting

### "No API key configured" error
- Check `.env.local` exists in project root
- Verify either `VITE_OPENROUTER_API_KEY` or `VITE_CLAUDE_API_KEY` is set
- Restart dev server: `npm run dev`

### "No projects found" error
- Create a project first in **Projects** page
- Must have at least one project to save tasks

### Document parsing fails
- Ensure document is plain text or valid Markdown
- PDF support available but text extraction varies
- Try uploading as `.txt` instead

### Tasks not appearing after creation
- Refresh the page (F5)
- Check **Projects** page for the project
- Check browser console for errors

## 📊 Data Structure

### AI Input → Output

```javascript
// User uploads: PRD/TDD document (text)
↓
// Claude/GPT analyzes and returns:
{
  "epics": [
    {
      "name": "Authentication",
      "description": "User login, signup, password reset",
      "priority": "critical"
    }
  ],
  "tasks": [
    {
      "title": "Implement user registration",
      "description": "Email-based registration with verification",
      "epic": "Authentication",
      "type": "backend",
      "priority": "critical",
      "estimatedComplexity": "medium",
      "dependencies": ["setup-email-service"],
      "requiredSkills": ["node.js", "postgresql", "email-service"],
      "suggestedOrder": 1
    }
  ],
  "summary": {
    "totalTasks": 25,
    "estimatedDuration": "4-6 weeks",
    "requiredTeamSize": "3-4 developers",
    "keyRisks": ["Complex email queue handling", "OAuth integration complexity"]
  }
}
↓
// Saved to database with project/user association
```

## 🎯 Best Practices

### Writing Better PRDs/TDDs

For best AI results:

1. **Be specific** - "Implement authentication" vs "Add login page with email/password, password reset, and Google OAuth"
2. **Include acceptance criteria** - What makes a feature "done"?
3. **List dependencies** - What needs to be built first?
4. **Mention tech stack** - "Using React, Node.js, PostgreSQL"
5. **Include constraints** - Budget, timeline, team size
6. **Add user stories** - "As a user, I want to..."

### Task Selection Tips

- **Critical path**: Select all tasks with no dependencies first
- **Team assignment**: Select by team size (spread work evenly)
- **Phase planning**: Create tasks in phases (foundation → features → polish)
- **Risk management**: Tackle high-risk tasks early

## 🚀 Next Steps

1. **Create a PRD** for your project
2. **Run Task Generator** to create tasks
3. **Create GitHub Repo** in ProjectSettings
4. **Spawn Codespaces** for team members
5. **Track Progress** via task status updates

---

**Feature Status**: ✅ Production Ready  
**Last Updated**: January 2026  
**AI Providers Supported**: Claude (Anthropic), GPT (OpenAI via OpenRouter)
