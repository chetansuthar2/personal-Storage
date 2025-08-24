export interface FileItem {
  id: string
  name: string
  type: "image" | "pdf" | "video" | "text"
  size: number
  createdAt?: Date
  updatedAt?: Date
  uploadDate?: Date // Keep for backward compatibility
  content?: string // For text files and base64 data
  url?: string // For other file types (backward compatibility)
  thumbnail?: string // For preview
  details?: string // For file descriptions and metadata
}

export interface FileStats {
  image: number
  pdf: number
  video: number
  text: number
  total: number
}

export type FileType = "image" | "pdf" | "video" | "text"
