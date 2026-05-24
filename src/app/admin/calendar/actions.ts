'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendDiscordNotification } from '@/utils/discord'

export async function addMeeting(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const dateStr = formData.get('date') as string
  const timeStr = formData.get('time') as string

  if (!title || !dateStr || !timeStr) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Combine date and time to ISO string (Baku is UTC+4)
  const start_time = new Date(`${dateStr}T${timeStr}:00+04:00`).toISOString()
  
  // Assume meeting takes 1 hour by default
  const endTimeDate = new Date(`${dateStr}T${timeStr}:00+04:00`)
  endTimeDate.setHours(endTimeDate.getHours() + 1)
  const end_time = endTimeDate.toISOString()

  const { error } = await supabase
    .from('meetings')
    .insert([{ title, description, start_time, end_time, created_by: user.id }])

  if (!error) {
    // ----------------------------------------------------
    // GOOGLE CALENDAR SYNC
    // ----------------------------------------------------
    const { data: profile } = await supabase
      .from('profiles')
      .select('google_access_token')
      .eq('id', user.id)
      .single()

    if (profile?.google_access_token) {
      try {
        const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${profile.google_access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            summary: title,
            description: description || '',
            start: {
              dateTime: start_time,
              timeZone: 'Asia/Baku'
            },
            end: {
              dateTime: end_time,
              timeZone: 'Asia/Baku'
            }
          })
        })
        
        if (!res.ok) {
          const errText = await res.text()
          console.error('Google API Error:', errText)
        }
      } catch (e) {
        console.error('Google Calendar sync network error:', e)
      }
    }
    // ----------------------------------------------------

    const formattedDate = new Date(start_time).toLocaleString('az-AZ');
    await sendDiscordNotification(
      'YENİ İCLAS / GÖRÜŞ 📅', 
      `**${title}**\nTarix: ${formattedDate}\n${description || ''}`,
      3447003 // Blue color
    );
    revalidatePath('/admin/calendar')
    revalidatePath('/admin')
  }
}

export async function deleteMeeting(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('meetings')
    .delete()
    .eq('id', id)

  if (!error) {
    revalidatePath('/admin/calendar')
    revalidatePath('/admin')
  }
}
