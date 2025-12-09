# Push Code to GitHub

## Step 1: Initialize Git (if not already done)

```bash
cd c:\Users\helde\Documents\jm-placemats
git init
```

## Step 2: Add All Files

```bash
git add .
```

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: JM Placemats e-commerce site with Stripe integration"
```

## Step 4: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `jm-placemats`)
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Copy the repository URL (e.g., `https://github.com/yourusername/jm-placemats.git`)

## Step 5: Add Remote and Push

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/jm-placemats.git

# Rename default branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Alternative: If Repository Already Exists

If you already have a GitHub repository:

```bash
# Check current remotes
git remote -v

# Add or update remote
git remote set-url origin https://github.com/yourusername/jm-placemats.git

# Push
git push -u origin main
```

## Important: Files That Won't Be Pushed

These files are in `.gitignore` and won't be committed:
- `.env` files (contains sensitive API keys)
- `node_modules/` (dependencies)
- `dist/` (build output)
- Cloudflare tunnel configs

## If You Get Authentication Errors

If GitHub asks for authentication:

1. **Use Personal Access Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate a new token with `repo` permissions
   - Use the token as your password when pushing

2. **Or use SSH:**
   ```bash
   git remote set-url origin git@github.com:yourusername/jm-placemats.git
   ```

## Quick One-Liner (After Creating GitHub Repo)

```bash
git init && git add . && git commit -m "Initial commit" && git branch -M main && git remote add origin https://github.com/yourusername/jm-placemats.git && git push -u origin main
```

Replace `yourusername` with your GitHub username!
