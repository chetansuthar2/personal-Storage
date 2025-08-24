import { type NextRequest, NextResponse } from "next/server"
import { FileService } from "@/lib/database"

// GET /api/files/stats - Get file statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const stats = await FileService.getFileStats(userId)
    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching file stats:", error)
    return NextResponse.json({ error: "Failed to fetch file stats" }, { status: 500 })
  }
}
