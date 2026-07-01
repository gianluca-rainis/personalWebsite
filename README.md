# Gianluca Rainis - Personal Website

This is my personal website and portfolio.

> **Live site**: [https://www.gianlucarainis.com](https://www.gianlucarainis.com)

## Overview
This is my personal website, built with *Next.js* and *React*.
It presents my personal profile in a **terminal/OS-inspired interface**.

Instead of a simple portfolio, the homepage actually **works like a desktop terminal**, allowing the user to **run commands** (like `info`; `image --ascii`; `presentation --about`, and all the other commands you can find in the terminals!) inside the different sized terminal windows.

## Features
- **Terminal-style homepage** with interactive panels for personal info, contact links, languages, skills, education, and all the other userfull infos about me.
- **Light/Dark Accent** theme controls.
- **Curriculum Vitae** page, to download or web-visualize it in English or in Italian.
- **Contact form**, powered by a Next.js API route and Nodemailer.
- **Site search** page, backed by a custom search API.
- Custom *404*, *500*, and **error pages**.

## Author
The author of the whole project is: 
**Gianluca Rainis** - [gianluca-rainis](https://github.com/gianluca-rainis) on GitHub.

## AI Disclaimer
**Parts of this project** (including code and part of the UI) were developed with the **assistance of AI tools**.

**All content has been carefully reviewed, tested, adapted, modified, and curated by the author.**

## License
This project is under the MIT License.

## Images
### Home Page
![Home Page Preview](/public/gianlucarainisPreview.png)

#### Other Colors
![Home Page Red Preview](/public/screenshots/homePageRed.png)
![Home Page Yellow Preview](/public/screenshots/homePageYellow.png)
![Home Page Blue Preview](/public/screenshots/homePageBlue.png)

### Curriculum Vitae Page
![CV Page Preview](/public/screenshots/cvPage.png)

### Contacts Page
![Contacts Page Preview](/public/screenshots/contactsPage.png)

### Search Page
![Search Results Page Preview](/public/screenshots/searchPageSearching.png)

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
```
personalWebsite/
├── components/               # UI pieces of the site
├── pages/                    # App routes and API routes
├── public/                   # Static assets and downloadable files
├── styles/                   # Global styles and CSS modules
├── .gitattributes            # Gitattributes file
├── .gitignore                # Gitignore file
├── icon.png                  # The website icon
├── jsconfig.json             # JavaScript Configuration
├── LICENSE.md                # MIT License
├── next.config.js            # Next.js Configuration
├── package.json              # Project Configuration
├── README.md                 # This file
├── robots.txt                # Robots file
└── sitemap.xml               # The Sitemap
```

## Notes
- The search feature indexes rendered pages from the site.
- The contact form sends messages through the `/api/contact` endpoint.
