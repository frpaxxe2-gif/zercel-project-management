# 🔍 Troubleshooting Deployment - Diagnostic Guide

## What's Not Working?

### Option A: Check GitHub Actions Status

1. Go to: **https://github.com/frpaxxe2-gif/zercel-project-management**
2. Click **Actions** tab (top menu)
3. Look for recent workflow runs
4. Click the latest run to see details
5. Expand "Deploy to InfinityFree via FTP" step
6. Look for error messages

**Common errors:**
- ❌ "server credentials empty" → Secrets not added
- ❌ "Connection refused" → FTP host is wrong
- ❌ "Authentication failed" → Username/password wrong
- ❌ "Permission denied" → Directory doesn't exist

### Option B: Manual Verification

Check if files actually uploaded to InfinityFree:

1. Go to **InfinityFree Control Panel**
2. Click **File Manager**
3. Navigate to `/public_html`
4. Look for your `index.html` file
5. If it's there but old: GitHub Actions might be working but uploading to wrong place
6. If it's NOT there: FTP upload is failing

---

## Diagnosis: 3 Possible Issues

### Issue 1: GitHub Secrets Not Added ❌

**Check:**
```
Go to GitHub → Settings → Secrets and variables → Actions
Should see 4 secrets listed:
  ✓ INF_HOST
  ✓ INF_USERNAME
  ✓ INF_PASSWORD
  ✓ INF_SERVER_DIR
```

**If missing:**
1. Add them all (see FTP_SETUP_GUIDE.md)
2. Push a new commit to trigger workflow
3. Watch GitHub Actions for success

### Issue 2: Wrong FTP Credentials ❌

**Check credentials with FileZilla:**
1. Download FileZilla (FTP client)
2. File → Site Manager
3. Add new site:
   - Host: Your INF_HOST value
   - Username: Your INF_USERNAME
   - Password: Your INF_PASSWORD
   - Port: 21
4. Click "Connect"

**If it fails:**
- Go back to InfinityFree control panel
- Double-check FTP credentials
- You might have multiple FTP accounts - use the right one
- Contact InfinityFree support if confused

**If it works:**
- Your credentials are correct
- Problem is GitHub Actions or workflow config

### Issue 3: Wrong Server Directory ❌

**Check which directory:**
1. Connect with FileZilla (see above)
2. Look at folder structure
3. Where is your current `index.html`?
4. Is it in `/htdocs`, `/public_html`, or somewhere else?

**Common directories:**
- InfinityFree: `/htdocs` or `/public_html`
- cPanel: `/public_html`
- Other hosts: varies

Set `INF_SERVER_DIR` to the correct path with trailing slash: `/htdocs/`

---

## Solution: Complete Setup from Scratch

Follow these steps **in order**:

### Step 1: Verify Build Works Locally
```bash
npm run build
ls dist/
# Should show: index.html, assets/, favicon.ico, example-prd.txt
```

### Step 2: Get FTP Credentials from InfinityFree
```
Go to InfinityFree Control Panel:
- Click domain
- Find FTP Accounts or Settings
- Copy:
  * FTP Host (e.g., ftpupload.net)
  * FTP Username (e.g., user@domain.com)
  * FTP Password (e.g., SecurePassword123)
  * Directory (e.g., /htdocs)
```

### Step 3: Test with FileZilla
```bash
# Download FileZilla from https://filezilla-project.org
# File → Site Manager → New Site

Host: [Your FTP Host]
Username: [Your FTP Username]
Password: [Your FTP Password]
Protocol: FTP
Port: 21

# Click Connect
# Should connect successfully
```

### Step 4: Add GitHub Secrets
Go to: GitHub → Settings → Secrets and variables → Actions

```
Add 4 secrets:

INF_HOST = [Your FTP Host]
INF_USERNAME = [Your FTP Username]
INF_PASSWORD = [Your FTP Password]
INF_SERVER_DIR = [Directory with trailing slash, e.g., /htdocs/]
```

### Step 5: Trigger Deployment
```bash
git add -A
git commit -m "deploy: trigger FTP upload"
git push
```

### Step 6: Monitor Workflow
1. Go to GitHub → Actions
2. Watch the workflow run
3. Wait for "Deploy to InfinityFree via FTP" step
4. Check result (green = success, red = failed)

### Step 7: Verify Files on Server
1. Go to InfinityFree File Manager
2. Check `/public_html` or `/htdocs`
3. Should see: `index.html`, `assets/` folder, `favicon.ico`
4. If there: Deployment worked!
5. If not: Check GitHub Actions error logs

---

## Manual Deployment (If GitHub Actions Fails)

If you can't get FTP working automatically, upload manually:

### Method 1: InfinityFree File Manager (Easiest)
```
1. Go to InfinityFree Control Panel
2. Click File Manager
3. Navigate to /public_html (or /htdocs)
4. Delete all old files
5. Click Upload
6. Select ALL files from /dist folder
7. Upload
8. Wait for completion
9. Verify on your domain
```

### Method 2: FileZilla (More Control)
```
1. Download & install FileZilla
2. Connect with FTP credentials
3. Navigate to /public_html on remote server
4. From local: Select /dist folder contents
5. Drag to remote folder
6. Wait for upload to complete
7. Verify all files transferred
```

---

## Verification After Upload

Visit your domain: **yourname.infinityfree.com**

Should see:
- ✅ Login page loads
- ✅ No 404 errors
- ✅ Can click buttons
- ✅ Responsive design works
- ✅ Console has no major errors

**If stuck on loading:**
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito window
- Check browser console for errors (F12)

**If 404 "Not Found":**
- Files didn't upload
- Check /public_html has index.html
- Verify correct directory was used
- Check InfinityFree document root setting

---

## Debug Checklist

- [ ] Local build works: `npm run build`
- [ ] `/dist` folder exists with files
- [ ] Can connect to FTP with FileZilla
- [ ] GitHub Secrets added (all 4)
- [ ] Can see file list in File Manager
- [ ] Domain loads without errors
- [ ] index.html is in public_html root

---

## Quick Fixes

| Symptom | Solution |
|---------|----------|
| "Connection refused" | Check FTP host, might be `ftpupload.net` not `infinityfree.net` |
| "Authentication failed" | Copy credentials exactly from InfinityFree (no extra spaces) |
| "Timeout" | Network issue - try again in a few minutes |
| Files disappeared | Wrong directory - check with File Manager |
| Old version showing | Clear browser cache or use incognito |
| Blank page | Check browser console (F12) for JS errors |

---

## Contact InfinityFree Support

If still stuck:
1. Go to InfinityFree control panel
2. Click "Contact Support"
3. Ask:
   - "What is my FTP host, username, and correct directory path?"
   - "How do I enable SFTP for more reliable uploads?"
   - "What is my document root directory?"

---

**After completing these steps, deployment should work!** 🚀

If you tell me what specific error you're seeing (from GitHub Actions or File Manager), I can help you fix it faster.
