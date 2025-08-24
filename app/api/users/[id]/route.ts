import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/database"
import bcrypt from "bcryptjs"

// GET /api/users/[id] - Get user profile
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await UserService.findUserById(params.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password from response
    const { password: _, ...userResponse } = user
    return NextResponse.json({ user: userResponse })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

// PUT /api/users/[id] - Update user profile
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, email, phone, password, ...otherUpdates } = body

    const updates: any = { ...otherUpdates }

    // Add fields that are provided
    if (name) updates.name = name
    if (email) updates.email = email
    if (phone) updates.phone = phone

    // Hash password if provided
    if (password) {
      updates.password = await bcrypt.hash(password, 12)
    }

    const user = await UserService.updateUser(params.id, updates)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password from response
    const { password: _, ...userResponse } = user
    return NextResponse.json({ user: userResponse })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
