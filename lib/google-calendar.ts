import { google } from 'googleapis'
import type { calendar_v3 } from 'googleapis'

/**
 * Google Calendar interface layer.
 *
 * Auth model: the site owner authorizes once (see /api/auth/google) to mint a
 * long-lived refresh token, stored as GOOGLE_REFRESH_TOKEN. All server-side
 * calls use that token — visitors never log in.
 *
 * Required env vars:
 *   GOOGLE_CLIENT_ID       OAuth client ID
 *   GOOGLE_CLIENT_SECRET   OAuth client secret
 *   GOOGLE_REDIRECT_URI    e.g. https://erkingeorge.com/api/auth/google/callback
 *   GOOGLE_REFRESH_TOKEN   obtained from the one-time auth flow
 *   GOOGLE_CALENDAR_ID     usually your primary calendar email address
 */

export const CALENDAR_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.freebusy',
]

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

/** OAuth2 client with only client credentials — used for the auth flow. */
export function createOAuthClient() {
  return new google.auth.OAuth2(
    requireEnv('GOOGLE_CLIENT_ID'),
    requireEnv('GOOGLE_CLIENT_SECRET'),
    requireEnv('GOOGLE_REDIRECT_URI'),
  )
}

/** OAuth2 client pre-loaded with the owner's refresh token — used for API calls. */
function createAuthedClient() {
  const client = createOAuthClient()
  client.setCredentials({ refresh_token: requireEnv('GOOGLE_REFRESH_TOKEN') })
  return client
}

function calendarClient(): calendar_v3.Calendar {
  return google.calendar({ version: 'v3', auth: createAuthedClient() })
}

export type BusyInterval = { start: string; end: string }

/**
 * Return busy intervals in [timeMin, timeMax) as ISO strings.
 * Uses freebusy, so no event titles or details are ever exposed.
 */
export async function getBusyIntervals(
  timeMin: string,
  timeMax: string,
): Promise<BusyInterval[]> {
  const calendar = calendarClient()
  const calendarId = requireEnv('GOOGLE_CALENDAR_ID')

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      items: [{ id: calendarId }],
    },
  })

  const busy = res.data.calendars?.[calendarId]?.busy ?? []
  return busy
    .filter((b): b is { start: string; end: string } => Boolean(b.start && b.end))
    .map(b => ({ start: b.start, end: b.end }))
}

export type BookingRequest = {
  start: string // ISO
  end: string // ISO
  name: string
  email: string
  note?: string
}

/**
 * Create a calendar event for a booking, inviting the visitor as an attendee.
 * Returns the created event id and html link.
 */
export async function createBooking(
  booking: BookingRequest,
): Promise<{ id: string; htmlLink: string }> {
  const calendar = calendarClient()
  const calendarId = requireEnv('GOOGLE_CALENDAR_ID')

  const res = await calendar.events.insert({
    calendarId,
    sendUpdates: 'all',
    requestBody: {
      summary: `Meeting with ${booking.name}`,
      description: booking.note
        ? `Booked via erkingeorge.com\n\n${booking.note}`
        : 'Booked via erkingeorge.com',
      start: { dateTime: booking.start },
      end: { dateTime: booking.end },
      attendees: [{ email: booking.email, displayName: booking.name }],
    },
  })

  return {
    id: res.data.id ?? '',
    htmlLink: res.data.htmlLink ?? '',
  }
}
