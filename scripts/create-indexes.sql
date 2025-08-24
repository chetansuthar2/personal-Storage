-- Create indexes for better performance

-- Users collection indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "id": 1 }, { unique: true })

-- Files collection indexes
db.files.createIndex({ "userId": 1 })
db.files.createIndex({ "id": 1, "userId": 1 }, { unique: true })
db.files.createIndex({ "userId": 1, "type": 1 })
db.files.createIndex({ "userId": 1, "createdAt": -1 })

-- Text search indexes for file search functionality
db.files.createIndex({ 
  "name": "text", 
  "details": "text" 
}, {
  "weights": {
    "name": 10,
    "details": 5
  }
})
