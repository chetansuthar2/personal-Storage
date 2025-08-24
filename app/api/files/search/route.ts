import { type NextRequest, NextResponse } from "next/server"
import { FileService } from "@/lib/database"

// GET /api/files/search - Search files
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const query = searchParams.get("query")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    const files = await FileService.searchFiles(userId, query)
    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error searching files:", error)
    return NextResponse.json({ error: "Failed to search files" }, { status: 500 })
  }
}
