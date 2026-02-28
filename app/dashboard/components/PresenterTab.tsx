"use client";
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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Badge } from "@/components/ui/badge";
import Flag from "react-world-flags";
import { Edit, Trash2 } from "lucide-react";
import { ExportButton } from "./ExportButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaperStatus, RegistrationType } from "@prisma/client";
import { updatePaperFile, updatePaperStatus } from "../actions";


// Helper function to map dietary preference (from ParticipantTab)
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

// Helper function to map topic preference
function getTopicLabel(topic: string | undefined): string {
    if (!topic) {
        return '';
    }
    const topicMap: { [key: string]: string } = {
        "ENGINEERING": "Engineering",
        "HEALTH_SCIENCE": "Health Science",
        "LIFE_SCIENCE": "Life Science",
        "EARTH_SCIENCE": "Earth Science",
        "MATERIAL_SCIENCE": "Material Science",
        "SOCIAL_LAW_POLITICAL_SCIENCE": "Social, Law & Political Science",
        "HUMANITIES": "Humanities",
        "SPORTS_AND_ARTS": "Sports & Arts",
        "BUSINESS_PUBLIC_ADMINISTRATION": "Business & Public Administration",
        "EDUCATION": "Education"
    }
    return topicMap[topic] || '';
}

// Helper function to map status (adapted from ParticipantTab)
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

function getPresentationTypeLabel(registrationType: RegistrationType): string {
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

interface PresenterTabProps {
  registrations: RegistrationWithRelations[];
}

export function PresenterTab({ registrations }: PresenterTabProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleExport = () => {
    // Prepare CSV headers
    const headers = [
      "Name",
      "Email",
      "Status",
      "Presentation Type",
      "Session",
      "Affiliation",
      "Topic",
      "Nationality",
      "Presentation Title",
      "Paper URL",
      "Payment Status",
      "Dietary Preference",
      "Paper Status"
    ].join(",");

    // Prepare CSV rows
    const rows = registrations
      .filter((r) => r.attendingAs === "PRESENTER")
      .map((registration) => {
        const details = registration.presenterRegistration;
        const presenter = details?.presenters[0];
        
        return [
          presenter?.name || "",
          details?.email || "",
          getStatusLabel(details?.currentStatus),
          getPresentationTypeLabel(registration.registrationType),
          registration.sessionType || "",
          details?.affiliation || "",
          getTopicLabel(details?.topicPreference),
          presenter?.nationality || "",
          details?.presentationTitle || "",
          details?.PaperSubmission || "",
          registration.paymentStatus || "",
          details?.dietaryPreference ? getDietaryLabel(details.dietaryPreference) : "N/A",
          details?.paperStatus || ""
        ].map(value => `"${value}"`).join(",");
      });

    // Combine headers and rows
    const csv = [headers, ...rows].join("\n");

    // Create and trigger download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `presenters-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Daftar Presenter</CardTitle>
            <CardDescription>
              Daftar semua presenter dan kelola Paper mereka.
            </CardDescription>
          </div>
          <ExportButton onExport={handleExport} />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              
              <TableHead className="w-[200px]">Name/Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Presentation</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Affiliation</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Diet</TableHead>
              <TableHead>Paper Status</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations
              .filter((r) => r.attendingAs === "PRESENTER")
              .map((registration) => {
                const details = registration.presenterRegistration;
                const name = registration.presenterRegistration
                  ? registration.presenterRegistration.presenters[0]?.name
                  : "";
                const email = registration.presenterRegistration
                  ? registration.presenterRegistration.email
                  : "";

                return (
                  <TableRow key={registration.id}>
                    <TableCell>
                      <div className="flex items-center gap-x-1">
                        <div className="font-medium">{name}</div>
                        <Badge>{registration.attendingAs}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{email}</div>
                    </TableCell>
                    <TableCell>{getStatusLabel(details?.currentStatus)}</TableCell>
                    <TableCell>{getPresentationTypeLabel(registration.registrationType)}</TableCell>
                    <TableCell>{registration.sessionType}</TableCell>
                    <TableCell>{details?.affiliation}</TableCell>
                    <TableCell>
                      {registration.presenterRegistration && (
                        <div className="text-sm">
                          <div className="flex items-center gap-x-1">
                            <div>
                              Topic:{" "}
                              {getTopicLabel(
                                registration.presenterRegistration.topicPreference
                              )}
                            </div>
                            <Flag
                              code={getCountryCode(
                                registration.presenterRegistration.presenters[0]
                                  ?.nationality
                              )}
                              className="h-4 w-auto"
                              fallback={
                                <span>
                                  {
                                    registration.presenterRegistration
                                      .presenters[0]?.nationality
                                  }
                                </span>
                              }
                            />
                          </div>
                          <div className="text-primary">
                            Judul :
                            <a
                              href={
                                registration.presenterRegistration
                                  .PaperSubmission
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {registration.presenterRegistration.presentationTitle}
                            </a>
                          </div>
                          <div>
                            Presenters:{" "}
                            {registration.presenterRegistration.presenters
                              .map((p) => p.name)
                              .join(", ")}{" "}
                            ({registration.presenterRegistration.presenters.length}
                            )
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
                            registration.presenterRegistration?.dietaryPreference
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {registration.presenterRegistration && (
                        <Select
                          defaultValue={registration.presenterRegistration.paperStatus}
                          onValueChange={async (value) => {
                            const result = await updatePaperStatus(
                              registration.presenterRegistration!.id,
                              value as PaperStatus
                            );
                            if (!result.success) {
                              alert("Failed to update paper status");
                            }
                          }}
                        >
                          <SelectTrigger className="border-0 p-0 h-auto w-auto bg-transparent [&>span]:p-0 [&>span]:h-auto">
                            <div className="flex items-center gap-1">
                              <Badge
                                variant={
                                  registration.presenterRegistration.paperStatus === 'ACCEPTED' ? 'success' :
                                  registration.presenterRegistration.paperStatus === 'REVISION_REQUESTED' ? 'warning' :
                                  'secondary'
                                }
                              >
                                {registration.presenterRegistration.paperStatus.replace(/_/g, ' ')}
                              </Badge>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(PaperStatus).map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.replace(/_/g, " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-x-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Paper</DialogTitle>
                              <DialogDescription>
                                Upload a new Paper file (PDF).
                              </DialogDescription>
                            </DialogHeader>
                            <FileUpload
                              onChange={async (downloadURL) => {
                                if (downloadURL) {
                                  setLoadingId(
                                    registration.presenterRegistration!.id
                                  );
                                  const result = await updatePaperFile(
                                    registration.presenterRegistration!.id,
                                    downloadURL
                                  );
                                  if (result.success) {
                                    alert("Paper updated successfully!");
                                  } else {
                                    alert("Failed to update Paper");
                                  }
                                  setLoadingId(null);
                                }
                              }}
                            />
                            {loadingId ===
                              registration.presenterRegistration?.id && (
                              <p className="text-sm text-muted-foreground">
                                Uploading...
                              </p>
                            )}
                          </DialogContent>
                        </Dialog>
                        <form
                          method="post"
                          action="/api/registrations/delete"
                          onSubmit={(e) => {
                            if (
                              !confirm("Apakah anda yakin untuk menghapus?")
                            ) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={registration.id}
                          />
                          <Button
                            variant="destructive"
                            type="submit"
                            size="icon"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
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
