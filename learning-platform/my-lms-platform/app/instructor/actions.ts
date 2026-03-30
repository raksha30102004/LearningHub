'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCourse(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string

  const { data, error } = await supabase
    .from('courses')
    .insert({
      title,
      description,
      category,
      instructor_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/instructor')
  redirect(`/instructor/courses/${data.id}`)
}

export async function updateCourse(courseId: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const isPublished = formData.get('is_published') === 'true'

  const { error } = await supabase
    .from('courses')
    .update({
      title,
      description,
      category,
      is_published: isPublished,
    })
    .eq('id', courseId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/instructor/courses/${courseId}`)
  return { success: true }
}

export async function uploadVideo(courseId: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const videoFile = formData.get('video') as File
  const orderIndex = parseInt(formData.get('order_index') as string)

  if (!videoFile) {
    return { error: 'No video file provided' }
  }

  // Upload video to Supabase Storage
  const fileName = `${Date.now()}-${videoFile.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('course-videos')
    .upload(fileName, videoFile)

  if (uploadError) {
    return { error: uploadError.message }
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('course-videos')
    .getPublicUrl(fileName)

  // Create video record
  const { error: dbError } = await supabase
    .from('videos')
    .insert({
      course_id: courseId,
      title,
      description,
      video_url: publicUrl,
      order_index: orderIndex,
    })

  if (dbError) {
    return { error: dbError.message }
  }

  revalidatePath(`/instructor/courses/${courseId}`)
  return { success: true }
}
