# Question 1 — Online Course Registration

## ByteXL execution
1. Use a Node.js workspace.
2. Keep `server.js`, `package.json`, `.env` and the `public/` folder in the project root.
3. Copy `.env.example` to `.env`, then configure a working MongoDB URI (local MongoDB or Atlas).
4. Run `npm install`.
5. Run `npm start`.
6. Open the URL provided by ByteXL.

## API
- `GET /api/health`
- `GET /api/registrations`
- `POST /api/registrations` with JSON fields `name`, `email`, `username`, `password`, `course`.

Passwords are hashed with bcrypt before storage. The React page is served by Express.
