# 🦅 Bird Flying License Generator

A fun React web app to create official-looking flying licenses for birds.

## Setup

1. Create a new React app (if you haven't):
   ```bash
   npx create-react-app bird-flying-license
   cd bird-flying-license
   ```

2. Replace the `src/` folder with the provided files:
   ```
   src/
   ├── index.js
   ├── index.css
   ├── App.js
   ├── App.css
   └── components/
       ├── ThemeToggle.js + .css
       ├── LandingPanel.js + .css
       ├── DropZone.js + .css
       ├── FormPanel.js + .css
       ├── FormField.js + .css
       └── LicensePreview.js + .css
   ```

3. Run the app:
   ```bash
   npm start
   ```

## Features
- 🌙 Dark / ☀️ Light mode toggle
- Drag & drop or click to upload a bird photo
- Fill in 10+ license fields (species, DOB, flight class, etc.)
- Live canvas preview updates as you type
- Download as PNG (740×460px)
- Fully responsive layout

## No extra dependencies needed — just React!
