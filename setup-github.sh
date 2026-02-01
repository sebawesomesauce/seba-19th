#!/bin/bash

# GitHub Pages Setup Script
# This script helps you set up the remote and push to GitHub

echo "🚀 Setting up GitHub Pages deployment..."
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

# Get repository name (default: seba-19th)
read -p "Enter repository name (default: seba-19th): " REPO_NAME
REPO_NAME=${REPO_NAME:-seba-19th}

echo ""
echo "Choose authentication method:"
echo "1) HTTPS (Personal Access Token)"
echo "2) SSH"
read -p "Enter choice (1 or 2): " AUTH_METHOD

if [ "$AUTH_METHOD" == "1" ]; then
    # HTTPS
    echo ""
    echo "📝 Setting up HTTPS remote..."
    git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git 2>/dev/null || git remote set-url origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

    echo ""
    echo "✅ Remote added!"
    echo ""
    echo "Next steps:"
    echo "1. Create the repository on GitHub: https://github.com/new"
    echo "   - Name: $REPO_NAME"
    echo "   - Don't initialize with README"
    echo ""
    echo "2. Get a Personal Access Token:"
    echo "   - Go to: https://github.com/settings/tokens"
    echo "   - Generate new token (classic)"
    echo "   - Select 'repo' scope"
    echo ""
    echo "3. Push your code:"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo "   (Use your GitHub username and the token as password)"

elif [ "$AUTH_METHOD" == "2" ]; then
    # SSH
    echo ""
    echo "📝 Setting up SSH remote..."
    git remote add origin git@github.com:$GITHUB_USERNAME/$REPO_NAME.git 2>/dev/null || git remote set-url origin git@github.com:$GITHUB_USERNAME/$REPO_NAME.git

    echo ""
    echo "✅ Remote added!"
    echo ""
    echo "Next steps:"
    echo "1. Create the repository on GitHub: https://github.com/new"
    echo "   - Name: $REPO_NAME"
    echo "   - Don't initialize with README"
    echo ""
    echo "2. Check if you have SSH key:"
    echo "   ls -la ~/.ssh/id_*.pub"
    echo ""
    echo "3. If no SSH key, generate one:"
    echo "   ssh-keygen -t ed25519 -C \"your-email@example.com\""
    echo "   cat ~/.ssh/id_ed25519.pub"
    echo "   (Copy and add to GitHub → Settings → SSH keys)"
    echo ""
    echo "4. Push your code:"
    echo "   git branch -M main"
    echo "   git push -u origin main"
fi

echo ""
echo "5. Enable GitHub Pages:"
echo "   - Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
echo "   - Source: Deploy from a branch"
echo "   - Branch: main, folder: / (root)"
echo "   - Your site will be at: https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
