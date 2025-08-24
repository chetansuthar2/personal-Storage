import { getCollection } from "./mongodb"
import type { User, FileItem, FileStats } from "./models"

// User operations
export class UserService {
  static async createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<User> {
    const collection = await getCollection("users")

    const user: Omit<User, "_id"> = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(user)
    return { ...user, _id: result.insertedId }
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const collection = await getCollection("users")
    return (await collection.findOne({ email })) as User | null
  }

  static async findUserById(id: string): Promise<User | null> {
    const collection = await getCollection("users")
    return (await collection.findOne({ id })) as User | null
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const collection = await getCollection("users")

    const result = await collection.findOneAndUpdate(
      { id },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return result as User | null
  }
}

// File operations
export class FileService {
  static async createFile(fileData: Omit<FileItem, "_id" | "createdAt" | "updatedAt">): Promise<FileItem> {
    const collection = await getCollection("files")

    const file: Omit<FileItem, "_id"> = {
      ...fileData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(file)
    return { ...file, _id: result.insertedId }
  }

  static async getFilesByUserId(userId: string): Promise<FileItem[]> {
    const collection = await getCollection("files")
    return (await collection.find({ userId }).sort({ createdAt: -1 }).toArray()) as FileItem[]
  }

  static async getFileById(id: string, userId: string): Promise<FileItem | null> {
    const collection = await getCollection("files")
    return (await collection.findOne({ id, userId })) as FileItem | null
  }

  static async updateFile(id: string, userId: string, updates: Partial<FileItem>): Promise<FileItem | null> {
    const collection = await getCollection("files")

    const result = await collection.findOneAndUpdate(
      { id, userId },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return result as FileItem | null
  }

  static async deleteFile(id: string, userId: string): Promise<boolean> {
    const collection = await getCollection("files")
    const result = await collection.deleteOne({ id, userId })
    return result.deletedCount > 0
  }

  static async searchFiles(userId: string, query: string): Promise<FileItem[]> {
    const collection = await getCollection("files")

    const searchRegex = new RegExp(query, "i")

    return (await collection
      .find({
        userId,
        $or: [{ name: { $regex: searchRegex } }, { details: { $regex: searchRegex } }],
      })
      .sort({ createdAt: -1 })
      .toArray()) as FileItem[]
  }

  static async getFileStats(userId: string): Promise<FileStats> {
    const collection = await getCollection("files")

    const pipeline = [
      { $match: { userId } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]

    const results = await collection.aggregate(pipeline).toArray()

    const stats: FileStats = {
      image: 0,
      pdf: 0,
      video: 0,
      text: 0,
      total: 0,
    }

    results.forEach((result) => {
      if (result._id in stats) {
        stats[result._id as keyof Omit<FileStats, "total">] = result.count
        stats.total += result.count
      }
    })

    return stats
  }
}
