import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user && (session.provider_token || session.provider_refresh_token)) {
        await supabase
          .from('profiles')
          .update({
            google_access_token: session.provider_token,
            google_refresh_token: session.provider_refresh_token
          })
          .eq('id', session.user.id)
      }
    }
  }

  return NextResponse.redirect(`${origin}/admin/settings`)
}
