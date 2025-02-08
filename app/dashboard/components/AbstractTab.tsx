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
import { RegistrationWithRelations } from "../../types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

interface AbstractTabProps {
  registrations: RegistrationWithRelations[];
}

export function AbstractTab({ registrations }: AbstractTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Abstrak</CardTitle>
        <CardDescription>
          Lihat dan kelola abstrak yang dikirimkan oleh presenter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Presenters / Email</TableHead>
              <TableHead>Judul Presentasi</TableHead>
              <TableHead>Abstrak</TableHead>
              <TableHead>Status Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations
              .filter((r) => r.attendingAs === "PRESENTER")
              .map((registration) => {
                const name = registration.presenterRegistration
                  ? registration.presenterRegistration.presenters
                      .map((p) => p.name)
                      .join(", ")
                  : "";
                const email = registration.presenterRegistration?.email || "";
                const title =
                  registration.presenterRegistration?.presentationTitle || "";
                const abstractPath =
                  registration.presenterRegistration?.abstractSubmission || "";
                const isReviewed =
                  registration.presenterRegistration?.isAbstractReviewed;

                return (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">{registration.id}</TableCell>
                    <TableCell>
                      <div>{name}</div>
                      <div className="text-sm text-muted-foreground">
                        {email}
                      </div>
                    </TableCell>
                    <TableCell>{title}</TableCell>
                    <TableCell>
                      {abstractPath ? (
                        abstractPath === "test" ? (
                          <p>Abstract Not Uploaded</p>
                        ) : (
                          <Button variant="outline" asChild>
                            <Link
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`/dashboard/abstracts/${registration.presenterRegistration?.id}`}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat Abstrak
                            </Link>
                          </Button>
                        )
                      ) : (
                        "Tidak ada abstrak"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={isReviewed ? "default" : "destructive"}>
                        {isReviewed ? "Reviewed" : "Not Reviewed"}
                      </Badge>
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
