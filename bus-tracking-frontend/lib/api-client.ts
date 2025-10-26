import { AuthService } from "./services/auth-service"

export class APIError extends Error {
  constructor(
    public statusCode: number,
    public data: any,
    message: string,
  ) {
    super(message)
    this.name = "APIError"
  }
}

class APIClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    const token = AuthService.getTokenFromStorage()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json()

    if (!response.ok) {
      throw new APIError(response.status, data, data.message || data.error || "API Error")
    }

    return data
  }

  async get<T>(endpoint: string): Promise<T> {
    console.log("[v0] API GET:", endpoint)
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(),
    })
    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    console.log("[v0] API POST:", endpoint, body)
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    })
    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    console.log("[v0] API PUT:", endpoint, body)
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    })
    return this.handleResponse<T>(response)
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    console.log("[v0] API PATCH:", endpoint, body)
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    })
    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string): Promise<T> {
    console.log("[v0] API DELETE:", endpoint)
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    })
    return this.handleResponse<T>(response)
  }
}

export const apiClient = new APIClient()
