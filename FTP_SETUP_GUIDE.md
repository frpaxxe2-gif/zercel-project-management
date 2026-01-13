# 🔧 Fix FTP Deployment - GitHub Secrets Setup

## Problem
The GitHub Actions workflow tries to deploy to InfinityFree but **fails silently** because GitHub Secrets are not configured.

## Solution: Add GitHub Secrets

### Step 1: Get InfinityFree FTP Credentials

1. **Go to** https://www.infinityfree.net
2. **Login** to your account
3. **Click** your domain/account
4. **Go to** "FTP Accounts" or "FTP Settings"
5. **Find or create an FTP account** with credentials:
   - FTP Hostname (usually `ftpupload.net`)
   - FTP Username
   - FTP Password
   - Remote directory (usually `/htdocs` or `/public_html`)

**Example FTP credentials:**
```
Host: ftpupload.net
Username: your-username@yoursite
Password: your-ftp-password
Directory: /htdocs
```

### Step 2: Add GitHub Secrets

1. **Go to** https://github.com/frpaxxe2-gif/zercel-project-management
2. **Click** Settings (top menu)
3. **Click** "Secrets and variables" → "Actions" (left sidebar)
4. **Click** "New repository secret"

Add these secrets **one by one**:

#### Secret 1: INF_HOST
- **Name:** `INF_HOST`
- **Value:** `ftpupload.net` (or your FTP host)
- **Click** "Add secret"

#### Secret 2: INF_USERNAME
- **Name:** `INF_USERNAME`
- **Value:** Your FTP username (e.g., `user@yourdomain.com`)
- **Click** "Add secret"

#### Secret 3: INF_PASSWORD
- **Name:** `INF_PASSWORD`
- **Value:** Your FTP password
- **Click** "Add secret"

#### Secret 4: INF_SERVER_DIR
- **Name:** `INF_SERVER_DIR`
- **Value:** `/htdocs` (or `/public_html` - check with InfinityFree)
- **Click** "Add secret"

### Step 3: Verify Secrets Are Added

1. In GitHub Secrets page, you should see:
   ```
   ✓ INF_HOST
   ✓ INF_USERNAME
   ✓ INF_PASSWORD
   ✓ INF_SERVER_DIR
   ```

### Step 4: Test Deployment

1. **Make a small change** to code (e.g., add a comment)
2. **Commit and push:**
   ```bash
   git add -A
   git commit -m "test: trigger deployment"
   git push
   ```

3. **Watch GitHub Actions:**
   - Go to your repo → "Actions" tab
   - You should see a workflow running
   - It will:
     - Install dependencies
     - Run `npm run build`
     - Upload `dist/` to InfinityFree via FTP

4. **Check the logs:**
   - If successful: ✅ "Deploy to InfinityFree via FTP" shows "Success"
   - If failed: 🔴 Shows error message (likely credential issue)

---

## Troubleshooting

### ❌ "FTP Deploy failed"
**Solutions:**
- Double-check FTP credentials are **exactly correct**
- Try connecting manually with FileZilla to verify credentials work
- Check if InfinityFree account is active

### ❌ "Timeout connecting to server"
**Solutions:**
- Verify FTP host is correct (`ftpupload.net`)
- Check if InfinityFree FTP is enabled in control panel
- Try port 21 (FTP) instead of 990 (FTPS)

### ❌ "Directory not found"
**Solutions:**
- Verify `INF_SERVER_DIR` is correct (`/htdocs` or `/public_html`)
- Create the directory manually if needed
- Ask InfinityFree support which directory to use

### ✅ "Deployment successful but site doesn't show changes"
**Solutions:**
- Clear your browser cache (Ctrl+Shift+Delete)
- Check if `index.html` was uploaded to root
- Verify file permissions (644 for files, 755 for folders)

---

## Manual Deployment (If GitHub Actions Fails)

If you can't get FTP working, deploy manually:

### Using InfinityFree File Manager
1. Go to InfinityFree control panel
2. Click "File Manager"
3. Navigate to `/public_html`
4. Delete all old files
5. Upload all files from `/dist` folder

### Using FileZilla
1. Download FileZilla (ftp client)
2. Connect with FTP credentials
3. Navigate to `/public_html`
4. Drag `/dist` files to remote folder

---

## Verification Checklist

- [ ] GitHub Secrets added (all 4)
- [ ] Secrets are visible in GitHub Settings
- [ ] FTP credentials tested manually (connect with FileZilla)
- [ ] `dist/` folder exists locally after `npm run build`
- [ ] Latest commit shows in GitHub
- [ ] GitHub Actions workflow runs without errors
- [ ] Files appear in InfinityFree `/public_html`
- [ ] Domain shows your app (not "Not Found")

---

## Quick Reference

**GitHub Actions Workflow:** `.github/workflows/deploy-infinityfree.yml`

**What it does:**
1. Checks out latest code
2. Installs dependencies
3. Builds with `npm run build`
4. Uploads `dist/` to InfinityFree via FTP

**Triggered by:** Every push to `main` branch

**Status:** Check GitHub Actions tab after each push

---

## Still Having Issues?

1. **Check GitHub Actions logs:**
   - Go to repo → Actions tab
   - Click the failed/running workflow
   - Scroll down to see error details

2. **Test FTP manually:**
   - Download FileZilla
   - Enter FTP credentials
   - Try connecting
   - Try uploading a test file

3. **Contact InfinityFree Support:**
   - Verify FTP host and directory
   - Ask about FTPS vs FTP
   - Check if FTP needs to be enabled

---

Once secrets are added, automatic deployment is **fully automatic** - just push to main and watch it deploy! 🚀
