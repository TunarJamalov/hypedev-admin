'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || password !== confirmPassword) {
    return { error: 'Şifrələr uyğun gəlmir və ya boşdur.' }
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: 'Şifrə yenilənərkən xəta baş verdi.' }
  }

  return { success: 'Şifrəniz uğurla yeniləndi!' }
}

export async function linkGoogleAccount() {
  const supabase = await createClient()
  const origin = (await headers()).get('origin') || 'http://localhost:3000'
  
  const { data, error } = await supabase.auth.linkIdentity({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      scopes: 'https://www.googleapis.com/auth/calendar.events'
    }
  })

  if (data?.url) {
    redirect(data.url)
  }
}
