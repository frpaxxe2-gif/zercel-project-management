# Complete Platform Integration Guide

## 🎯 Your Platform Now Has 3 Main Features

### 1. 🤖 AI Task Generation
**What it does**: Automatically parse PRD/TDD documents and generate task breakdowns

**Navigate to**: Sidebar → "Task Generator" (✨ icon)

**How it works**:
```
Upload PRD → Claude/GPT analyzes → Review tasks → Select & create
```

**Setup**: See [AI_TASK_GENERATION_SETUP.md](./AI_TASK_GENERATION_SETUP.md)

---

### 2. 🐙 GitHub Integration  
**What it does**: Create repos, manage code, spawn Codespaces

**Features**:
- Create GitHub repository from project
- Auto-create branches per task
- Spawn Codespace development environments
- Assign Codespaces to team members

**Where to use**:
- **Create Repo**: Projects → ProjectSettings → "Create GitHub Repo"
- **Spawn Codespace**: Project Tasks → Click "Spawn Codespace"

**Setup**: See [GITHUB_OAUTH_SETUP.md](./GITHUB_OAUTH_SETUP.md)

---

### 3. 📊 Project Management
**What it does**: Manage projects, tasks, teams, and track progress

**Features**:
- Create/edit projects
- Organize tasks into epics
- Assign tasks to team members
- Track status (todo/in-progress/done)
- View analytics and progress

**Navigate to**: Sidebar → "Projects" or "Dashboard"

---

## 🔗 How They Work Together

### Complete Workflow Example

```
┌─────────────────────────────────────────────────────────────┐
│ 1. AI TASK GENERATION                                       │
├─────────────────────────────────────────────────────────────┤
│ Product Manager writes PRD:                                 │
│   "Build a blog platform with authentication,               │
│    blog features, admin dashboard, and analytics"           │
│                                                              │
│ → Upload to Task Generator                                  │
│ → AI generates 25+ structured tasks                         │
│ → Review: epics, dependencies, complexity                   │
│ → Select & save to project "BlogPlatform"                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. GITHUB SETUP                                             │
├─────────────────────────────────────────────────────────────┤
│ Tech Lead views project in ProjectSettings:                │
│   "BlogPlatform" - 25 tasks ready                           │
│                                                              │
│ → Click "Create GitHub Repo"                                │
│ → Repo created on GitHub with README                        │
│ → Auto-creates branches for each task:                      │
│    - task/1-setup-authentication                            │
│    - task/2-create-blog-model                               │
│    - task/3-build-admin-dashboard                           │
│    (etc.)                                                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. ASSIGN & DEVELOP                                         │
├─────────────────────────────────────────────────────────────┤
│ Team Lead assigns tasks to developers:                      │
│   Dev 1: Authentication (task/1)                            │
│   Dev 2: Blog Features (tasks/2-5)                          │
│   Dev 3: Admin Dashboard (tasks/6-8)                        │
│                                                              │
│ Each developer opens Project Tasks:                         │
│ → Sees "Spawn Codespace" button                             │
│ → Clicks button                                             │
│ → Codespace created on task branch                          │
│ → Opens VS Code in browser                                  │
│ → Starts coding immediately                                 │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. DEVELOPMENT & TRACKING                                   │
├─────────────────────────────────────────────────────────────┤
│ Developers work in Codespace:                               │
│   - Code in browser-based VS Code                           │
│   - Use GitHub Copilot (if enabled)                         │
│   - Commit and push changes                                 │
│                                                              │
│ Project Manager sees real-time updates:                     │
│   - Task status: In Progress → Done                         │
│   - Code review via GitHub PR comments                      │
│   - Analytics update with progress                          │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Setup Checklist

### ✅ Phase 1: Basic Setup (Required)
- [ ] Install dependencies: `npm install`
- [ ] Create `.env.local` with Supabase keys
- [ ] Run dev server: `npm run dev`
- [ ] Test basic project creation

### ✅ Phase 2: GitHub Integration
- [ ] Create GitHub OAuth App
- [ ] Add GitHub keys to Supabase
- [ ] Test "Connect GitHub" in Integrations
- [ ] Create a test repo from ProjectSettings

### ✅ Phase 3: AI Task Generation
- [ ] Get OpenRouter or Claude API key
- [ ] Add `VITE_OPENROUTER_API_KEY` or `VITE_CLAUDE_API_KEY` to `.env.local`
- [ ] Test Task Generator with sample PRD
- [ ] Create tasks from AI-generated list

### ✅ Phase 4: Team Setup
- [ ] Create projects in Projects page
- [ ] Invite team members in Team page
- [ ] Test task assignment
- [ ] Assign Codespaces to team

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Project overview & quick start |
| [AI_TASK_GENERATION_SETUP.md](./AI_TASK_GENERATION_SETUP.md) | AI setup & usage guide |
| [GITHUB_OAUTH_SETUP.md](./GITHUB_OAUTH_SETUP.md) | GitHub integration setup |
| [SUPABASE_COMPLETE_GUIDE.md](./SUPABASE_COMPLETE_GUIDE.md) | Database setup & schema |
| [AI_FEATURE_COMPLETE.md](./AI_FEATURE_COMPLETE.md) | Implementation summary |
| [TASK_GENERATOR_GUIDE.md](./TASK_GENERATOR_GUIDE.md) | Task generation internals |

---

## 🎮 UI Navigation Map

```
Login/Signup (via GitHub OAuth)
    ↓
┌─ Dashboard (📊)
│   └─ View workspace overview
│       └─ See recent tasks & projects
│
├─ Projects (📁)
│   ├─ View all projects
│   ├─ Click project → Project Details
│   │   ├─ Tasks (table view)
│   │   │   └─ Click task → Task Details
│   │   │   └─ "Spawn Codespace" button
│   │   │
│   │   ├─ Kanban Board (drag & drop)
│   │   │   └─ Organize by status
│   │   │
│   │   ├─ Calendar (timeline view)
│   │   │   └─ See due dates
│   │   │
│   │   ├─ Analytics (charts)
│   │   │   └─ Progress, team stats
│   │   │
│   │   └─ Settings
│   │       └─ "Create GitHub Repo" button
│   │       └─ Add team members
│   │
│   └─ Create new project
│
├─ Task Generator (✨) [NEW!]
│   ├─ Click "Upload Document"
│   ├─ Select PRD/TDD file
│   ├─ Review AI-generated tasks
│   ├─ Select tasks to create
│   └─ Save to project
│
├─ Team (👥)
│   ├─ View team members
│   ├─ Invite members
│   └─ Manage roles
│
└─ Settings (⚙️)
    ├─ Integrations
    │   ├─ GitHub (Connect/Disconnect)
    │   ├─ Supabase (info only)
    │   └─ Other integrations
    └─ User profile
```

---

## 💡 Pro Tips

### For Product Managers
1. Write detailed PRD in Markdown or plain text
2. Include: epics, features, acceptance criteria, constraints
3. Upload to Task Generator
4. Review AI suggestions before team sees them
5. Export task list for stakeholder review

### For Tech Leads
1. Create GitHub repo from ProjectSettings
2. Review auto-created task branches
3. Assign tasks to developers
4. Monitor progress via Project Analytics
5. Track time estimates vs. actuals

### For Developers
1. Click "Spawn Codespace" to start working
2. Develop in browser-based VS Code
3. Use GitHub Copilot for suggestions
4. Commit frequently to task branch
5. Create PR when done
6. Update task status when merging

### For Team Managers
1. Create workspace for each project
2. Invite team members with roles
3. View Team page for activity
4. Check Analytics for insights
5. Adjust timeline based on progress

---

## 🚀 Next Features (Roadmap)

Potential enhancements:

- [ ] Slack notifications on task updates
- [ ] Discord integration for team chat
- [ ] GitHub PR auto-linking to tasks
- [ ] Automatic task closure on PR merge
- [ ] Time tracking per task
- [ ] Burndown charts
- [ ] Sprint planning tools
- [ ] Custom task workflows
- [ ] API for external integrations
- [ ] Mobile app

---

## 🆘 Troubleshooting

### "Task Generator shows 'No API key configured'"
→ Add `VITE_OPENROUTER_API_KEY` or `VITE_CLAUDE_API_KEY` to `.env.local`  
→ Restart dev server with `npm run dev`

### "Can't create GitHub repo"
→ Go to Settings → Integrations → Click GitHub "Connect"  
→ Verify GitHub OAuth is configured in Supabase

### "Codespace button is grayed out"
→ Project must have repo_owner and repo_name set  
→ Create repo first in ProjectSettings

### "Tasks not saving to database"
→ Verify Supabase credentials in `.env.local`  
→ Check browser console for database errors  
→ Ensure RLS policies allow task creation

### "Can't upload document to Task Generator"
→ Ensure file is plain text, Markdown, or PDF  
→ Try smaller document (< 50KB)  
→ Check browser console for specific error

---

## 📞 Support

- **Documentation**: See files listed above
- **GitHub Issues**: Create issue on GitHub
- **Discord**: Join community (if available)
- **Email**: Contact maintainers

---

**Status**: ✅ Production Ready  
**Last Updated**: January 2026  
**Version**: 1.0.0
