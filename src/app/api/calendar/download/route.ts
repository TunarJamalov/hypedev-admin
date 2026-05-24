import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  if (!id) {
    return new NextResponse('Meeting ID not provided', { status: 400 })
  }

  const supabase = await createClient()
  const { data: meeting } = await supabase.from('meetings').select('*').eq('id', id).single()

  if (!meeting) {
    return new NextResponse('Meeting not found', { status: 404 })
  }

  const startDate = new Date(meeting.start_time)
  const endDate = new Date(meeting.end_time)

  // Format date to ICS required format (YYYYMMDDTHHMMSSZ)
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Hype Dev//Calendar//EN
BEGIN:VEVENT
UID:${meeting.id}@hypedev.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${meeting.title}
DESCRIPTION:${meeting.description || ''}
END:VEVENT
END:VCALENDAR`

  return new NextResponse(icsContent, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="meeting-${meeting.id}.ics"`,
    },
  })
}
