import { type NextRequest, NextResponse } from "next/server"
import { FileService } from "@/lib/database"
import type { FileItem } from "@/lib/models"

// GET /api/files - Get all files for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const files = await FileService.getFilesByUserId(userId)
    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error fetching files:", error)
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 })
  }
}

// POST /api/files - Create a new file
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, type, size, content, details } = body

    if (!userId || !name || !type || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const fileData: Omit<FileItem, "_id" | "createdAt" | "updatedAt"> = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      name,
      type,
      size: size || 0,
      content,
      details,
    }

    const file = await FileService.createFile(fileData)
    return NextResponse.json({ file }, { status: 201 })
  } catch (error) {
    console.error("Error creating file:", error)
    return NextResponse.json({ error: "Failed to create file" }, { status: 500 })
  }
}
