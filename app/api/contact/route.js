import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(1, 'Message is required'),
})

export async function POST(request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ error: 'Invalid data' }, { status: 400 })
    }

    const { name, email, message } = parsed.data

    const { error } = await getSupabaseAdmin()
      .from('inquiries')
      .insert({ name, email, message })

    if (error) {
      console.error('Supabase insert error:', error)
      return Response.json({ error: 'Failed to save inquiry' }, { status: 500 })
    }

    // Send email notification
    try {
      await resend.emails.send({
        from: 'Viper Net <onboarding@resend.dev>',
        to: process.env.NOTIFICATION_EMAIL,
        subject: `New inquiry from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      })
    } catch (emailError) {
      console.error('Email send error:', emailError)
      // Don't fail the request if email fails — inquiry is already saved
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
