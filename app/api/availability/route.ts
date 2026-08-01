import { NextRequest, NextResponse } from 'next/server'
import { getBusyIntervals } from '@/lib/google-calendar'

export const dynamic = 'force-dynamic'

/**
 * GET /api/availability?from=<ISO>&to=<ISO>
 * Returns busy intervals only — no event titles or details. The frontend
 * subtracts these from the bookable window to render open slots.
 */
export async function GET(request: NextRequest) {
  const from = request.nextUrl.searchParams.get('from')
  const to = request.nextUrl.searchParams.get('to')

  if (!from || !to) {
    return NextResponse.json(
      { error: 'Both `from` and `to` ISO timestamps are required.' },
      { status: 400 },
    )
  }

  if (Number.isNaN(Date.parse(from)) || Number.isNaN(Date.parse(to))) {
    return NextResponse.json(
      { error: '`from` and `to` must be valid ISO timestamps.' },
      { status: 400 },
    )
  }

  try {
    const busy = await getBusyIntervals(from, to)
    return NextResponse.json({ busy })
  } catch (err) {
    console.error('availability error', err)
    return NextResponse.json(
      { error: 'Failed to load availability.' },
      { status: 500 },
    )
  }
}
