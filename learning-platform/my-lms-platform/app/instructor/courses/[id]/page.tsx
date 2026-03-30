import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import CourseSettings from './CourseSettings'
import VideoUpload from './VideoUpload'

export default async function ManageCoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .eq('instructor_id', user.id)
    .single()

  if (error || !course) {
    notFound()
  }

  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .eq('course_id', id)
    .order('order_index', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage course settings and content</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Settings */}
          <div className="lg:col-span-2 space-y-6">
            <CourseSettings course={course} />
            <VideoUpload courseId={id} existingVideos={videos || []} />
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {course.is_published ? 'Published' : 'Draft'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Videos</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {videos?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {course.category || 'Uncategorized'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
