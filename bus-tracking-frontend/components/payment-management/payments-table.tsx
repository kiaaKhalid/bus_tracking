"use client"

import { useState } from "react"
import { usePayments, updatePaymentStatus } from "@/hooks/use-payment-management"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { PaymentManagement } from "@/lib/schemas/payment-management"
import { CheckCircle2, Clock } from "lucide-react"
import { PaymentFilters, type FilterState } from "./payment-filters"

export function PaymentsTable() {
  const [filters, setFilters] = useState<FilterState>({})
  const { payments, isLoading, mutate } = usePayments({
    page: 1,
    pageSize: 50,
    ...filters,
  })
  const { toast } = useToast()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleMarkAsPaid = async (paymentId: string) => {
    setUpdatingId(paymentId)
    const result = await updatePaymentStatus(paymentId, "PAYE")
    if (result.success) {
      toast({
        title: "Success",
        description: "Payment marked as paid",
      })
      mutate()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update payment",
        variant: "destructive",
      })
    }
    setUpdatingId(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAYE":
        return "bg-green-100 text-green-800"
      case "EN_ATTENTE":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "QR":
        return "bg-blue-100 text-blue-800"
      case "CB":
        return "bg-purple-100 text-purple-800"
      case "ESPECES":
        return "bg-green-100 text-green-800"
      case "VIREMENT":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  if (isLoading && payments.length === 0) {
    return <div className="text-center py-8">Loading payments...</div>
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <PaymentFilters onFiltersChange={setFilters} />

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Bus</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Payment Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Method</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No payments found.
                </td>
              </tr>
            ) : (
              payments.map((payment: PaymentManagement) => (
                <tr key={payment.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{payment.busPlaque}</td>
                  <td className="px-6 py-4 font-semibold">{formatCurrency(payment.montant)}</td>
                  <td className="px-6 py-4">{formatDate(payment.datePaiement)}</td>
                  <td className="px-6 py-4">
                    <Badge className={`${getMethodColor(payment.methode)} border-0`}>{payment.methode}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {payment.statut === "PAYE" ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <Badge className={`${getStatusColor(payment.statut)} border-0`}>{payment.statut}</Badge>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <Badge className={`${getStatusColor(payment.statut)} border-0`}>{payment.statut}</Badge>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {payment.statut === "EN_ATTENTE" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsPaid(payment.id)}
                        disabled={updatingId === payment.id}
                        className="gap-1"
                      >
                        {updatingId === payment.id ? "Updating..." : "Mark as Paid"}
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-sm text-muted-foreground">
        Showing {payments.length} of {payments.length} payments
      </div>
    </div>
  )
}
