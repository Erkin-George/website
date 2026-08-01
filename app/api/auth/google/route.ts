import { NextResponse } from 'next/server'
import { createOAuthClient, CALENDAR_SCOPES } from '@/lib/google-calendar'

export const dynamic = 'force-dynamic'

/**
 * One-time owner authorization. Visit this route in a browser while signed in
 * as the calendar owner to start the OAuth consent flow. It's gated behind
 * ENABLE_AUTH_SETUP so it can be disabled after the refresh token is obtained.
 */
export async function GET() {
  if (process.env.ENABLE_AUTH_SETUP !== 'true') {
    return NextResponse.json(
      { error: 'Auth setup is disabled. Set ENABLE_AUTH_SETUP=true to run it.' },
      { status: 403 },
    )
  }

  const client = createOAuthClient()
  const url = client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // force a refresh token every time
    scope: CALENDAR_SCOPES,
  })

  return NextResponse.redirect(url)
}
