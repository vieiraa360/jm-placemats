# Fix: Git Push Error "src refspec main does not match any"

## The Problem
You got this error because you tried to push before making any commits. Git needs at least one commit to create a branch.

## Solution

Run these commands in order:

```bash
# 1. Add all files to staging
git add .

# 2. Create your first commit
git commit -m "Initial commit: JM Placemats e-commerce site with Stripe integration"

# 3. Now push (the main branch will exist after the commit)
git push -u origin main
```

## If You Still Get Errors

### Error: "remote origin already exists"
If you already added the remote, you can skip `git remote add origin` and just push:

```bash
git push -u origin main
```

### Error: Authentication required
GitHub requires authentication. You'll need either:

**Option A: Personal Access Token**
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic) with `repo` permissions
3. When pushing, use your GitHub username and the token as password

**Option B: Use GitHub CLI**
```bash
gh auth login
git push -u origin main
```

**Option C: Use SSH**
```bash
git remote set-url origin git@github.com:vieiraa360/jm-placemats.git
git push -u origin main
```

## Quick Fix Script

Run this in PowerShell:

```powershell
cd C:\Users\helde\Documents\jm-placemats
git add .
git commit -m "Initial commit: JM Placemats e-commerce site with Stripe integration"
git push -u origin main
```
