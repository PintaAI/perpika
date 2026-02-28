import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteRegistrationButton } from "./DeleteRegistrationButton";
import { UpdatePaymentStatusButton } from "./UpdatePaymentStatusButton";
import { RegistrationWithRelations } from "../../types";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Badge } from "@/components/ui/badge";
import { AttendingAs, RegistrationType } from "@prisma/client";
import Flag from 'react-world-flags';
import { db } from "@/lib/db";

// Helper function to map session type
function getSessionTypeLabel(sessionType: string | undefined): string {
    switch (sessionType) {
        case "ONLINE":
            return "Online";
        case "OFFLINE":
            return "Onsite";
        default:
            return sessionType || "Unknown";
    }
}

// Helper function to map country name to code (from ParticipantTab)
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

// Helper function to format currency
function formatCurrency(amount: number | null): string {
    if (amount === null) {
        return 'N/A';
    }
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
    }).format(amount);
}

function getPresentationTypeLabel(
  attendingAs: AttendingAs,
  registrationType: RegistrationType
): string {
  if (attendingAs === AttendingAs.PARTICIPANT) {
    return "Talk Session Participant";
  }

  switch (registrationType) {
    case RegistrationType.PRESENTER_INDONESIA_STUDENT_ONLINE:
    case RegistrationType.PRESENTER_INDONESIA_STUDENT_OFFLINE:
      return "Oral Presenter";
    case RegistrationType.PRESENTER_FOREIGNER_ONLINE:
    case RegistrationType.PRESENTER_FOREIGNER_OFFLINE:
      return "Poster Presenter";
    default:
      return "Presenter";
  }
}
interface PaymentStatusTabProps {
  registrations: RegistrationWithRelations[];
}

export async function PaymentStatusTab({ registrations }: PaymentStatusTabProps) {
  const registrationFees = await db.registrationFee.findMany({
    select: {
      registrationType: true,
      regularFee: true,
      earlyBirdFee: true,
    },
  });

  const feeMap = new Map(
    registrationFees.map((fee) => [
      fee.registrationType,
      {
        regularFee: fee.regularFee,
        earlyBirdFee: fee.earlyBirdFee,
      },
    ])
  );

    return (
    <Card>
      <CardHeader>
        <CardTitle>Status Pembayaran</CardTitle>
        <CardDescription>Kelola status pembayaran semua pendaftar.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              
              <TableHead>Name/Email</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Fee (KRW)</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Session Type</TableHead>
              <TableHead>Presentation</TableHead>
              <TableHead>Proof of Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => {
              const name = registration.presenterRegistration
                ? registration.presenterRegistration.presenters[0]?.name
                : registration.participantRegistration?.fullName;
              const email = registration.presenterRegistration
                ? registration.presenterRegistration.email
                : registration.participantRegistration?.email;
              const feeConfig = feeMap.get(registration.registrationType);
              const fee = feeConfig
                ? (registration.isEarlyBird ? feeConfig.earlyBirdFee : feeConfig.regularFee)
                : null;
              const nationality = registration.presenterRegistration
                ? registration.presenterRegistration.presenters[0]?.nationality
                : registration.participantRegistration?.nationality;

              return (
                <TableRow key={registration.id}>
   
                  <TableCell>
                    <div className="flex items-center gap-x-1">
                      <div className="font-medium">{name}</div>
                      <Badge variant={registration.attendingAs === "PRESENTER" ? "default" : "secondary"}>{registration.attendingAs}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <UpdatePaymentStatusButton
                      registrationId={registration.id}
                      currentStatus={registration.paymentStatus}
                    />

                  </TableCell>
                  <TableCell>
                    {fee !== null ? (
                        <div>{formatCurrency(fee)}</div>
                      ) : (
                        <div>N/A</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Flag code={getCountryCode(nationality)} className="h-4 w-auto" fallback={<span>{nationality}</span>} />
                  </TableCell>
                  <TableCell>
                    {getSessionTypeLabel(registration.sessionType)}
                  </TableCell>
                  <TableCell>
                    {getPresentationTypeLabel(registration.attendingAs, registration.registrationType)}
                  </TableCell>
                  <TableCell>
                    {registration.proofOfPayment && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Image
                            src={registration.proofOfPayment}
                            alt="Bukti Pembayaran"
                            width={50}
                            height={50}
                            className="rounded cursor-pointer"
                          />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[80%] sm:max-h-[80%] overflow-auto">
                          <VisuallyHidden>
                            <DialogTitle>Bukti Pembayaran</DialogTitle>
                          </VisuallyHidden>
                          <Image
                            src={registration.proofOfPayment}
                            alt="Bukti Pembayaran"
                            width={800}
                            height={800}
                            className="rounded mx-auto"
                          />
                        </DialogContent>
                      </Dialog>
                    )}
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
