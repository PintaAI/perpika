"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteRegistrationButton } from "./DeleteRegistrationButton";
import { UpdatePaymentStatusButton } from "./UpdatePaymentStatusButton";
import { RegistrationWithRelations } from "../../types";
import { Badge } from "@/components/ui/badge";
import Flag from 'react-world-flags';
import { ExportButton } from "./ExportButton";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper function to map dietary preference
function getDietaryLabel(dietaryPreference: string | undefined | null): string {
    if (!dietaryPreference) {
        return 'N/A';
    }
    const dietaryMap: { [key: string]: string } = {
        "VEGAN": "Vegan",
        "HALAL": "Halal"
    }

    return dietaryMap[dietaryPreference] || 'N/A';
}

// Helper function to map country name to code
function getCountryCode(countryName: string | undefined): string {
  if (!countryName) {
    return '';
  }
  const countryMap: { [key: string]: string } = {
    "Indonesia": "ID",
    "Malaysia": "MY",
    "Singapore": "SG",
    "Thailand": "TH",
    "Vietnam": "VN",
    "Philippines": "PH",
    "Japan": "JP",
    "South Korea": "KR",
    "China": "CN",
    "India": "IN",
    "Australia": "AU",
    "United States": "US",
    "United Kingdom": "GB",
    "Germany": "DE",
    "France": "FR",
    "Netherlands": "NL",
    "Other": ""
  };

  return countryMap[countryName] || ''; // Return empty string if not found
}

interface ParticipantTabProps {
  registrations: RegistrationWithRelations[];
}

// Helper function to map status
function getStatusLabel(status: string | undefined) {
  switch (status) {
    case "WAITING_FOR_PAYMENT":
      return "Waiting for Payment";
    case "REGISTERED":
      return "Registered";
    case "-":
      return "Incomplete";
    case "BACHELOR_STUDENT":
      return "Bachelor Student";
    case "MASTER_STUDENT":
      return "Master Student";
    case "PHD_STUDENT":
      return "PhD Student";
    case "RESEARCHER_PROFESSIONAL":
      return "Researcher/Professional";
    case "OTHER":
      return "Other";
    default:
      return status || "Unknown";
  }
}

export function ParticipantTab({ registrations }: ParticipantTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSessionTypeChange = (registrationId: number, sessionType: string) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/update-session-type", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: registrationId, sessionType }),
        });
        const result = await response.json();
        if (!result.success) {
          alert("Gagal mengubah sesi");
        } else {
          router.refresh();
        }
      } catch {
        alert("Gagal mengubah sesi");
      }
    });
  };

  const handleExport = () => {
    // Prepare CSV headers
    const headers = [
      "Nama",
      "Email",
      "Status",
      "Sesi",
      "Afiliasi",
      "Kewarganegaraan",
      "Kota",
      "Status Pembayaran",
      "Preferensi Diet"
    ].join(",");

    // Prepare CSV rows
    const rows = registrations
      .filter((r) => r.attendingAs === "PARTICIPANT")
      .map((registration) => {
        const details = registration.participantRegistration;
        
        return [
          details?.fullName || "",
          details?.email || "",
          getStatusLabel(details?.currentStatus),
          registration.sessionType || "",
          details?.affiliation || "",
          details?.nationality || "",
          details?.cityState || "",
          registration.paymentStatus || "",
          registration.sessionType === "OFFLINE" 
            ? getDietaryLabel(details?.dietaryPreference)
            : "N/A"
        ].map(value => `"${value}"`).join(",");
      });

    // Combine headers and rows
    const csv = [headers, ...rows].join("\n");

    // Create and trigger download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `peserta-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Daftar Peserta</CardTitle>
            <CardDescription>Daftar semua peserta yang telah mendaftar.</CardDescription>
          </div>
          <ExportButton onExport={handleExport} />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              
              <TableHead>Nama/Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sesi</TableHead>
              <TableHead>Afiliasi</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead>Status Pembayaran</TableHead>
              <TableHead>Diet</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations
              .filter((r) => r.attendingAs === "PARTICIPANT")
              .map((registration) => {
                const details = registration.participantRegistration;
                const name = registration.participantRegistration?.fullName;
                const email = registration.participantRegistration?.email;

                return (
                  <TableRow key={registration.id}>
                    <TableCell>
                      <div className="flex items-center gap-x-1">
                        <div className="font-medium">{name}</div>
                        <Badge className="bg-accent text-gray-700">
                          {registration.attendingAs}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {email}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusLabel(details?.currentStatus)}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={registration.sessionType}
                        disabled={isPending}
                        onValueChange={(value) => handleSessionTypeChange(registration.id, value)}
                      >
                        <SelectTrigger className="w-28 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ONLINE">Online</SelectItem>
                          <SelectItem value="OFFLINE">Onsite</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{details?.affiliation}</TableCell>
                    <TableCell>
                      {registration.participantRegistration && (
                        <div className="text-sm">
                          <div className="flex items-center gap-x-1">
                            Kewarganegaraan:{" "}
                            <Flag
                              code={getCountryCode(
                                registration.participantRegistration.nationality
                              )}
                              className="h-4 w-auto"
                              fallback={
                                <span>
                                  {
                                    registration.participantRegistration
                                      .nationality
                                  }
                                </span>
                              }
                            />
                          </div>
                          <div className="text-muted-foreground">
                            {registration.participantRegistration.cityState}
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <UpdatePaymentStatusButton
                        registrationId={registration.id}
                        currentStatus={registration.paymentStatus}
                      />
                    </TableCell>
                    <TableCell>
                      {registration.sessionType === "OFFLINE"
                        ? getDietaryLabel(
                            registration.participantRegistration?.dietaryPreference
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <DeleteRegistrationButton registrationId={registration.id} />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
