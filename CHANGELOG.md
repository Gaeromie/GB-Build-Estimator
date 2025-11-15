# Changelog

## [1.1.0] - 2025-11-13

### 🎨 Visual Changes
- **New Color Theme**: Changed from purple/purple to teal/purple gradient
  - Background: `#14b8a6` (teal) → `#a855f7` (purple)
  - All buttons, headers, and accents updated to match
  - Better visual contrast and modern look

### ✨ New Features

#### Admin Dashboard
- **Route**: `/admin` with password protection (`admin123`)
- **View All Builds**: Table view of every build in the system
- **Actions**: View, Edit, Delete, Copy Link for any build
- **Table Columns**: Build Name, Console, Total, Created Date, Actions
- **Auto-sorting**: Newest builds first

#### User Build History
- **My Builds Page**: Each user gets a unique "My Builds" link
- **User ID System**: Automatic user ID generation via localStorage
- **Build Management**: Users can view, edit, and share their own builds
- **Build Cards**: Clean card-based layout for build list
- **Auto-generation**: "My Builds" link provided after first build creation

#### Multiple Shell Selection
- **Quantity Selector**: Choose 1-5 shells
- **Individual Selection**: Each shell gets its own style + color picker
- **Dynamic Form**: Selection fields appear/disappear based on quantity
- **Independent Choices**: Can mix and match different shells
- **Live Pricing**: $30 per shell, updates automatically

#### Multiple Button Sets
- **Quantity Selector**: Choose 0-3 button sets
- **Individual Selection**: Each set gets its own style + color picker
- **Optional**: 0 buttons = use shell buttons (no extra cost)
- **Independent Choices**: Can mix and match different button sets
- **Live Pricing**: $12 per set, updates automatically

#### Edit Build Functionality
- **Edit Mode**: Load existing build into form for modification
- **Update Button**: Changes from "Complete Build" to "Update Build"
- **Preserve Data**: All selections reload correctly
- **Same Link**: Build keeps its original shareable link after editing
- **Access Control**: Users edit their builds, admin edits any build

### 🖼️ Image Placeholder System
- **Data Structure**: Added `imageUrl` field to all parts in `partsData.json`
- **CSS Ready**: `.part-image` class defined (currently hidden)
- **Easy Activation**: Change `display: none` to `display: inline-block` when ready
- **No Visible Change**: Images hidden until URLs are added

### 🔧 Code Improvements

#### Architecture
- **Complete Rewrite**: App.js refactored from 450 lines to 1,000+ lines (but cleaner!)
- **View System**: Modular views (create, view, admin, myBuilds)
- **State Management**: Better organized state with clear purposes
- **Routing**: Path-based routing for different pages

#### Data Structure
- **Build Model Updated**:
  ```javascript
  {
    buildName: string,
    consoleType: string,
    ownConsole: boolean,
    selections: object,        // non-shell/button categories
    shellSelections: array,    // NEW: array of shell choices
    buttonSelections: array,   // NEW: array of button choices
    userId: string,            // NEW: user identifier
    total: number,
    createdAt: timestamp,
    updatedAt: timestamp       // NEW: track edits
  }
  ```

#### Bug Fixes
- **React 19 Warning**: Removed unused `buildId` variable
- **Border Color**: Focus states now use teal instead of old purple
- **Calculation**: Fixed shell/button pricing with new quantity system

#### Performance
- **Firestore Queries**: Optimized with `where` and `orderBy`
- **State Updates**: Reduced unnecessary re-renders
- **Array Operations**: Efficient add/remove for multiple selections

### 📝 Documentation
- **UPGRADE_GUIDE.md**: Complete upgrade instructions
- **ADMIN_GUIDE.md**: Admin dashboard manual
- **CHANGELOG.md**: This file
- **Inline Comments**: Better code documentation

### 🗑️ Removed Features
- None! Everything from v1.0 still works.

### ⚠️ Breaking Changes

#### Data Structure
**Old Format (v1.0)**:
```javascript
{
  selections: {
    shell: "clear-atomic",
    shell_subcategory: "Clear",
    buttons: "buttons-stock"
  },
  shellQuantity: 2
}
```

**New Format (v1.1)**:
```javascript
{
  shellSelections: [
    { subcategory: "Clear", choice: "clear-atomic" },
    { subcategory: "Soft Touch", choice: "soft-black" }
  ],
  buttonSelections: [
    { subcategory: "Standard", choice: "buttons-purple" }
  ]
}
```

**Impact**: Old v1.0 build links will not display correctly in v1.1. Recommend deleting test builds and starting fresh.

### 📦 Files Changed
- `src/App.js` - Complete rewrite
- `src/App.css` - Theme update + new styles
- `src/partsData.json` - Added imageUrl fields

### 🎯 Migration Path
1. Back up v1.0 (optional)
2. Replace 3 files (App.js, App.css, partsData.json)
3. Test locally
4. Deploy
5. Delete old test builds from Firebase (optional)

---

## [1.0.0] - 2025-11-12

### Initial Release
- Basic build configurator
- Single shell selection
- Single button selection
- Firebase storage
- Shareable build links
- GitHub Pages deployment
- Purple gradient theme

---

## Roadmap

### v1.2 (Future)
- [ ] Build comparison tool
- [ ] Search/filter builds
- [ ] Part images
- [ ] Build templates
- [ ] Export to PDF
- [ ] Dark mode toggle

### v1.3 (Future)
- [ ] User authentication
- [ ] Build notes/comments
- [ ] Price history tracking
- [ ] Community builds gallery
- [ ] Upvote/favorite system

### v1.4 (Future)
- [ ] Multiple console support (GBC, GBA, GB)
- [ ] Interactive visual UI (hotspot selection)
- [ ] Augmented reality preview
- [ ] 3D shell preview

---

## Version Numbering

Format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (incompatible with previous versions)
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

Example:
- `1.0.0` → `1.1.0`: Added features (admin, history, multiple shells)
- `1.1.0` → `1.1.1`: Bug fixes only
- `1.1.0` → `2.0.0`: Major rewrite, incompatible changes
