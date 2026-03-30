'use client'

import { useState, useEffect } from 'react'
import {
  downloadVideo,
  getOfflineVideo,
  isVideoDownloaded,
  deleteOfflineVideo,
  getDownloadProgress,
} from '@/lib/offline/videoCache'

type Video = {
  id: string
  title: string
  description: string | null
  video_url: string
  duration: number | null
  order_index: number
  is_free_preview: boolean
}

export default function OfflineVideoPlayer({
  videos,
  courseId,
  userId,
}: {
  videos: Video[]
  courseId: string
  userId?: string
}) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [videoSrc, setVideoSrc] = useState<string>('')
  const [downloadedVideos, setDownloadedVideos] = useState<Set<string>>(new Set())
  const [downloading, setDownloading] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    checkDownloadedVideos()
  }, [videos])

  const checkDownloadedVideos = async () => {
    const downloaded = new Set<string>()
    for (const video of videos) {
      if (await isVideoDownloaded(video.id)) {
        downloaded.add(video.id)
      }
    }
    setDownloadedVideos(downloaded)
  }

  const handleVideoSelect = async (video: Video) => {
    setSelectedVideo(video)

    // Check if video is downloaded offline
    const offlineUrl = await getOfflineVideo(video.id)
    if (offlineUrl) {
      setVideoSrc(offlineUrl)
    } else {
      setVideoSrc(video.video_url)
    }
  }

  const handleDownload = async (video: Video) => {
    setDownloading(new Map(downloading.set(video.id, 0)))

    try {
      await downloadVideo(
        video.id,
        video.video_url,
        video.title,
        courseId,
        (progress, total) => {
          const percent = total > 0 ? (progress / total) * 100 : 0
          setDownloading(new Map(downloading.set(video.id, percent)))
        }
      )

      setDownloadedVideos(new Set(downloadedVideos.add(video.id)))
      setDownloading((prev) => {
        const next = new Map(prev)
        next.delete(video.id)
        return next
      })
    } catch (error) {
      console.error('Download failed:', error)
      setDownloading((prev) => {
        const next = new Map(prev)
        next.delete(video.id)
        return next
      })
    }
  }

  const handleDelete = async (videoId: string) => {
    await deleteOfflineVideo(videoId)
    setDownloadedVideos((prev) => {
      const next = new Set(prev)
      next.delete(videoId)
      return next
    })

    // If currently playing, switch to online
    if (selectedVideo?.id === videoId) {
      setVideoSrc(selectedVideo.video_url)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course Content</h2>

      {selectedVideo ? (
        <div className="mb-6">
          <div className="bg-black rounded-lg overflow-hidden mb-4">
            <video key={videoSrc} controls className="w-full" src={videoSrc}>
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {selectedVideo.title}
            </h3>
            {downloadedVideos.has(selectedVideo.id) ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded flex items-center">
                  <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Downloaded
                </span>
                <button
                  onClick={() => handleDelete(selectedVideo.id)}
                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  Delete
                </button>
              </div>
            ) : downloading.has(selectedVideo.id) ? (
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Downloading: {Math.round(downloading.get(selectedVideo.id) || 0)}%
              </div>
            ) : (
              <button
                onClick={() => handleDownload(selectedVideo)}
                className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center"
              >
                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </button>
            )}
          </div>
          {selectedVideo.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedVideo.description}</p>
          )}
          <button
            onClick={() => setSelectedVideo(null)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to course content
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {videos.map((video, index) => {
            const isDownloaded = downloadedVideos.has(video.id)
            const downloadProgress = downloading.get(video.id)

            return (
              <div
                key={video.id}
                className="flex items-start p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <button
                  onClick={() => handleVideoSelect(video)}
                  className="flex-1 flex items-start text-left"
                >
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {video.title}
                    </h4>
                    {video.duration && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {Math.floor(video.duration / 60)}:
                        {(video.duration % 60).toString().padStart(2, '0')}
                      </p>
                    )}
                  </div>
                </button>

                <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
                  {isDownloaded ? (
                    <>
                      <span className="text-xs text-green-600 dark:text-green-400">Offline</span>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </>
                  ) : downloadProgress !== undefined ? (
                    <div className="text-xs text-blue-600 dark:text-blue-400 w-16 text-right">
                      {Math.round(downloadProgress)}%
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDownload(video)}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
