'use client'

import { useState } from 'react'
import { uploadVideo } from '../../actions'
import { useRouter } from 'next/navigation'

type Video = {
  id: string
  title: string
  order_index: number
}

export default function VideoUpload({
  courseId,
  existingVideos,
}: {
  courseId: string
  existingVideos: Video[]
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const result = await uploadVideo(courseId, formData)

    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      e.currentTarget.reset()
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Course Videos</h2>

      {/* Existing Videos */}
      {existingVideos.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Uploaded Videos</h3>
          <div className="space-y-2">
            {existingVideos.map((video, index) => (
              <div
                key={video.id}
                className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="ml-3 text-sm text-gray-900 dark:text-white">{video.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
            <p className="text-sm text-green-800 dark:text-green-200">Video uploaded successfully!</p>
          </div>
        )}

        <div>
          <label htmlFor="video-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Video Title *
          </label>
          <input
            type="text"
            id="video-title"
            name="title"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="e.g., Lesson 1: Introduction"
          />
        </div>

        <div>
          <label htmlFor="video-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="video-description"
            name="description"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Brief description of the video content..."
          />
        </div>

        <div>
          <label htmlFor="order-index" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Order *
          </label>
          <input
            type="number"
            id="order-index"
            name="order_index"
            required
            min="1"
            defaultValue={existingVideos.length + 1}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="video-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Video File *
          </label>
          <input
            type="file"
            id="video-file"
            name="video"
            accept="video/*"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Supported formats: MP4, WebM, MOV. Max size: 500MB
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      </form>
    </div>
  )
}
