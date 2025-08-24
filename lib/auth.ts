export interface User {
  id: string
  name: string
  email: string
  phone: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
}

export class AuthApi {
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

  static async register(userData: RegisterData): Promise<User> {
    const data = await this.fetchApi("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
    return data.user
  }

  static async login(credentials: LoginCredentials): Promise<User> {
    const data = await this.fetchApi("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
    return data.user
  }

  static async getUser(userId: string): Promise<User> {
    const data = await this.fetchApi(`/api/users/${userId}`)
    return data.user
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const data = await this.fetchApi(`/api/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
    return data.user
  }
}

export class AuthStorage {
  private static readonly USER_KEY = "personal_storage_user"
  private static readonly AUTH_KEY = "personal_storage_auth"

  static saveUser(user: User): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
    localStorage.setItem(this.AUTH_KEY, "true")
  }

  static getUser(): User | null {
    if (typeof window === "undefined") return null
    const userData = localStorage.getItem(this.USER_KEY)
    const isAuth = localStorage.getItem(this.AUTH_KEY)

    if (userData && isAuth === "true") {
      return JSON.parse(userData)
    }
    return null
  }

  static isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return localStorage.getItem(this.AUTH_KEY) === "true"
  }

  static logout(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.USER_KEY)
    localStorage.removeItem(this.AUTH_KEY)
  }
}
