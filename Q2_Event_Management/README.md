# Question 2 — Online Event Management

## ByteXL execution
1. Create a Node.js workspace and place `server.js`, `package.json`, `.env` and `public/index.html` as shown.
2. Copy `.env.example` to `.env` and configure a working MongoDB URI.
3. Run `npm install`, then `npm start`.
4. Open the ByteXL application URL.
5. Add an event with `POST /api/events` and JSON such as:
   `{"name":"AI Workshop","date":"2026-11-10","location":"Coimbatore","description":"An AI workshop"}`

## Git feature branch
`git switch -c event-management_v1`
`git add .`
`git commit -m "Add event management"`
`git switch main`
`git merge event-management_v1`
`git push origin main`
