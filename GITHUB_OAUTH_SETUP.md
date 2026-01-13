# GitHub OAuth Setup Guide (via Supabase)

This document explains how to enable GitHub OAuth authentication for your ProjectHub application using Supabase's built-in GitHub provider.

## Overview

Supabase handles GitHub OAuth securely, allowing your application to:
- Authenticate users with their GitHub accounts
- Create repositories on behalf of authenticated users
- Create and manage branches for tasks
- Spawn GitHub Codespaces for isolated task environments

## Step 1: Enable GitHub Provider in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **GitHub** and toggle it **ON**

## Step 2: Create GitHub OAuth Application

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the form:
   - **Application name**: `ProjectHub`
   - **Homepage URL**: Your InfinityFree domain (e.g., `https://yourname.infinityfree.com`)
   - **Application description**: `Project management with AI-powered task orchestration`
   - **Authorization callback URL**: Use the URL provided by Supabase (see Step 3)

4. Click **Register application**

## Step 3: Get Supabase Callback URL

In Supabase, the GitHub provider page shows you the exact callback URL to use:

```
https://yourdomain.supabase.co/auth/v1/callback?provider=github
```

**Copy this URL and add it to your GitHub OAuth app settings.**

## Step 4: Add GitHub Credentials to Supabase

1. Back in Supabase Dashboard → **Authentication** → **Providers** → **GitHub**
2. Copy your GitHub app's:
   - **Client ID**
   - **Client Secret**
3. Paste both into Supabase
4. Click **Save**

## Step 5: Update Environment Variables

No frontend environment variables needed! Supabase handles everything.

If you were using `VITE_GITHUB_CLIENT_ID`, you can remove it.

## Connect via the Application

You can also connect GitHub from within the application via **Settings → Integrations → GitHub**. Clicking **Connect** will start the OAuth flow and redirect you to GitHub to authorize the app. After authorizing, you'll be redirected back to the app where the connection status will be shown in the Integrations settings.

## How It Works

1. User clicks **"Login with GitHub"** on your site
2. Your app calls `supabase.auth.signInWithOAuth({ provider: 'github' })`
3. User is redirected to GitHub to authorize
4. GitHub redirects back to `/auth/github/callback`
5. Supabase automatically creates/logs in the user
6. User is logged in to your app with GitHub data

## Using GitHub Service in Components

The `GitHubService` is already set up to work with authenticated users:

```javascript
import { useAuth } from '../context/useAuth';
import GitHubService from '../services/githubService';

export default function ProjectCreator() {
  const { user, githubService } = useAuth();

  const handleCreateRepo = async () => {
    try {
      const repo = await githubService.createRepository(
        'my-new-project',
        'My awesome project',
        false // public
      );
      console.log('Created repo:', repo);
    } catch (error) {
      console.error('Failed to create repo:', error);
    }
  };

  return (
    <button onClick={handleCreateRepo} disabled={!user}>
      Create GitHub Repo
    </button>
  );
}
```

## Getting GitHub Access Token

After GitHub OAuth login, Supabase stores the GitHub access token in the user's session. To use it with the GitHubService:

```javascript
// In your component or context
const session = await supabase.auth.getSession();
const githubToken = session.data.session?.provider_token;

if (githubToken) {
  const githubService = new GitHubService(githubToken);
  const user = await githubService.getUser();
}
```

## Available GitHubService Methods

- `getUser()` — Get authenticated user info
- `createRepository(name, description, isPrivate)` — Create a new repo
- `createBranch(owner, repo, branchName, fromBranch)` — Create a task branch
- `createCodespace(owner, repo, branch, machineType)` — Spawn a Codespace
- `createPullRequest(owner, repo, title, body, head, base)` — Create a PR
- `createIssue(owner, repo, title, body, labels, assignees)` — Create an issue
- `listRepositories(type, sort)` — List user's repos
- `getFileContent(owner, repo, path, ref)` — Read file from repo
- `createOrUpdateFile(owner, repo, path, content, message, branch)` — Create/update files

## Security

✅ **Supabase handles:**
- Client secret protection (never exposed to frontend)
- Token storage securely
- Session management
- CSRF protection

You don't need to worry about token exchange or backend OAuth logic.

## Troubleshooting

### "Provider is not enabled"
- Check Supabase Dashboard → Authentication → Providers
- Ensure GitHub provider toggle is ON

### "Invalid OAuth credentials"
- Verify GitHub Client ID & Secret are correct in Supabase
- Check GitHub app callback URL matches Supabase's URL exactly

### "Redirect URI mismatch"
- The callback URL must match exactly (including http/https, domain, port)
- Copy the exact URL from Supabase's provider settings

### "User not created"
- Supabase automatically creates users on first GitHub login
- Check `auth.users` table in Supabase

## Next Steps

1. ✅ Enable GitHub provider in Supabase
2. ✅ Create GitHub OAuth app
3. ✅ Add credentials to Supabase
4. ⏳ Test login flow locally
5. ⏳ Integrate GitHubService into task creation workflow
6. ⏳ Build PRD/TDD parser for AI task generation

---

**Resources:**
- [Supabase GitHub Provider](https://supabase.com/docs/guides/auth/social-login/auth-github)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Codespaces API](https://docs.github.com/en/rest/codespaces)
