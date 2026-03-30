'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function enrollInCourse(courseId: string) {
  const supabase = await createServerSupabaseClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if already enrolled
  const { data: existingEnrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  if (existingEnrollment) {
    return { error: 'Already enrolled in this course' }
  }

  const { error } = await supabase
    .from('enrollments')
    .insert({
      user_id: user.id,
      course_id: courseId,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/courses/${courseId}`)
  return { success: true }
}

export async function updateVideoProgress(videoId: string, progress: number) {
  const supabase = await createServerSupabaseClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('video_progress')
    .upsert({
      user_id: user.id,
      video_id: videoId,
      progress,
      completed: progress >= 90,
    })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
