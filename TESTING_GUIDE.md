# 🎯 How to Test All Features

## Quick Start (No API Keys Needed!)

### 1. Enable Demo Mode
Edit `.env.local`:
```env
VITE_DEMO_MODE=true
```

Restart dev server:
```bash
npm run dev
```

### 2. Test Task Generator
1. Navigate to **Sidebar → Task Generator**
2. Click **"Upload Document"**
3. Upload `/public/example-prd.txt` or any text file
4. Watch AI generate sample tasks (demo data)
5. Select tasks and click **"Create X Tasks"** to save

**✅ What works:**
- Upload dialog opens
- Preview shows file content
- Demo data generates instantly
- Tasks are selectable
- Can create tasks to database

---

## Full Testing with Real AI

### 1. Get API Key (Choose One)

#### OpenRouter (Recommended)
- Go to https://openrouter.ai
- Sign up (free $5 credits)
- Get API key from Settings → API Keys

#### Claude (Anthropic)
- Go to https://console.anthropic.com
- Create account + add payment
- Create API key

### 2. Configure .env.local
```env
# Option A: OpenRouter
VITE_OPENROUTER_API_KEY=sk-or-v1-...
VITE_OPENROUTER_MODEL=claude-3.5-mini
VITE_DEMO_MODE=false

# OR Option B: Claude
VITE_CLAUDE_API_KEY=sk-ant-...
VITE_DEMO_MODE=false
```

### 3. Restart and Test
```bash
npm run dev
```

Go to Task Generator and upload a document. AI will analyze it and generate real tasks!

---

## Feature Checklist

### ✅ Sidebar Menu
- [ ] Dashboard visible
- [ ] Projects visible
- [ ] **Task Generator visible** (✨ icon)
- [ ] Team visible

### ✅ Task Generator Page
- [ ] "Upload Document" button appears
- [ ] Help notice shows setup instructions
- [ ] Download example PRD link works
- [ ] Upload dialog opens

### ✅ Document Upload Dialog
- [ ] Can select PRD or TDD type
- [ ] File picker shows preview
- [ ] "Generate Tasks" button works
- [ ] Loading spinner shows during processing

### ✅ Task Review & Creation
- [ ] Generated tasks display with:
  - [ ] Title & description
  - [ ] Type (frontend/backend/etc)
  - [ ] Complexity tags
  - [ ] Estimated hours
  - [ ] Dependencies
- [ ] Checkboxes work to select/deselect tasks
- [ ] Project dropdown loads user's projects
- [ ] "Create Tasks" button creates tasks in database

### ✅ GitHub Integration
- [ ] Login/Signup with GitHub works
- [ ] Settings → Integrations shows GitHub status
- [ ] "Connect GitHub" button available
- [ ] ProjectSettings shows "Create GitHub Repo" button
- [ ] ProjectTasks shows "Spawn Codespace" buttons

---

## Testing Scenarios

### Scenario 1: Demo Mode (No API Key)
1. Set `VITE_DEMO_MODE=true`
2. Upload any text file
3. See sample tasks generated
4. Create tasks to database
5. ✅ Works without AI API key

### Scenario 2: Real AI (With API Key)
1. Set `VITE_DEMO_MODE=false`
2. Add API key to `.env.local`
3. Upload detailed PRD
4. Watch AI analyze and generate tasks
5. Create tasks from AI output
6. ✅ Real AI-powered task generation

### Scenario 3: GitHub Integration
1. Login with GitHub OAuth
2. Go to ProjectSettings
3. Click "Create GitHub Repo"
4. See repo created on GitHub
5. ✅ Repo creation works

### Scenario 4: Team Features
1. Create a project
2. Go to ProjectSettings → Team Members
3. Invite a team member
4. Assign tasks
5. ✅ Team collaboration works

---

## Error Messages & Solutions

| Error | Solution |
|-------|----------|
| "No AI API key configured" | Set `VITE_OPENROUTER_API_KEY` or `VITE_CLAUDE_API_KEY` in `.env.local` |
| "Invalid API key" | Check key is correct, try getting new key |
| "No projects found" | Create a project in Projects page first |
| "GitHub not connected" | Login with GitHub in Settings → Integrations |
| Document upload fails | Try with plain .txt file instead of PDF |

---

## Dev Mode Test

Run dev server to see live changes:
```bash
npm run dev
```

Browser opens at: http://localhost:5173

Hot reload enabled - edit files and see changes instantly!

---

## Production Build Test

Build for deployment:
```bash
npm run build
```

Output goes to `/dist` folder (~1.2MB)

Ready to deploy to InfinityFree!

---

## Quick Command Reference

```bash
# Start development
npm run dev

# Build for production
npm run build

# View dist output
ls -lh dist/

# Check git status
git status

# View recent commits
git log --oneline -5

# Push to GitHub
git push
```

---

**All buttons are now working!** 🎉

- ✅ Upload Document button
- ✅ Task Generator button
- ✅ Create GitHub Repo button
- ✅ Spawn Codespace button
- ✅ Connect GitHub button

Each button has proper error handling and user feedback.
