# GB Build Estimator - Quick Start

## What You Have

A complete React web app for creating and sharing Game Boy build configurations with:
- Parts selection system (shells, screens, buttons, batteries, misc)
- Live price calculation
- Shareable build links
- Firebase backend for storage
- GitHub Pages deployment ready

---

## Next Steps (In Order)

### 1. Extract & Install (5 minutes)

```bash
# Extract the project
tar -xzf gb-build-estimator.tar.gz
cd gb-build-estimator

# Install dependencies
npm install
```

### 2. Test Locally (2 minutes)

```bash
npm start
```

- Opens at `http://localhost:3000`
- Create a test build to verify everything works
- Note: Saving won't work until you deploy (Firebase needs production URL)

### 3. Push to GitHub (2 minutes)

```bash
git init
git remote add origin https://github.com/Gaeromie/GB-Build-Estimator.git
git add .
git commit -m "Initial commit: GB Build Estimator"
git push -u origin main
```

### 4. Deploy to GitHub Pages (2 minutes)

```bash
npm run deploy
```

Wait 1-2 minutes, then visit:
**https://gaeromie.github.io/GB-Build-Estimator/**

### 5. Configure Firebase (3 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `gb-build-estimator`
3. Go to **Firestore Database** → **Rules**
4. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /builds/{buildId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['buildName', 'consoleType', 'selections', 'total', 'createdAt']);
      allow update, delete: if false;
    }
  }
}
```

5. Click **Publish**

---

## Done! 🎉

Your app is now live at: `https://gaeromie.github.io/GB-Build-Estimator/`

Test it:
1. Create a build
2. Share the link
3. Open in incognito/different browser

---

## Updating Parts/Pricing

Edit `src/partsData.json` → Commit → Push → `npm run deploy`

---

## Files Breakdown

- **src/App.js** - Main app logic
- **src/App.css** - Styling
- **src/partsData.json** - **THIS IS WHAT YOU'LL EDIT MOST**
- **src/firebase.js** - Firebase config (already set)
- **README.md** - Full documentation
- **DEPLOYMENT.md** - Detailed deployment guide

---

## Need Help?

1. Check **DEPLOYMENT.md** for detailed troubleshooting
2. Check **README.md** for full documentation
3. Browser console (F12) for errors

---

## What Works Right Now

✅ All parts from your spec (shells, screens, buttons, battery, speaker, misc)
✅ Nested selections (Style → Color)
✅ Multiple shell quantity
✅ Live price calculation
✅ Confirmation modal
✅ Shareable links
✅ Mobile responsive
✅ Firebase storage

## What You Can Add Later

- Interactive visual UI with hotspots
- Build history/management
- User authentication
- Export to PDF
- Admin panel for parts management
- More console types (GBC, GBA, etc.)

---

**Total setup time: ~15 minutes**

Ready to roll! 🎮
