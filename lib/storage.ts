import type { FileItem, FileStats } from "./types"

export class ApiStorage {
  private static async fetchApi(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }))
      throw new Error(error.error || "API request failed")
    }

    return response.json()
  }

  static async getFiles(userId: string): Promise<FileItem[]> {
    try {
      const data = await this.fetchApi(`/api/files?userId=${userId}`)
      return data.files || []
    } catch (error) {
      console.error("Error fetching files:", error)
      return []
    }
  }

  static async addFile(userId: string, file: Omit<FileItem, "id">): Promise<FileItem | null> {
    try {
      const data = await this.fetchApi("/api/files", {
        method: "POST",
        body: JSON.stringify({ userId, ...file }),
      })
      return data.file
    } catch (error) {
      console.error("Error adding file:", error)
      return null
    }
  }

  static async deleteFile(userId: string, id: string): Promise<boolean> {
    try {
      await this.fetchApi(`/api/files/${id}?userId=${userId}`, {
        method: "DELETE",
      })
      return true
    } catch (error) {
      console.error("Error deleting file:", error)
      return false
    }
  }

  static async getFileById(userId: string, id: string): Promise<FileItem | null> {
    try {
      const data = await this.fetchApi(`/api/files/${id}?userId=${userId}`)
      return data.file
    } catch (error) {
      console.error("Error fetching file:", error)
      return null
    }
  }

  static async getStats(userId: string): Promise<FileStats> {
    try {
      const data = await this.fetchApi(`/api/files/stats?userId=${userId}`)
      return data.stats
    } catch (error) {
      console.error("Error fetching stats:", error)
      return {
        image: 0,
        pdf: 0,
        video: 0,
        text: 0,
        total: 0,
      }
    }
  }

  static async searchFiles(userId: string, query: string): Promise<FileItem[]> {
    try {
      const data = await this.fetchApi(`/api/files/search?userId=${userId}&query=${encodeURIComponent(query)}`)
      return data.files || []
    } catch (error) {
      console.error("Error searching files:", error)
      return []
    }
  }

  static async updateFile(userId: string, id: string, updates: Partial<FileItem>): Promise<FileItem | null> {
    try {
      const data = await this.fetchApi(`/api/files/${id}`, {
        method: "PUT",
        body: JSON.stringify({ userId, ...updates }),
      })
      return data.file
    } catch (error) {
      console.error("Error updating file:", error)
      return null
    }
  }
}

// Keep LocalStorage as fallback for offline functionality
export class LocalStorage {
  private static getUserStorageKey(userId: string): string {
    return `personal_data_storage_user_${userId}`
  }

  static getFiles(userId: string): FileItem[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.getUserStorageKey(userId))
    return data ? JSON.parse(data) : []
  }

  static saveFiles(userId: string, files: FileItem[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.getUserStorageKey(userId), JSON.stringify(files))
  }

  static addFile(userId: string, file: FileItem): void {
    const files = this.getFiles(userId)
    files.push(file)
    this.saveFiles(userId, files)
  }

  static deleteFile(userId: string, id: string): void {
    const files = this.getFiles(userId).filter((f) => f.id !== id)
    this.saveFiles(userId, files)
  }

  static getFileById(userId: string, id: string): FileItem | undefined {
    return this.getFiles(userId).find((f) => f.id === id)
  }

  static getStats(userId: string): FileStats {
    const files = this.getFiles(userId)
    return {
      image: files.filter((f) => f.type === "image").length,
      pdf: files.filter((f) => f.type === "pdf").length,
      video: files.filter((f) => f.type === "video").length,
      text: files.filter((f) => f.type === "text").length,
      total: files.length,
    }
  }

  static searchFiles(userId: string, query: string): FileItem[] {
    const files = this.getFiles(userId)
    return files.filter(
      (file) =>
        file.name.toLowerCase().includes(query.toLowerCase()) ||
        (file.details && file.details.toLowerCase().includes(query.toLowerCase())),
    )
  }
}
