"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Users, MonitorSmartphone } from "lucide-react"
import { AttendingAs, SessionType } from "@prisma/client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export function RegistrationFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border shadow-sm mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama atau email..."
              defaultValue={searchParams.get("search") ?? ""}
              onChange={(e) => {
                router.push(
                  pathname + "?" + createQueryString("search", e.target.value)
                )
              }}
              className="pl-10 max-w-sm"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Select
            defaultValue={searchParams.get("type") ?? "all"}
            onValueChange={(value) => {
              router.push(pathname + "?" + createQueryString("type", value === "all" ? "" : value))
            }}
          >
            <SelectTrigger className="w-[180px] bg-white dark:bg-slate-900">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Tipe Pendaftar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value={AttendingAs.PRESENTER}>Presenter</SelectItem>
              <SelectItem value={AttendingAs.PARTICIPANT}>Peserta</SelectItem>
            </SelectContent>
          </Select>
          <Select
            defaultValue={searchParams.get("session") ?? "all"}
            onValueChange={(value) => {
              router.push(pathname + "?" + createQueryString("session", value === "all" ? "" : value))
            }}
          >
            <SelectTrigger className="w-[180px] bg-white dark:bg-slate-900">
              <MonitorSmartphone className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Tipe Sesi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Sesi</SelectItem>
              <SelectItem value={SessionType.ONLINE}>Online</SelectItem>
              <SelectItem value={SessionType.OFFLINE}>Onsite</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
