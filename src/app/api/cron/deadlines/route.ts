import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import DeadlineReminderEmail from '@/emails/deadline-reminder'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: Request) {
  try {
    // Only allow Vercel cron to trigger this, unless in dev mode
    const authHeader = request.headers.get('authorization')
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Find applications with deadlines exactly 2 days from now
    const today = new Date()
    const twoDaysFromNow = new Date(today)
    twoDaysFromNow.setDate(today.getDate() + 2)
    twoDaysFromNow.setHours(0, 0, 0, 0)
    
    const endOfTwoDaysFromNow = new Date(twoDaysFromNow)
    endOfTwoDaysFromNow.setHours(23, 59, 59, 999)

    const applicationsWithUpcomingDeadlines = await prisma.application.findMany({
      where: {
        deadline: {
          gte: twoDaysFromNow,
          lte: endOfTwoDaysFromNow
        },
        status: {
          notIn: ['Rejected', 'Offer'] // Don't remind if already rejected or offered
        }
      },
      include: {
        user: true
      }
    })

    const emailPromises = applicationsWithUpcomingDeadlines.map(async (app) => {
      // If user has an email, send the reminder
      if (app.user.email) {
        return resend.emails.send({
          from: 'Tracktern <notifications@tracktern.com>', // Replace with verified domain
          to: [app.user.email],
          subject: `Upcoming Deadline: ${app.company} - ${app.role}`,
          react: DeadlineReminderEmail({
            userName: app.user.name || 'Student',
            company: app.company,
            role: app.role,
            deadlineDate: app.deadline ? app.deadline.toLocaleDateString() : 'Soon'
          }) as React.ReactElement
        })
      }
    })

    await Promise.all(emailPromises)

    return NextResponse.json({ 
      success: true, 
      sent: emailPromises.length,
      message: 'Deadline reminders checked and sent.' 
    })
    
  } catch (error) {
    console.error('Error running deadline cron:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
