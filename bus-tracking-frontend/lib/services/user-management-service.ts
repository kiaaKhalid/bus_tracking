import { apiClient } from "@/lib/api-client"
import type { UserFormData, UserManagement, UsersResponse } from "@/lib/schemas/user-management"

export class UserManagementService {
  static async getUsers(): Promise<UsersResponse> {
    return apiClient.get<UsersResponse>("/users")
  }

  static async createUser(data: UserFormData): Promise<UserManagement> {
    return apiClient.post<UserManagement>("/users", data)
  }

  static async updateUser(id: string, data: Partial<UserFormData>): Promise<UserManagement> {
    return apiClient.put<UserManagement>(`/users/${id}`, data)
  }

  static async deleteUser(id: string): Promise<void> {
    return apiClient.delete<void>(`/users/${id}`)
  }
}
