# Week 9: Session Tracking & Cookies

## Pre-requisite
[JSP](https://github.com/martin-m-kinoti/JSP)

---

## Overview

This app is built on Node/Express, not Java, so `HttpSession` is implemented with **`express-session`**, and Apache Tomcat is substituted with the Express dev server (`npm run dev`), which plays the same role.

---

## What was added

1. **User session** — [server.js](server/server.js) stores the user's name and login time in the psession on login (`req.session.userName`, `req.session.loginTime`), alongside the existing `userId`/`role`.
2. **Theme cookie** — a Light/Dark toggle in the dashboard topbar saves the choice to an `mv_theme` cookie ([cookies.js](client/src/utils/cookies.js)), read back on every app load ([App.vue](client/src/App.vue)).
3. **Session info on the dashboard** — [Dashboard.vue](client/src/views/Dashboard.vue) shows the session ID and login time, pulled from `GET /api/auth/session`.
4. **Expired-session redirect** — [AppLayout.vue](client/src/components/AppLayout.vue) checks `/api/auth/session` on every protected page; a `401` clears local storage and sends the user to `/login`.
5. **Remember Me** — a checkbox on [Login.vue](client/src/views/Login.vue) saves the email to an `mv_remember_email` cookie on login, and pre-fills it on the next visit.

---

## How sessions and cookies work together

- **Login** creates a session on the server and sends the browser a `connect.sid` cookie holding only the session ID — the actual data (name, role, login time) stays server-side.
- **Every request** re-sends that cookie automatically (`axios` + `withCredentials: true`), letting the server look up the session and return the user's info.
- **Refresh** works because the cookie persists (`maxAge`) and `AppLayout` re-checks the session on every mount.
- **Browser restart** doesn't log the user out, since the session cookie carries a 7-day expiry (same for the theme and remember-me cookies).
- **Logout** destroys the session and clears the cookie, so the next session check returns `401` and the app redirects to login.
- The **theme** and **remember-me** cookies are ordinary client-set cookies, independent of the session.