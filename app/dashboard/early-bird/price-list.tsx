"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { updateEarlyBirdRegistrationFee } from "./actions"
import { useState } from "react"
import { toast } from "sonner"

type RegistrationFee = {
  id: number
  registrationType: string
  regularFee: number
  earlyBirdFee: number
}

interface PriceListProps {
  fees: RegistrationFee[]
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatRegistrationType = (type: string) => {
  const labelMap: Record<string, string> = {
    PRESENTER_INDONESIA_STUDENT_OFFLINE: "Onsite Oral Presenter",
    PRESENTER_INDONESIA_STUDENT_ONLINE: "Online Oral Presenter",
    PRESENTER_FOREIGNER_OFFLINE: "Onsite Poster Presenter",
    PRESENTER_FOREIGNER_ONLINE: "Online Poster Presenter",
    OFFLINE_PARTICIPANT_ONE_DAY: "Onsite Talk Session Participant (1 Day)",
    OFFLINE_PARTICIPANT_TWO_DAYS: "Onsite Talk Session Participant (2 Days)",
    ONLINE_PARTICIPANT_ONE_DAY: "Online Talk Session Participant (1 Day)",
    ONLINE_PARTICIPANT_TWO_DAYS: "Online Talk Session Participant (2 Days)",
  }

  if (labelMap[type]) return labelMap[type]

  return type
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ')
}

export function PriceList({ fees }: PriceListProps) {
  const [rows, setRows] = useState(fees)
  const [savingId, setSavingId] = useState<number | null>(null)

  const registrationTypeOrder: Record<string, number> = {
    PRESENTER_INDONESIA_STUDENT_OFFLINE: 1,
    PRESENTER_INDONESIA_STUDENT_ONLINE: 2,
    PRESENTER_FOREIGNER_OFFLINE: 3,
    PRESENTER_FOREIGNER_ONLINE: 4,
    OFFLINE_PARTICIPANT_ONE_DAY: 5,
    OFFLINE_PARTICIPANT_TWO_DAYS: 6,
    ONLINE_PARTICIPANT_ONE_DAY: 7,
    ONLINE_PARTICIPANT_TWO_DAYS: 8,
  }

  const updateRowValue = (id: number, key: "regularFee" | "earlyBirdFee", value: string) => {
    const numberValue = Number(value)
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, [key]: Number.isFinite(numberValue) ? numberValue : 0 }
          : row
      )
    )
  }

  const onSave = async (id: number) => {
    const row = rows.find((item) => item.id === id)
    if (!row) return

    if (row.regularFee < 0 || row.earlyBirdFee < 0) {
      toast.error("Harga tidak boleh negatif")
      return
    }

    try {
      setSavingId(id)
      const result = await updateEarlyBirdRegistrationFee(id, {
        regularFee: row.regularFee,
        earlyBirdFee: row.earlyBirdFee,
      })

      if (!result.success) {
        throw new Error(result.error || "Gagal menyimpan")
      }

      toast.success("Harga registrasi berhasil diperbarui")
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan harga")
    } finally {
      setSavingId(null)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Daftar Harga Registrasi</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Kategori aktif di form saat ini: Oral Presenter dan Poster Presenter (Onsite/Online).
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipe Registrasi</TableHead>
            <TableHead>Harga Reguler</TableHead>
            <TableHead>Harga Early Bird</TableHead>
            <TableHead>Diskon</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...rows]
            .sort(
              (a, b) =>
                (registrationTypeOrder[a.registrationType] ?? 999) -
                (registrationTypeOrder[b.registrationType] ?? 999)
            )
            .map((fee) => {
            const savingsAmount = fee.regularFee - fee.earlyBirdFee
            const savingsPercent = fee.regularFee > 0
              ? ((savingsAmount / fee.regularFee) * 100).toFixed(0)
              : "0"
            return (
              <TableRow key={fee.id}>
                <TableCell className="font-medium">
                  {formatRegistrationType(fee.registrationType)}
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      min={0}
                      value={fee.regularFee}
                      onChange={(e) => updateRowValue(fee.id, "regularFee", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">{formatCurrency(fee.regularFee)}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      min={0}
                      value={fee.earlyBirdFee}
                      onChange={(e) => updateRowValue(fee.id, "earlyBirdFee", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">{formatCurrency(fee.earlyBirdFee)}</p>
                  </div>
                </TableCell>
                <TableCell className="text-green-600 font-medium">
                  {savingsPercent}% 
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => onSave(fee.id)}
                    disabled={savingId === fee.id}
                  >
                    {savingId === fee.id ? "Saving..." : "Save"}
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}
