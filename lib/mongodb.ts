import { MongoClient, type Db, type Collection } from "mongodb"

let client: MongoClient
let db: Db

export async function connectToDatabase() {
  if (db) {
    return { db }
  }

  try {
    // Use environment variable for MongoDB connection string
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/personal-data-storage"

    client = new MongoClient(uri)
    await client.connect()

    db = client.db("personal-data-storage")

    console.log("Connected to MongoDB")
    return { db }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw error
  }
}

export async function getCollection(name: string): Promise<Collection> {
  const { db } = await connectToDatabase()
  return db.collection(name)
}

// Close connection when needed
export async function closeConnection() {
  if (client) {
    await client.close()
  }
}
