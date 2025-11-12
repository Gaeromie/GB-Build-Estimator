<<<<<<< HEAD
# GB Build Estimator

A web-based Game Boy build configurator that allows users to select parts, calculate pricing, and share build configurations via shareable links.

## Features

- **Build Configuration**: Select from various shells, screens, buttons, batteries, and misc upgrades
- **Nested Selections**: Organized part selection with style categories (Soft Touch, Clear, Special)
- **Multiple Shells**: Option to add multiple shells to a single build
- **Live Price Calculation**: Real-time total cost updates as parts are selected
- **Shareable Links**: Generate and share unique URLs for completed builds
- **Firebase Integration**: Persistent storage of builds with Firestore
- **Responsive Design**: Works on desktop and mobile browsers

## Tech Stack

- **Frontend**: React
- **Database**: Firebase Firestore
- **Hosting**: GitHub Pages
- **Styling**: Custom CSS with gradient theme

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm
- Git
- GitHub account
- Firebase account

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gaeromie/GB-Build-Estimator.git
   cd GB-Build-Estimator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run locally**
   ```bash
   npm start
   ```
   App will open at `http://localhost:3000`

### Deployment to GitHub Pages

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

   This will:
   - Build the production version
   - Push to the `gh-pages` branch
   - Make the app live at `https://gaeromie.github.io/GB-Build-Estimator`

3. **Enable GitHub Pages** (first time only)
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: Select `gh-pages` branch
   - Click Save

## Project Structure

```
gb-build-estimator/
├── public/
│   └── index.html
├── src/
│   ├── App.js                 # Main application component
│   ├── App.css                # Styling
│   ├── firebase.js            # Firebase configuration
│   ├── partsData.json         # Parts catalog (editable)
│   └── index.js               # Entry point
├── package.json
└── README.md
```

## Updating Parts & Pricing

To add, remove, or modify parts:

1. Open `src/partsData.json`
2. Edit the relevant category:
   - Add new options to `options` array
   - Modify prices
   - Add new categories following the existing structure
3. Save the file
4. Redeploy: `npm run deploy`

### Example: Adding a New Shell Color

```json
{
  "subcategory": "Clear",
  "choices": [
    { "id": "clear-orange", "name": "Orange" }
  ]
}
```

## Firebase Security Rules

After deployment, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /builds/{buildId} {
      allow read: if true;
      allow write: if request.time < timestamp.date(2026, 1, 1);
    }
  }
}
```

This allows:
- Anyone to read builds (for viewing shared links)
- Anyone to create builds (temporary, consider adding auth later)

## Usage

### Creating a Build

1. Enter a build name (e.g., "Zac's SP")
2. Select console type (currently GBA SP only)
3. Choose if providing own console
4. Select parts:
   - Shell (with quantity option)
   - Screen upgrade
   - Buttons (optional)
   - Speaker upgrade
   - Battery
   - Misc options (checkboxes)
5. Review total price
6. Click "Complete Build"
7. Confirm selections
8. Copy and share the generated link

### Viewing a Build

- Open the shared link (e.g., `https://gaeromie.github.io/GB-Build-Estimator/build/abc123`)
- View all selected parts and total cost
- Click "Create New Build" to start a new configuration

## Customization

### Changing Colors/Theme

Edit `src/App.css`:
- Primary gradient: `.App` background and `.btn-primary`
- Accent color: `#667eea` (search and replace for global change)

### Adding New Console Types

Edit `src/partsData.json`:

```json
{
  "consoleTypes": [
    {
      "id": "gba-sp",
      "name": "Game Boy Advance SP",
      "available": true
    },
    {
      "id": "gbc",
      "name": "Game Boy Color",
      "available": true
    }
  ]
}
```

## Troubleshooting

### Build not loading from URL

- Check Firebase security rules
- Verify build ID exists in Firestore
- Check browser console for errors

### Deployment issues

- Ensure `gh-pages` branch exists
- Verify GitHub Pages is enabled in repo settings
- Check that `homepage` in `package.json` matches your GitHub username/repo

### Local development errors

- Delete `node_modules` and run `npm install` again
- Clear browser cache
- Check Firebase configuration in `src/firebase.js`

## Future Enhancements

- [ ] User authentication
- [ ] Build history/management
- [ ] Interactive visual UI with hotspot selection
- [ ] Export build to PDF
- [ ] Admin panel for parts management
- [ ] Multiple console type support (GBC, GBA, etc.)
- [ ] Image uploads for custom shells

## License

MIT License - Feel free to use and modify for your projects.

## Contact

For questions or issues, open an issue on GitHub or contact the repository owner.
=======
# GB-Build-Estimator
Interactive estimator for Game Boy builds (beta)
>>>>>>> 5fd38d285cceb2de55c0d15a8f184da2d8e4f826
