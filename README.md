# Gianluca Rainis Personal Website

Personal website and portfolio for Gianluca Rainis.

Live site: [https://gianlucarainis.com](https://gianlucarainis.com)

## Overview
This project is built with Next.js and presents my personal profile in a terminal-inspired interface. It includes a homepage with interactive panels, a curriculum page with downloadable CVs, a contact form, and a site search page backed by API routes.

## Features
- Terminal-style homepage with personal info, contact links, languages, and profile art
- Light/Dark/Accent theme controls
- Curriculum Vitae page with English and Italian versions
- Contact form powered by a Next.js API route and Nodemailer
- Site search powered by a custom search API
- Custom 404, 500, and error pages

## Tech Stack
- Next.js
- React
- Node.js
- Nodemailer
- CSS Modules and global CSS

## Development
Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Start the production server:
```bash
npm run start
```

## Project Structure
- `pages/` app routes and API routes
- `components/` reusable UI pieces
- `styles/` global styles and CSS modules
- `public/` static assets and downloadable files

## Notes
- The search feature indexes rendered pages from the site.
- The contact form sends messages through the `/api/contact` endpoint.

## License
This project is under the MIT License
