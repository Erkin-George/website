import { NextRequest, NextResponse } from 'next/server'
import { getBusyIntervals, createBooking } from '@/lib/google-calendar'

export const dynamic = 'force-dynamic'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type BookingBody = {
  start?: unknown
  end?: unknown
  name?: unknown
  email?: unknown
  note?: unknown
}

/**
 * POST /api/book
 * Body: { start, end, name, email, note? }
 * Re-checks the slot is still free (guards against double-booking races),
 * then creates the event with the visitor as an attendee.
 */
export async function POST(request: NextRequest) {
  let body: BookingBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const { start, end, name, email, note } = body

  if (
    typeof start !== 'string' ||
    typeof end !== 'string' ||
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    (note !== undefined && typeof note !== 'string')
  ) {
    return NextResponse.json({ error: 'Missing or invalid fields.' }, { status: 400 })
  }

  if (!name.trim()) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
  }

  if (!emailRe.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
  }

  const startMs = Date.parse(start)
  const endMs = Date.parse(end)
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
    return NextResponse.json({ error: 'Invalid start/end timestamps.' }, { status: 400 })
  }
  if (endMs <= startMs) {
    return NextResponse.json({ error: 'End must be after start.' }, { status: 400 })
  }
  if (startMs < Date.now()) {
    return NextResponse.json({ error: 'Cannot book a slot in the past.' }, { status: 400 })
  }

  try {
    // Guard against a slot that filled between availability load and submit.
    const busy = await getBusyIntervals(start, end)
    const overlaps = busy.some(
      b => Date.parse(b.start) < endMs && Date.parse(b.end) > startMs,
    )
    if (overlaps) {
      return NextResponse.json(
        { error: 'That time was just booked. Please pick another slot.' },
        { status: 409 },
      )
    }

    const event = await createBooking({
      start,
      end,
      name: name.trim(),
      email,
      note: typeof note === 'string' ? note.trim() : undefined,
    })

    return NextResponse.json({ ok: true, event })
  } catch (err) {
    console.error('booking error', err)
    return NextResponse.json({ error: 'Failed to create booking.' }, { status: 500 })
  }
}
