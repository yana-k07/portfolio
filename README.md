# Portfolio — Kovalova Yana

React + Vite + Tailwind. Deploys to Vercel from GitHub.

## Run locally
```
npm install
npm run dev
```

## Where to edit
- `src/data/site.js` — name, headline, email, social links, CV path
- `src/data/experience.js` — Resume page: roles, dates, expandable details
- `src/data/about.js` — About page text and photo list (photos go in `public/images/photos/01.jpg` … `06.jpg`)
- `src/data/projects.js` — cases: text, chapters, meta cards. Block types (text with **bold**, image + caption, list, stats, quote) are listed at the top of the file
- `src/assets/` — cover images and your photo (replace files, keep the names)
- `public/images/` — extra case images referenced by path in projects.js (create the folder when needed)
- `public/` — put your CV PDF here (name set in site.js)

## Components (shadcn/ui)
The site uses [shadcn/ui](https://ui.shadcn.com): Button, Card, Badge, Accordion, Dialog and Tooltip live in `src/components/ui/` and are plain files you can edit.
Colours and radius are the shadcn variables at the top of `src/index.css` (`:root` for light, `.dark` for dark).
To add more components on your machine: `npx shadcn@latest add <name>` (for example `separator` or `tabs`). `components.json` is already set up.

## Preview as a single file
`npm run build:preview` writes `dist/index.html`, a self-contained copy you can open anywhere.

## Deploy
Push to GitHub, then in Vercel: Add New → Project → pick the repo. Framework: Vite (auto-detected).
