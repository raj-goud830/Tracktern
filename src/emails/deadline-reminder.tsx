import { Html, Head, Preview, Body, Container, Section, Text, Heading, Button, Tailwind } from '@react-email/components'
import * as React from 'react'

interface DeadlineReminderEmailProps {
  userName: string
  company: string
  role: string
  deadlineDate: string
}

export default function DeadlineReminderEmail({
  userName,
  company,
  role,
  deadlineDate,
}: DeadlineReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Upcoming Application Deadline: {company}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="bg-white border border-gray-200 rounded my-10 px-10 py-8 mx-auto max-w-[600px]">
            <Heading className="text-2xl font-bold text-gray-900 mb-6">Upcoming Deadline Reminder ⏰</Heading>
            
            <Text className="text-gray-700 text-base mb-4">
              Hi {userName},
            </Text>
            
            <Text className="text-gray-700 text-base mb-6">
              Just a quick reminder that you have an upcoming deadline for your application to <strong>{company}</strong> for the <strong>{role}</strong> position.
            </Text>

            <Section className="bg-orange-50 border border-orange-100 rounded-md p-4 mb-6">
              <Text className="text-orange-500 font-semibold m-0">Deadline Date:</Text>
              <Text className="text-orange-500 text-lg m-0">{deadlineDate}</Text>
            </Section>

            <Text className="text-gray-700 text-base mb-6">
              Don't miss it! Log in to your Tracktern dashboard to review your application status or upload any necessary documents.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-orange-500 rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href="https://tracktern.vercel.app/dashboard"
              >
                Go to Dashboard
              </Button>
            </Section>
            
            <Text className="text-gray-500 text-lg mt-8">
              Best of luck, <br />
              The Tracktern Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
