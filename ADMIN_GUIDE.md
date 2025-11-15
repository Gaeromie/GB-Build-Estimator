# Admin Dashboard Guide

## 🔐 Accessing the Admin Dashboard

### URL
```
https://gaeromie.github.io/GB-Build-Estimator/admin
```

### Password
```
admin123
```

**To change password**: Edit `src/App.js` line 8, then redeploy.

---

## 📊 Admin Dashboard Features

### Overview
The admin dashboard gives you full control over ALL builds in the system. You can:
- View all builds in a table
- See build details (name, console, total, date)
- View any build
- Edit any build
- Delete any build
- Copy shareable links

---

## 🎛️ Dashboard Interface

### Main Table
The dashboard displays all builds in a table with these columns:
- **Build Name** - User-provided name
- **Console** - Console type (e.g., GBA SP)
- **Total** - Final price
- **Created** - Date created
- **Actions** - Buttons for each build

### Action Buttons

#### 1. **View** (Teal button)
- Opens the build in view-only mode
- See all selected parts and total
- Same view users see when they open a shareable link

#### 2. **Edit** (Orange button)
- Loads the build into the form
- Modify any part selections
- Change build name, shells, buttons, etc.
- Click "Update Build" to save changes

**Note**: Editing updates the build - users will see the changes when they open their link!

#### 3. **Delete** (Red button)
- Permanently removes the build from Firebase
- Confirmation prompt before deleting
- **Warning**: Cannot be undone!
- User's shareable link will show "Build not found" after deletion

#### 4. **Copy Link** (Purple button)
- Copies the shareable build link to clipboard
- Shows "Link copied!" alert
- Useful for quickly sharing builds

---

## 🔄 Common Admin Tasks

### Viewing All Builds
1. Log in to admin dashboard
2. Scroll through the table
3. Builds are sorted by newest first

### Editing a User's Build
1. Find the build in the table
2. Click **Edit** (orange button)
3. Form loads with all current selections
4. Make your changes
5. Click **Update Build**
6. User will see updated build when they open their link

### Deleting Test/Spam Builds
1. Find the build to delete
2. Click **Delete** (red button)
3. Confirm deletion
4. Build is permanently removed

### Sharing a Build Link
1. Find the build
2. Click **Copy Link** (purple button)
3. Paste link wherever needed

---

## 💡 Admin Tips

### Keyboard Shortcuts
- Press `Ctrl+F` (Windows) or `Cmd+F` (Mac) to search the page for specific build names

### Sorting
- Builds are automatically sorted newest → oldest
- Can't change sort order (yet)

### Bulk Operations
- Currently need to edit/delete one at a time
- Let me know if you need batch operations!

### Monitoring New Builds
- Refresh the page to see newly created builds
- No auto-refresh yet

---

## ⚠️ Important Notes

### Security
- **Password in code**: The admin password is hardcoded in `App.js`
- **Fine for personal/friend use**
- **Not secure for public deployment**
- If you share the code repo, anyone can see the password

### Permissions
- **You have full control** - edit/delete ANY build
- **Users cannot access admin** - they can only manage their own builds via "My Builds"

### Data Safety
- **Deletions are permanent** - no undo or trash
- **Edits affect live links** - users see changes immediately
- **No audit log** - can't see who edited what

### Performance
- Dashboard loads ALL builds at once
- May slow down if you have 100+ builds
- Consider pagination in future versions if needed

---

## 🔧 Customization

### Change Admin Password

Edit `src/App.js` line 8:
```javascript
const ADMIN_PASSWORD = 'your-new-password-here';
```

Then redeploy:
```bash
git add .
git commit -m "Updated admin password"
git push
npm run deploy
```

### Change Admin URL

Currently hardcoded to `/admin`. To change:
1. Update routing logic in `App.js` (line ~122)
2. Update all references to `/admin` in the codebase
3. Redeploy

---

## 🐛 Troubleshooting

### Can't log in
- Check you're using the correct password
- Password is case-sensitive
- Clear browser cache and try again

### Dashboard shows 0 builds
- Make sure builds exist in Firebase
- Check Firebase console: Firestore Database → builds collection
- Try refreshing the page

### "Error loading builds" message
- Check Firebase console for errors
- Verify Firestore security rules allow admin read access
- Check browser console (F12) for detailed errors

### Edit button doesn't work
- Check browser console for errors
- Make sure Firebase rules allow updates
- Try refreshing and logging in again

---

## 📝 Firebase Console Access

For deeper access to build data:
1. Go to: https://console.firebase.google.com
2. Select project: `gb-build-estimator`
3. Click **Firestore Database**
4. Browse the `builds` collection

From here you can:
- See all raw build data
- Manually edit builds
- Delete builds
- Export data
- View usage stats

---

## 🎯 Best Practices

### Before Deleting Builds
- Double-check it's the right build
- Consider asking the user first (if you know who created it)
- No way to recover after deletion

### When Editing Builds
- Note what you changed (in case user asks)
- Test the build link after editing to confirm it looks right

### Managing Many Builds
- Use descriptive build names to make them easier to find
- Encourage users to use clear names when creating builds

---

## 🔮 Future Enhancements (v1.2+)

Ideas for improving the admin dashboard:
- [ ] Search/filter builds
- [ ] Sort by different columns
- [ ] Pagination for large datasets
- [ ] Bulk delete/edit
- [ ] Export builds to CSV
- [ ] Activity log (who edited what)
- [ ] Admin notes on builds
- [ ] Build status (draft, completed, archived)

Let me know what would be most useful!

---

## 🆘 Need Help?

If you run into issues:
1. Check browser console (F12) for errors
2. Check Firebase console for database issues
3. Review this guide
4. Let me know what's up!

---

**Happy managing!** 🎮
