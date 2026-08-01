import { NextRequest, NextResponse } from 'next/server'
import { createOAuthClient } from '@/lib/google-calendar'

export const dynamic = 'force-dynamic'

/**
 * OAuth callback. Google redirects here with a code; we exchange it for tokens
 * and display the refresh token so the owner can paste it into the
 * GOOGLE_REFRESH_TOKEN env var. Only reachable while ENABLE_AUTH_SETUP=true.
 */
export async function GET(request: NextRequest) {
  if (process.env.ENABLE_AUTH_SETUP !== 'true') {
    return NextResponse.json(
      { error: 'Auth setup is disabled. Set ENABLE_AUTH_SETUP=true to run it.' },
      { status: 403 },
    )
  }

  const code = request.nextUrl.searchParams.get('code')
  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 })
  }

  const client = createOAuthClient()
  const { tokens } = await client.getToken(code)

  if (!tokens.refresh_token) {
    return NextResponse.json(
      {
        error:
          'No refresh token returned. Revoke prior access at ' +
          'https://myaccount.google.com/permissions and try again.',
      },
      { status: 400 },
    )
  }

  // Plain-text so it's easy to copy; this route is owner-only and disabled after setup.
  return new NextResponse(
    `Success! Add this to your environment variables:\n\n` +
      `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n\n` +
      `Then set ENABLE_AUTH_SETUP=false (or remove it) and redeploy.`,
    { headers: { 'Content-Type': 'text/plain' } },
  )
}
