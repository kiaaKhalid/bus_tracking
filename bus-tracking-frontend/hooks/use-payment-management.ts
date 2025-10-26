"use client"

import useSWR from "swr"
import { PaymentManagementService, type PaymentFilters } from "@/lib/services/payment-management-service"
import type { PaymentListResponse } from "@/lib/schemas/payment-management"

export function usePayments(filters: PaymentFilters = {}) {
  const filterKey = JSON.stringify(filters)
  const { data, error, isLoading, mutate } = useSWR<PaymentListResponse>(
    `payments-${filterKey}`,
    () => PaymentManagementService.getPayments(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    },
  )

  return {
    payments: data?.payments || [],
    total: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.pageSize || 50,
    isLoading,
    error,
    mutate,
  }
}

export async function updatePaymentStatus(id: string, statut: "PAYE" | "EN_ATTENTE") {
  try {
    const response = await PaymentManagementService.updatePaymentStatus(id, statut)
    return { success: true, data: response.payment }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update payment" }
  }
}
