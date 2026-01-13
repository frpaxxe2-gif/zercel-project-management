<div align="center">
  <h1><img src="https://project-management-gs.vercel.app/favicon.ico" width="20" height="20" alt="project-management Favicon">
   project-management</h1>
  <p>
    An open-source project management platform built with ReactJS and Tailwind CSS.
  </p>
  <p>
    <a href="https://github.com/GreatStackDev/project-management/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/GreatStackDev/project-management?style=for-the-badge" alt="License"></a>
    <a href="https://github.com/GreatStackDev/project-management/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome"></a>
    <a href="https://github.com/GreatStackDev/project-management/issues"><img src="https://img.shields.io/github/issues/GreatStackDev/project-management?style=for-the-badge" alt="GitHub issues"></a>
  </p>
</div>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## 📝 Features <a name="-features"></a>

- **🤖 AI Task Generation:** Automatically parse PRD/TDD documents and generate structured task lists with epics, dependencies, and complexity estimates using Claude or OpenAI
- **GitHub Integration:** Create repositories, manage branches, and spawn Codespaces directly from your project management interface
- **Multiple Workspaces:** Allow multiple workspaces to be created, each with its own set of projects, tasks, and members.
- **Project Management:** Manage projects, tasks, and team members with full GitHub synchronization.
- **Analytics:** View project analytics, including progress, completion rate, and team size.
- **Task Management:** Assign tasks to team members, set due dates, and track task status with automated GitHub branch creation.
- **User Management:** Invite team members, manage user roles, and view user activity.

## 🛠️ Tech Stack <a name="-tech-stack"></a>

- **Framework:** ReactJS
- **Styling:** Tailwind CSS
- **UI Components:** Lucide React for icons
- **State Management:** Redux Toolkit

## 🚀 Getting Started <a name="-getting-started"></a>

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the project root:

```bash
# Supabase (required for auth & database)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# GitHub OAuth (required for GitHub integration)
# Configure in Supabase Dashboard → Authentication → Providers → GitHub
VITE_GITHUB_CLIENT_ID=your-github-oauth-app-id

# AI Task Generation (optional, choose one):
# Option 1: OpenRouter (recommended for development)
VITE_OPENROUTER_API_KEY=sk-or-your-api-key-here
VITE_OPENROUTER_MODEL=claude-3.5-mini

# Option 2: Anthropic Claude (for production)
VITE_CLAUDE_API_KEY=sk-ant-your-api-key-here
```

**See detailed setup guides:**
- 🔐 [Supabase Setup](./SUPABASE_CREDENTIALS_SETUP.md)
- 🐙 [GitHub OAuth Setup](./GITHUB_OAUTH_SETUP.md)
- 🤖 [AI Task Generation Setup](./AI_TASK_GENERATION_SETUP.md)

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

### 4. Start Using
- 📊 Create projects and tasks
- 🤖 Use **Task Generator** to parse PRD/TDD documents
- 🐙 Connect GitHub to create repos and spawn Codespaces
- 👥 Invite team members and assign tasks

---

## 🤝 Contributing <a name="-contributing"></a>

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for more details on how to get started.

---

## 📜 License <a name="-license"></a>

This project is licensed under the MIT License. See the [LICENSE.md](./LICENSE.md) file for details.
