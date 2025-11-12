# Deployment Guide for GB Build Estimator

## Quick Start Checklist

- [x] GitHub repo created
- [x] Firebase project set up
- [x] Firebase config added to code
- [ ] Code pushed to GitHub
- [ ] App deployed to GitHub Pages
- [ ] Firebase security rules configured

---

## Step 1: Push Code to GitHub

Since your repo is already created at `https://github.com/Gaeromie/GB-Build-Estimator.git`, you just need to push the code.

### Commands to run (from the project directory):

```bash
# Initialize git (if not already done)
git init

# Add your GitHub repo as remote
git remote add origin https://github.com/Gaeromie/GB-Build-Estimator.git

# Add all files
git add .

# Commit
git commit -m "Initial commit: GB Build Estimator app"

# Push to main branch
git push -u origin main
```

If you get an error about the branch name, use:
```bash
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to GitHub Pages

Once code is pushed to GitHub:

```bash
npm run deploy
```

This will:
1. Build the production version
2. Create/update the `gh-pages` branch
3. Deploy to GitHub Pages

**Expected output:**
```
Published
```

---

## Step 3: Enable GitHub Pages (First Time Only)

1. Go to: `https://github.com/Gaeromie/GB-Build-Estimator/settings/pages`
2. Under "Source", select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
3. Click **Save**
4. Wait 1-2 minutes for deployment

Your app will be live at:
**https://gaeromie.github.io/GB-Build-Estimator/**

---

## Step 4: Configure Firebase Security Rules

Your Firestore database currently has test mode rules that expire. Update them for production:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `gb-build-estimator`
3. Navigate to: **Firestore Database** → **Rules**
4. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /builds/{buildId} {
      // Allow anyone to read builds (for sharing links)
      allow read: if true;
      
      // Allow anyone to create builds
      // Consider adding rate limiting or authentication later
      allow create: if request.resource.data.keys().hasAll(['buildName', 'consoleType', 'selections', 'total', 'createdAt'])
                    && request.resource.data.buildName is string
                    && request.resource.data.buildName.size() > 0
                    && request.resource.data.buildName.size() < 100;
      
      // No updates or deletes for now
      allow update, delete: if false;
    }
  }
}
```

5. Click **Publish**

---

## Step 5: Test the Deployment

1. Visit: `https://gaeromie.github.io/GB-Build-Estimator/`
2. Create a test build:
   - Build name: "Test Build"
   - Select parts
   - Complete build
3. Verify you get a shareable link
4. Test the link in a new browser/incognito window

---

## Updating the App (Future Changes)

### To update parts or prices:

1. Edit `src/partsData.json`
2. Commit and push:
   ```bash
   git add src/partsData.json
   git commit -m "Updated parts/pricing"
   git push
   ```
3. Redeploy:
   ```bash
   npm run deploy
   ```

### To update app code:

1. Make your changes
2. Test locally: `npm start`
3. Commit and push:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. Deploy:
   ```bash
   npm run deploy
   ```

---

## Troubleshooting

### "Permission denied" when pushing to GitHub

Run:
```bash
git remote set-url origin https://github.com/Gaeromie/GB-Build-Estimator.git
```
Then try pushing again. You may need to authenticate with GitHub.

### GitHub Pages shows 404

- Wait 2-3 minutes after deployment
- Check that `gh-pages` branch exists
- Verify GitHub Pages is enabled and pointing to `gh-pages` branch
- Clear browser cache

### Builds not saving

- Check Firebase console for errors
- Verify security rules are published
- Check browser console (F12) for Firebase errors
- Ensure Firebase config is correct in `src/firebase.js`

### App works locally but not on GitHub Pages

- Ensure `homepage` in `package.json` matches your GitHub repo
- Check browser console for path/routing errors
- Verify `basename` in `src/index.js` matches repo name

---

## Production Checklist

Before sharing with users:

- [ ] Test creating a build
- [ ] Test sharing a link
- [ ] Test viewing a shared build
- [ ] Verify all part categories work
- [ ] Check pricing calculations
- [ ] Test on mobile device
- [ ] Confirm Firebase rules are set
- [ ] Test link sharing with a friend

---

## Next Steps / Enhancements

Consider adding:
1. **Authentication**: Google Sign-In for build management
2. **Build History**: See all your previous builds
3. **Edit Builds**: Update saved builds
4. **Delete Builds**: Remove old builds
5. **Admin Panel**: Manage parts without editing JSON
6. **Analytics**: Track popular parts/builds
7. **Export**: Download build as PDF
8. **Images**: Add part images to selections

---

## Support

If you run into issues:
1. Check the README troubleshooting section
2. Check browser console for errors
3. Check Firebase console for database issues
4. Verify all configuration files are correct

## Files to Keep Up to Date

- `src/partsData.json` - Parts catalog and pricing
- `README.md` - Documentation
- `src/firebase.js` - Firebase config (already set)

---

Good luck with your GB builds! 🎮
