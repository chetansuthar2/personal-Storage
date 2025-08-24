import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  id: string
  name: string
  email: string
  phone: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export interface FileItem {
  _id?: ObjectId
  id: string
  userId: string
  name: string
  type: "image" | "pdf" | "video" | "text"
  size: number
  content: string
  details?: string
  createdAt: Date
  updatedAt: Date
}

export interface FileStats {
  image: number
  pdf: number
  video: number
  text: number
  total: number
}
