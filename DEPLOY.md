# Deploying to GitHub Pages (Different Account)

## Step 1: Create a GitHub Repository

1. Log in to GitHub with the account you want to use
2. Go to https://github.com/new
3. Create a new repository named `seba-19th` (or any name you prefer)
4. **Don't** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Push Your Code

You have a few options:

### Option A: Use GitHub CLI (if installed)
```bash
cd /Users/leenadudi/seba-19th
gh auth login  # Login with your different GitHub account
gh repo create seba-19th --public --source=. --remote=origin --push
```

### Option B: Add Remote and Push Manually
```bash
cd /Users/leenadudi/seba-19th

# Add the remote (replace USERNAME with the GitHub username)
git remote add origin https://github.com/USERNAME/seba-19th.git

# If you need to authenticate with a different account:
# You can either:
# 1. Use a personal access token
# 2. Use SSH keys
# 3. Use GitHub Desktop

# Push to GitHub
git branch -M main
git push -u origin main
```

### Option C: Use Personal Access Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with `repo` permissions
3. When pushing, use the token as your password:
```bash
git remote add origin https://github.com/USERNAME/seba-19th.git
git push -u origin main
# Username: your-github-username
# Password: your-personal-access-token
```

### Option D: Use SSH (Recommended)
1. Generate SSH key if you don't have one:
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

2. Add SSH key to your GitHub account:
   - Copy the public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub → Settings → SSH and GPG keys → New SSH key
   - Paste the key

3. Add remote with SSH:
```bash
git remote add origin git@github.com:USERNAME/seba-19th.git
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select:
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
5. Click **Save**
6. Your site will be live at: `https://USERNAME.github.io/seba-19th/`

## Step 4: Custom Domain (Optional)

If you want a custom domain, add a `CNAME` file in the root with your domain name.

## Troubleshooting

- If pages don't update, wait a few minutes and check the Actions tab
- Make sure `index.html` is in the root directory
- Check that all files are committed and pushed
