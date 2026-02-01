# Create Repository and Push - Step by Step

## Step 1: Create Repository on GitHub

1. **Go to:** https://github.com/new
2. **Repository name:** `seba-19th`
3. **Description:** (optional) "Birthday website with crossword and connections game"
4. **Visibility:** Public (required for free GitHub Pages)
5. **IMPORTANT:**
   - ❌ Do NOT check "Add a README file"
   - ❌ Do NOT add .gitignore
   - ❌ Do NOT choose a license
   - Leave everything unchecked!
6. Click **"Create repository"**

## Step 2: Get Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Note:** Give it a name like "seba-19th-pages"
4. **Expiration:** Choose how long you want (90 days, 1 year, etc.)
5. **Select scopes:** Check the box for **`repo`** (this gives full repository access)
6. Scroll down and click **"Generate token"**
7. **COPY THE TOKEN NOW** - you won't see it again! It looks like: `ghp_xxxxxxxxxxxxxxxxxxxx`

## Step 3: Push Your Code

Run these commands:

```bash
cd /Users/leenadudi/seba-19th
git push -u origin main
```

When prompted:
- **Username:** `sebawesomesauce`
- **Password:** Paste your personal access token (the `ghp_...` token, NOT your GitHub password)

## Step 4: Enable GitHub Pages

1. Go to: https://github.com/sebawesomesauce/seba-19th/settings/pages
2. Under **"Source"**:
   - **Branch:** Select `main`
   - **Folder:** Select `/ (root)`
3. Click **"Save"**
4. Wait 1-2 minutes

## Your Site Will Be Live At:

🌐 **https://sebawesomesauce.github.io/seba-19th/**

---

## Troubleshooting

**If push fails:**
- Make sure you created the repository first
- Make sure you're using the token as password (not your GitHub password)
- Check that the token has `repo` scope

**If Pages doesn't work:**
- Make sure the repository is Public
- Wait a few minutes for GitHub to build
- Check the Actions tab for any errors
