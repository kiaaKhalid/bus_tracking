"use client"

import useSWR from "swr"
import { BusManagementService } from "@/lib/services/bus-management-service"
import type { BusFormData, BusListResponse } from "@/lib/schemas/bus-management"

export function useBuses(page = 1, pageSize = 50) {
  const { data, error, isLoading, mutate } = useSWR<BusListResponse>(
    `buses-${page}-${pageSize}`,
    () => BusManagementService.getBuses(page, pageSize),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    },
  )

  return {
    buses: data?.buses || [],
    total: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.pageSize || 50,
    isLoading,
    error,
    mutate,
  }
}

export function useBusById(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `bus-${id}` : null,
    () => (id ? BusManagementService.getBusById(id) : null),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    },
  )

  return {
    bus: data?.bus,
    isLoading,
    error,
    mutate,
  }
}

export async function createBus(data: BusFormData) {
  try {
    const response = await BusManagementService.createBus(data)
    return { success: true, data: response.bus }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create bus" }
  }
}

export async function updateBus(id: string, data: BusFormData) {
  try {
    const response = await BusManagementService.updateBus(id, data)
    return { success: true, data: response.bus }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update bus" }
  }
}

export async function deleteBus(id: string) {
  try {
    await BusManagementService.deleteBus(id)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete bus" }
  }
}
