"use client"

import useSWR from "swr"
import { ScheduleManagementService } from "@/lib/services/schedule-management-service"
import type { ScheduleFormData, ScheduleListResponse } from "@/lib/schemas/schedule-management"

export function useSchedules(page = 1, pageSize = 50) {
  const { data, error, isLoading, mutate } = useSWR<ScheduleListResponse>(
    `schedules-${page}-${pageSize}`,
    () => ScheduleManagementService.getSchedules(page, pageSize),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    },
  )

  return {
    schedules: data?.schedules || [],
    total: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.pageSize || 50,
    isLoading,
    error,
    mutate,
  }
}

export function useScheduleById(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `schedule-${id}` : null,
    () => (id ? ScheduleManagementService.getScheduleById(id) : null),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    },
  )

  return {
    schedule: data?.schedule,
    isLoading,
    error,
    mutate,
  }
}

export async function createSchedule(data: ScheduleFormData) {
  try {
    const response = await ScheduleManagementService.createSchedule(data)
    return { success: true, data: response.schedule }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create schedule" }
  }
}

export async function updateSchedule(id: string, data: ScheduleFormData) {
  try {
    const response = await ScheduleManagementService.updateSchedule(id, data)
    return { success: true, data: response.schedule }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update schedule" }
  }
}

export async function deleteSchedule(id: string) {
  try {
    await ScheduleManagementService.deleteSchedule(id)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete schedule" }
  }
}
