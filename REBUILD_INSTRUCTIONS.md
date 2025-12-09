# How to Rebuild Frontend - Simple Steps

## What You Need to Delete

**Only delete the `dist/` folder** - this is the build output.

**Do NOT delete:**
- ❌ `node_modules/` - Not needed, will slow you down
- ❌ `package-lock.json` - Not needed, will require reinstalling
- ❌ Any other files

## Simple Rebuild Steps

### Step 1: Delete Only the Build Folder

```bash
cd C:\Users\helde\Documents\jm-placemats
rmdir /s /q dist
```

That's it! Just the `dist/` folder.

### Step 2: Rebuild

```bash
npm run build
```

This will:
- Read your source code
- Read `.env.production`
- Create a new `dist/` folder with the updated code

### Step 3: Deploy

Upload the new `dist/` folder to your hosting.

## Why You Don't Need to Delete node_modules

- `node_modules/` contains your dependencies (React, Vite, etc.)
- These don't change when you rebuild
- Deleting them would require running `npm install` again (waste of time)
- The build process only uses source code, not node_modules directly

## Why You Don't Need to Delete package-lock.json

- `package-lock.json` locks dependency versions
- It's only needed when installing/updating packages
- Not needed for building
- Deleting it could cause version mismatches

## When You WOULD Delete node_modules

Only delete `node_modules/` if:
- You're having dependency issues
- You updated `package.json`
- You're troubleshooting installation problems

**For a normal rebuild, you don't need to touch it.**

## Quick Rebuild Command

```bash
# Just these two commands:
rmdir /s /q dist
npm run build
```

That's all you need!

## What Gets Rebuilt

When you run `npm run build`:
1. Vite reads your source files (`src/`)
2. Vite reads `.env.production`
3. Vite compiles everything into `dist/`
4. The new `dist/` folder has your updated code

The `node_modules/` and `package-lock.json` are not involved in this process.

## Verification

After rebuilding:

```bash
# Check the new build doesn't have :3000
findstr /s /i "api.jm-placemats.com:3000" dist\assets\*.js
# Should find nothing

# Check it has the correct URL
findstr /s /i "api.jm-placemats.com" dist\assets\*.js | findstr /v "localhost"
# Should find the URL without port
```

## Summary

**Delete:** Only `dist/` folder
**Keep:** Everything else (node_modules, package-lock.json, etc.)
**Rebuild:** `npm run build`
**Deploy:** Upload new `dist/` folder

Simple as that! 🎉
