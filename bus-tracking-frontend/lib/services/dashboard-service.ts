import { apiClient } from "@/lib/api-client"
import type { DashboardStats, Bus, Movement, Payment } from "@/lib/schemas/dashboard"

export class DashboardService {
  static async getStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>("/dashboard/stats")
  }

  static async getBuses(): Promise<Bus[]> {
    return apiClient.get<Bus[]>("/buses")
  }

  static async getRecentMovements(limit = 5): Promise<Movement[]> {
    return apiClient.get<Movement[]>(`/movements?limit=${limit}&sort=desc`)
  }

  static async getDailyPayments(): Promise<Payment[]> {
    return apiClient.get<Payment[]>("/payments?period=today")
  }

  static async getTotalDailyPayments(): Promise<number> {
    const payments = await this.getDailyPayments()
    return payments.reduce((sum, payment) => {
      if (payment.status === "completed") {
        return sum + payment.amount
      }
      return sum
    }, 0)
  }
}
