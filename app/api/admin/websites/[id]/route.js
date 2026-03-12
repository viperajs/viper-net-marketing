import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function PUT(request, { params }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { data, error } = await supabase
    .from('websites')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}

export async function DELETE(request, { params }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get website to check for logo
  const { data: website } = await supabase
    .from('websites')
    .select('logo_path')
    .eq('id', params.id)
    .single()

  // Delete logo from storage if exists
  if (website?.logo_path) {
    await supabaseAdmin.storage.from('logos').remove([website.logo_path])
  }

  const { error } = await supabase
    .from('websites')
    .delete()
    .eq('id', params.id)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
