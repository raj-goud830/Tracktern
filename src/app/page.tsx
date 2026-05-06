import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const { userId } = await auth()
  
  if (userId) {
    redirect('/dashboard')
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-4xl font-extrabold text-orange-500 mb-6 text-center">Opportunity Tracker</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-lg text-center">
        Track, manage, and optimize your applications for internships, jobs, hackathons, and scholarships in one place.
      </p>
      <div className="flex gap-4">
        <a href="/sign-in" className="px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition">Log In</a>
        <a href="/sign-up" className="px-6 py-3 bg-white text-orange-500 border border-orange-500 font-medium rounded-md hover:bg-gray-50 transition">Sign Up</a>
      </div>
    </div>
  )
}
