A full-stack web application for managing university clubs, their activities, board members, and public-facing club pages. This repository contains three main parts: the public client site, the admin panel, and the Node.js server API.

**Repository structure**
- `client/` : Public-facing React (Vite) app for browsing clubs and activities.
- `admin/` : Admin React (Vite) app for club managers to add/edit content.
- `server/` : Node.js/Express API, database connection, authentication, and upload handling.
- `uploads/` : Static uploaded assets (images, videos) organized by club folders.

**Key features**
- Club listing, details, and media galleries.
- Activity and board member management (admin panel).
- Authentication for admins and protected routes.
- File uploads and organized storage for club assets.

Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

Quick start

1. Clone the repository:

```bash
git clone <repo-url>
cd ensaf_club_project
```

2. Server setup

```bash
cd server
npm install
# configure environment: copy or create server/.env and set DB, JWT, email credentials
# start server (adjust if package.json defines other scripts)
node server.js
```

3. Client (public) setup

```bash
cd ../client
npm install
npm run dev
```

4. Admin panel setup

```bash
cd ../admin
npm install
npm run dev
```

Notes

- Environment variables for the server live in `server/.env`. Ensure DB connection, JWT secret, and email settings are configured before starting the server.
- The server connects to a database (see `server/db/connectDB.js`) and includes SQL in `server/sqlRequeteStore.sql` for reference.
- Uploaded media are stored under the `uploads/` folder; different club folders are present (e.g., `Robotics`, `IEEE`, etc.).

Development tips

- Use separate terminals for `server`, `client`, and `admin` when running in development.
- When deploying, build the appropriate frontend (`npm run build`) and serve static assets or host separately.

ort, open an issue in this repository.
