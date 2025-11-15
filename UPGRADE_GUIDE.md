# GB Build Estimator v1.1 - Upgrade Guide

## 🎉 What's New in v1.1

### Visual Updates
✅ **New Color Theme**: Teal → Purple gradient (replacing old purple theme)
✅ **Modernized UI**: Updated buttons, headers, and accents

### Major Features
✅ **Admin Dashboard**: View, edit, and delete all builds via `/admin`
✅ **User Build History**: Each user gets a "My Builds" link to manage their builds
✅ **Edit Build Functionality**: Modify existing builds (admin: all builds, users: their builds)
✅ **Multiple Shell Selection**: Select 1-5 different shells with individual style/color choices
✅ **Multiple Button Sets**: Select 0-3 different button sets with individual style/color choices
✅ **Image Placeholder System**: Code ready for part images (hidden until you add URLs)

### Code Improvements
✅ **Clean Architecture**: Refactored for better readability
✅ **Fixed Warnings**: Removed unused variables
✅ **Better Comments**: Major sections documented
✅ **Modular Structure**: Easy to maintain and extend

---

## 📦 What's Included

### Updated Files
- `src/App.js` - Complete rewrite with all new features
- `src/App.css` - New teal/purple theme + admin/history styles
- `src/partsData.json` - Image URL placeholders added to all parts

### Backup Files (for reference)
- `src/App-v1.0-backup.js` - Your original v1.0 App.js
- `src/partsData.json.backup` - Your original partsData.json

### Documentation
- `UPGRADE_GUIDE.md` - This file
- `ADMIN_GUIDE.md` - How to use the admin dashboard
- `USER_GUIDE.md` - How users interact with the new features
- `CHANGELOG.md` - Detailed list of changes

---

## 🚀 How to Upgrade

### Step 1: Backup Your Current Version (Optional)
If you want to keep your v1.0 for reference:
```bash
cd C:\Projects\gb-build-estimator
cp -r . ../gb-build-estimator-v1.0-backup
```

### Step 2: Replace Files
1. **Download the v1.1 package**
2. **Extract it**
3. **Copy these files from the v1.1 package to your project:**
   - `src/App.js` (replace)
   - `src/App.css` (replace)
   - `src/partsData.json` (replace)

### Step 3: Test Locally
```bash
cd C:\Projects\gb-build-estimator
npm start
```

**Test checklist:**
- [ ] Site loads with teal/purple gradient
- [ ] Can create a build with multiple shells
- [ ] Can add multiple button sets
- [ ] Can save a build and get "My Builds" link
- [ ] "My Builds" link shows your builds
- [ ] Can edit a build from "My Builds"
- [ ] Admin dashboard loads at `/admin` (password: `admin123`)
- [ ] Admin can view/edit/delete all builds

### Step 4: Deploy
```bash
git add .
git commit -m "Upgraded to v1.1: Admin dashboard, multiple shells/buttons, user history"
git push
npm run deploy
```

Wait 2 minutes, then test the live site!

---

## 🔐 Admin Dashboard Access

### URL
`https://gaeromie.github.io/GB-Build-Estimator/admin`

### Password
`admin123`

**IMPORTANT**: To change the password, edit `src/App.js` line 8:
```javascript
const ADMIN_PASSWORD = 'admin123'; // Change this
```

Then redeploy.

---

## 👤 User Build History

### How It Works
1. When a user creates their first build, a unique `userId` is generated and stored in their browser's localStorage
2. They receive a "My Builds" link: `https://...my-builds/[userId]`
3. This link shows only THEIR builds
4. They can view, edit, or share any of their builds

### Important Notes
- **No account required** - Uses localStorage
- **Browser-specific** - If they clear cookies/data, they lose access
- **Shareable** - They can bookmark or share their "My Builds" link
- **Privacy** - Users can only see their own builds (admin sees all)

---

## 🎨 Multiple Shells/Buttons Feature

### How It Works

#### Shells
- User selects quantity (1-5)
- For each shell, they pick:
  1. Style (Soft Touch, Clear, Special)
  2. Specific color within that style
- Each shell costs $30
- Example: 2 shells = Pick Shell 1 (Clear → Atomic Purple) + Pick Shell 2 (Soft Touch → Black) = $60

#### Buttons
- User selects quantity (0-3)
- For each button set, they pick:
  1. Style (Included/Stock, Special, Standard)
  2. Specific color within that style
- Each button set costs $12
- Example: 1 button set = Pick (Special → Chameleon Green) = $12

### UI Flow
1. Select quantity
2. Form dynamically shows that many selection dropdowns
3. Each selection is independent (can be same or different)
4. Price updates live

---

## 🖼️ Image Placeholder System

### Current State
- All parts in `partsData.json` now have an `imageUrl` field
- Currently empty: `"imageUrl": ""`
- CSS class `.part-image` is set to `display: none`
- Code is ready to display images when URLs are added

### To Enable Images Later

#### Step 1: Add image URLs to `partsData.json`
```json
{
  "id": "soft-black",
  "name": "Black",
  "imageUrl": "https://example.com/images/soft-black.jpg"
}
```

#### Step 2: Update CSS in `App.css`
Change this:
```css
.part-image {
  display: none; /* Hidden until images are added */
  ...
}
```

To this:
```css
.part-image {
  display: inline-block; /* Now visible */
  ...
}
```

#### Step 3: Redeploy
```bash
git add .
git commit -m "Added part images"
git push
npm run deploy
```

Images will now display next to part names in dropdowns!

---

## 🔄 Migration Notes

### Data Structure Changes

#### v1.0 Build Structure:
```javascript
{
  buildName: "...",
  selections: { shell: "clear-atomic", ... },
  shellQuantity: 2,
  ...
}
```

#### v1.1 Build Structure:
```javascript
{
  buildName: "...",
  selections: { /* non-shell/button categories */ },
  shellSelections: [
    { subcategory: "Clear", choice: "clear-atomic" },
    { subcategory: "Soft Touch", choice: "soft-black" }
  ],
  buttonSelections: [
    { subcategory: "Special", choice: "buttons-special-chameleon-green" }
  ],
  userId: "user_...",
  ...
}
```

### Backward Compatibility
**Old builds will NOT display correctly in v1.1** because the data structure changed.

**Options:**
1. **Start fresh** - Delete old test builds from Firebase
2. **Migrate data** - Write a script to convert old builds (let me know if you need this)
3. **Dual support** - Keep v1.0 running alongside v1.1 (overkill)

**Recommendation**: Since you're still in development, just delete old test builds and start fresh with v1.1.

---

## 🐛 Known Issues / Limitations

1. **Old build links** - v1.0 builds won't render correctly (data structure mismatch)
2. **localStorage dependency** - Users lose "My Builds" link if they clear browser data
3. **No build names validation** - Users can create builds with the same name
4. **Admin password in code** - Not secure for production (fine for friend use)

None of these are blocking for your use case!

---

## 🎯 Testing Checklist

### Before Deploying
- [ ] Local site loads without errors
- [ ] Can create build with 1 shell
- [ ] Can create build with 3 shells (different styles)
- [ ] Can create build with 2 button sets
- [ ] Can create build with 0 buttons (optional)
- [ ] Price calculates correctly for multiple shells/buttons
- [ ] "My Builds" link works
- [ ] Can edit a build from "My Builds"
- [ ] Admin login works
- [ ] Admin can see all builds
- [ ] Admin can edit any build
- [ ] Admin can delete a build
- [ ] Teal/purple gradient displays correctly

### After Deploying
- [ ] Live site loads
- [ ] Create a build on live site
- [ ] "My Builds" link works on live site
- [ ] Share a build link with friend - they can view it
- [ ] Admin dashboard accessible at `/admin`
- [ ] Test on mobile device

---

## 🆘 Troubleshooting

### Site won't load after upgrade
- Clear browser cache
- Check browser console (F12) for errors
- Make sure all files were replaced correctly

### "My Builds" shows no builds
- Make sure you created a build AFTER upgrading to v1.1
- Check localStorage in browser dev tools (F12 → Application → Local Storage)
- Should see `gb_user_id` key

### Admin dashboard shows old password
- Make sure you edited line 8 in `src/App.js`
- Redeploy after changing password
- Clear browser cache

### Multiple shells not showing up
- Check that `shellSelections` array exists in Firebase
- Try creating a NEW build (old builds won't work)
- Check browser console for errors

### Prices seem wrong
- Double-check `pricePerUnit` in `partsData.json`
- Verify shell quantity is correct
- Check button quantity is correct
- Console.log the `calculateTotal()` function for debugging

---

## 📞 Need Help?

If something's not working:
1. Check this guide
2. Check browser console for errors (F12)
3. Check Firebase console for database errors
4. Let me know what's up!

---

## 🎉 You're Ready!

v1.1 is a massive upgrade. Take your time testing everything before sharing with friends. Once it's deployed, you'll have a professional-grade configurator!

**Next steps:**
1. Test locally
2. Deploy
3. Test live
4. Share with friends
5. Collect feedback for v1.2!
