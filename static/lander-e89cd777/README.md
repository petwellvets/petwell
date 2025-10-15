# PetWell Landing Page (lander-e89cd777)

A modern, responsive landing page for PetWell - premium telehealth and custom compounded medications for pets.

## Features

- **Vanilla TypeScript** - Type-safe, performant code
- **Vite** - Lightning-fast builds and hot module replacement
- **Parallax Effects** - Smooth scroll animations with dog illustrations
- **Modular Color Palette** - Easy theme customization via CSS custom properties
- **Google Sheets Integration** - Simple email collection
- **Responsive Design** - Mobile-first approach
- **GitHub Pages Ready** - Configured for deployment

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to view the site.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Google Sheets Setup

To collect emails to your Google Sheet:

1. Create a new Google Apps Script project at https://script.google.com
2. Add this code:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.openById('1VIQs67ABoDBdK85WMDqM_d_2lFxJofJ_AQq0MaokUJA').getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp,
    data.name,
    data.email,
    data.petName || '',
    data.note || ''
  ]);

  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Deploy as Web App:
   - Click "Deploy" > "New deployment"
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Click "Deploy"

4. Copy the Web App URL

5. Create a `.env` file:

```bash
cp .env.example .env
```

6. Add your Web App URL to `.env`:

```
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

7. Make sure your Google Sheet has these column headers:
   - Timestamp
   - Name
   - Email
   - Pet Name
   - Note

## Customizing Colors

Edit `src/styles/theme.css` to change the color palette:

```css
:root {
  --color-accent: #FF8E72;  /* Main brand color */
  --color-bg-primary: #FAF7F2;  /* Background */
  /* ... more colors */
}
```

An alternative palette is commented out in the file for easy switching.

## Deployment to GitHub Pages

The site is configured to deploy at `/static/lander-e89cd777/`.

1. Build the project:
```bash
npm run build
```

2. Commit and push to GitHub:
```bash
git add .
git commit -m "Build landing page"
git push origin main
```

3. Enable GitHub Pages:
   - Go to repository Settings
   - Pages section
   - Source: Deploy from branch
   - Branch: main
   - Folder: / (root)

4. Your site will be live at:
   `https://[username].github.io/static/lander-e89cd777/`

## Project Structure

```
lander-e89cd777/
├── public/
│   └── dogs/           # SVG dog illustrations
├── src/
│   ├── styles/
│   │   ├── theme.css       # Color system & base styles
│   │   ├── layout.css      # Component layouts
│   │   └── responsive.css  # Mobile styles
│   ├── main.ts        # Entry point
│   ├── parallax.ts    # Scroll effects
│   └── sheets.ts      # Google Sheets integration
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

© 2025 PetWell. All rights reserved.
