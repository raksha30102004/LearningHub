import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import EnrollButton from './EnrollButton'
import OfflineVideoPlayer from '@/components/OfflineVideoPlayer'

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch course details
  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      profiles:instructor_id (
        full_name,
        email
      )
    `)
    .eq('id', id)
    .single()

  if (error || !course) {
    notFound()
  }

  // Check if user is enrolled
  let enrollment = null
  if (user) {
    const { data } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', id)
      .single()
    enrollment = data
  }

  // Fetch videos
  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .eq('course_id', id)
    .order('order_index', { ascending: true })

  const instructor = course.profiles as any

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-6 flex items-center justify-center">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <svg
                    className="h-32 w-32 text-white opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {course.title}
              </h1>

              {course.category && (
                <span className="inline-block text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full mb-4">
                  {course.category}
                </span>
              )}

              <p className="text-gray-600 dark:text-gray-400 mb-6">{course.description}</p>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Instructor
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {instructor?.full_name || instructor?.email}
                </p>
              </div>
            </div>

            {/* Video List */}
            {enrollment && videos && videos.length > 0 && (
              <OfflineVideoPlayer videos={videos} courseId={id} userId={user?.id} />
            )}
          </div>

          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Course Access
              </h3>

              {enrollment ? (
                <div className="space-y-4">
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">Enrolled</span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {enrollment.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>

                  {videos && videos.length > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 pt-2">
                      {videos.length} video{videos.length !== 1 ? 's' : ''} available
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <EnrollButton courseId={id} />
                  {videos && videos.length > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      {videos.length} video{videos.length !== 1 ? 's' : ''} included
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
