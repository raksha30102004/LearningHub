'use client'

import { useState } from 'react'

type Video = {
  id: string
  title: string
  description: string | null
  video_url: string
  duration: number | null
  order_index: number
  is_free_preview: boolean
}

export default function VideoList({
  videos,
  courseId,
  userId,
}: {
  videos: Video[]
  courseId: string
  userId?: string
}) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course Content</h2>

      {selectedVideo ? (
        <div className="mb-6">
          <div className="bg-black rounded-lg overflow-hidden mb-4">
            <video
              key={selectedVideo.id}
              controls
              className="w-full"
              src={selectedVideo.video_url}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {selectedVideo.title}
          </h3>
          {selectedVideo.description && (
            <p className="text-gray-600 dark:text-gray-400">{selectedVideo.description}</p>
          )}
          <button
            onClick={() => setSelectedVideo(null)}
            className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to course content
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {videos.map((video, index) => (
            <button
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="w-full flex items-start p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="flex-shrink-0 mr-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                    {index + 1}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{video.title}</h4>
                {video.duration && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 ml-4">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
