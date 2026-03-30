// lib/offline/videoCache.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface VideoDBSchema extends DBSchema {
  videos: {
    key: string
    value: {
      id: string
      videoUrl: string
      blob: Blob
      title: string
      courseId: string
      downloadedAt: number
      size: number
    }
  }
  downloadProgress: {
    key: string
    value: {
      videoId: string
      progress: number
      total: number
      status: 'downloading' | 'completed' | 'failed'
    }
  }
}

const DB_NAME = 'lms-video-cache'
const DB_VERSION = 1

async function getDB(): Promise<IDBPDatabase<VideoDBSchema>> {
  return openDB<VideoDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('downloadProgress')) {
        db.createObjectStore('downloadProgress', { keyPath: 'videoId' })
      }
    },
  })
}

export async function downloadVideo(
  videoId: string,
  videoUrl: string,
  title: string,
  courseId: string,
  onProgress?: (progress: number, total: number) => void
): Promise<void> {
  const db = await getDB()

  try {
    // Set initial progress
    await db.put('downloadProgress', {
      videoId,
      progress: 0,
      total: 0,
      status: 'downloading',
    })

    const response = await fetch(videoUrl)
    if (!response.ok) throw new Error('Download failed')

    const contentLength = response.headers.get('content-length')
    const total = contentLength ? parseInt(contentLength, 10) : 0

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No reader available')

    const chunks: Uint8Array[] = []
    let receivedLength = 0

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      chunks.push(value)
      receivedLength += value.length

      // Update progress
      await db.put('downloadProgress', {
        videoId,
        progress: receivedLength,
        total,
        status: 'downloading',
      })

      onProgress?.(receivedLength, total)
    }

    // Combine chunks into blob
    const blob = new Blob(chunks as BlobPart[], { type: 'video/mp4' })

    // Store in IndexedDB
    await db.put('videos', {
      id: videoId,
      videoUrl,
      blob,
      title,
      courseId,
      downloadedAt: Date.now(),
      size: receivedLength,
    })

    // Update progress to completed
    await db.put('downloadProgress', {
      videoId,
      progress: receivedLength,
      total: receivedLength,
      status: 'completed',
    })
  } catch (error) {
    await db.put('downloadProgress', {
      videoId,
      progress: 0,
      total: 0,
      status: 'failed',
    })
    throw error
  }
}

export async function getOfflineVideo(videoId: string): Promise<string | null> {
  const db = await getDB()
  const video = await db.get('videos', videoId)

  if (!video) return null

  return URL.createObjectURL(video.blob)
}

export async function isVideoDownloaded(videoId: string): Promise<boolean> {
  const db = await getDB()
  const video = await db.get('videos', videoId)
  return !!video
}

export async function deleteOfflineVideo(videoId: string): Promise<void> {
  const db = await getDB()
  await db.delete('videos', videoId)
  await db.delete('downloadProgress', videoId)
}

export async function getDownloadProgress(videoId: string) {
  const db = await getDB()
  return db.get('downloadProgress', videoId)
}

export async function getAllOfflineVideos() {
  const db = await getDB()
  return db.getAll('videos')
}

export async function getStorageUsage(): Promise<number> {
  const db = await getDB()
  const videos = await db.getAll('videos')
  return videos.reduce((total, video) => total + video.size, 0)
}
