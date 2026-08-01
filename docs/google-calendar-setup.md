# Google Calendar Setup

The scheduling feature reads your availability and creates booking events using
the Google Calendar API. You authorize once as the calendar owner; visitors
never log in.

## 1. Create a Google Cloud project + OAuth credentials

1. Go to <https://console.cloud.google.com/> and create a new project.
2. **APIs & Services → Library** → enable the **Google Calendar API**.
3. **APIs & Services → OAuth consent screen**:
   - User type: **External**
   - Add yourself as a **Test user** (so you can authorize without app verification)
   - Scopes: `.../auth/calendar.events` and `.../auth/calendar.freebusy`
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**
   - Authorized redirect URIs, add both:
     - `http://localhost:3000/api/auth/google/callback`
     - `https://erkingeorge.com/api/auth/google/callback`
   - Copy the **Client ID** and **Client secret**.

## 2. Fill in environment variables

Copy `.env.example` to `.env.local` and set:

| Variable | Value |
|---|---|
| `GOOGLE_CLIENT_ID` | from step 1 |
| `GOOGLE_CLIENT_SECRET` | from step 1 |
| `GOOGLE_REDIRECT_URI` | `http://localhost:3000/api/auth/google/callback` locally |
| `GOOGLE_CALENDAR_ID` | your calendar's ID (usually your email address) |
| `ENABLE_AUTH_SETUP` | `true` — temporarily, for the next step |

## 3. Get your refresh token (one time)

1. Run `npm run dev`.
2. Visit <http://localhost:3000/api/auth/google> and complete Google sign-in.
3. The callback page prints your `GOOGLE_REFRESH_TOKEN`. Copy it into `.env.local`.
4. Set `ENABLE_AUTH_SETUP=false` (or remove it).

## 4. Deploy to Vercel

Add all five `GOOGLE_*` variables in **Vercel → Settings → Environment
Variables**. Use the production redirect URI
(`https://erkingeorge.com/api/auth/google/callback`) and make sure that exact
URI is listed in your Google credentials. Leave `ENABLE_AUTH_SETUP` unset in
production except when you deliberately need to re-run the auth flow.

## Notes

- Availability is served via the calendar **freebusy** API, so event titles and
  details are never exposed to visitors — only busy/free blocks.
- Bookings invite the visitor as an attendee and send them a Google Calendar
  invitation email.
