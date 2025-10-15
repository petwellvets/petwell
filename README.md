# PetWell GitHub Pages

Landing pages and marketing assets for PetWell.

## Structure

```
static/
  └── lander-e89cd777/    # Main landing page (October 2025)
```

## Active Landing Pages

- **lander-e89cd777**: Main launch page
  - URL: https://[username].github.io/static/lander-e89cd777/
  - Features: Parallax effects, email collection, responsive design
  - Tech: TypeScript, Vite, vanilla JS

## Deployment

This repository uses GitHub Actions to automatically build and deploy landing pages to GitHub Pages.

Changes pushed to `main` will trigger a deployment.

## Adding New Landing Pages

1. Create a new directory: `static/lander-[8-digit-hex]/`
2. Follow the structure in existing lander directories
3. Update `.github/workflows/deploy.yml` if needed
4. Commit and push to deploy

## Local Development

Each landing page has its own README with development instructions.

```bash
cd static/lander-e89cd777
npm install
npm run dev
```

## License

© 2025 PetWell. All rights reserved.
