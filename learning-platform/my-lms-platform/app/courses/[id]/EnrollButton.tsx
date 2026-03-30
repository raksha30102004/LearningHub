'use client'

import { useState } from 'react'
import { enrollInCourse } from '../actions'
import { useRouter } from 'next/navigation'

export default function EnrollButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleEnroll = async () => {
    setLoading(true)
    setError(null)

    const result = await enrollInCourse(courseId)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.refresh()
    }
  }

  return (
    <div>
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Enrolling...' : 'Enroll Now'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
      )}
    </div>
  )
}
