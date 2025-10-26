"use client"

import useSWR from "swr"
import { UserManagementService } from "@/lib/services/user-management-service"
import type { UserFormData } from "@/lib/schemas/user-management"

export function useUsers() {
  const { data: users = [], isLoading, error, mutate } = useSWR("/users", () => UserManagementService.getUsers())

  return {
    users,
    isLoading,
    error,
    mutate,
  }
}

export async function createUser(data: UserFormData) {
  try {
    await UserManagementService.createUser(data)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    }
  }
}

export async function updateUser(id: string, data: Partial<UserFormData>) {
  try {
    await UserManagementService.updateUser(id, data)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
    }
  }
}

export async function deleteUser(id: string) {
  try {
    await UserManagementService.deleteUser(id)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user",
    }
  }
}
