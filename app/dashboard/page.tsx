import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { LogoutButton } from "@/components/auth/logout-button";

import {
  LayoutDashboard,
  Users,
  UserSquare2,
  Presentation,
  Leaf,
  UtensilsCrossed,
  Globe,
  Building,
  Timer
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { RegistrationFilters } from "./components/registration-filters";
import { Suspense } from "react";
import { AttendingAs, SessionType, Role } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParticipantTab } from "./components/ParticipantTab";
import { PresenterTab } from "./components/PresenterTab";
import { PaymentStatusTab } from "./components/PaymentStatusTab";
import { PaperTab } from "./components/PaperTab";
import { RegistrationWithRelations } from "../types";

type SearchParams = {
  search?: string;
  type?: AttendingAs;
  session?: SessionType;
};

interface PageProps {
  searchParams: SearchParams;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Get user with role from database
  const user = await db.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    redirect("/login");
  }

  // Redirect presenter to presenter dashboard
  if (user.role === Role.PRESENTER) {
    redirect("/presenter-dashboard");
  }

  // Get searchParams values
    const params = await Promise.resolve(searchParams)

    // Get filtered registrations
    const registrations: RegistrationWithRelations[] = await db.registration.findMany({
      where: {
        AND: [
          params.type
            ? { attendingAs: params.type }
            : {},
          params.session
            ? { sessionType: params.session }
            : {},
          params.search
            ? {
                OR: [
                  {
                    presenterRegistration: {
                      OR: [
                        { email: { contains: params.search, mode: 'insensitive' } },
                        { presenters: { some: { name: { contains: params.search, mode: 'insensitive' } } } }
                      ]
                    }
                  },
                  {
                    participantRegistration: {
                      OR: [
                        { email: { contains: params.search, mode: 'insensitive' } },
                        { fullName: { contains: params.search, mode: 'insensitive' } }
                      ]
                    }
                  }
                ]
              }
            : {},
        ],
      },
      include: {
        presenterRegistration: {
          include: {
            presenters: true,
          },
        },
        participantRegistration: true,
      },
      orderBy: {
        id: 'desc'
      }
    })

  return (
    <div className="container mx-auto py-10">
      
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 rounded-lg mb-8 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {user.role === Role.REVIEWER ? "Dashboard Reviewer" : "Dashboard Admin"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {user.role === Role.REVIEWER 
                  ? "Kelola dan review paper yang disubmit"
                  : "Kelola semua pendaftaran peserta"
                }
              </p>
            </div>
          </div>
          <LogoutButton className="flex items-center gap-2 hover:bg-destructive/90 transition-colors" />
        </div>
      </div>

      <div className="grid gap-6">
        {user.role !== Role.REVIEWER && (
          <>
            <Suspense>
              <RegistrationFilters />
            </Suspense>

            {/* Stats Cards with Dietary Info */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendaftar</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{registrations.length}</div>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-muted-foreground">
                      {registrations.filter(r => r.sessionType === "ONLINE").length} Online
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="h-3 w-3 text-purple-500" />
                    <span className="text-xs text-muted-foreground">
                      {registrations.filter(r => r.sessionType === "OFFLINE").length} Onsite
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t">
                  <div className="flex items-center gap-1.5">
                    <Leaf className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-muted-foreground">
                      {registrations.filter(
                        (r) =>
                          r.sessionType === "OFFLINE" &&
                          (r.presenterRegistration?.dietaryPreference === "VEGAN" ||
                            r.participantRegistration?.dietaryPreference === "VEGAN")
                      ).length} Vegan
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <UtensilsCrossed className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-muted-foreground">
                      {registrations.filter(
                        (r) =>
                          r.sessionType === "OFFLINE" &&
                          (r.presenterRegistration?.dietaryPreference === "HALAL" ||
                            r.participantRegistration?.dietaryPreference === "HALAL")
                      ).length} Halal
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Presenter</CardTitle>
              <Presentation className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {registrations.filter((r) => r.attendingAs === "PRESENTER").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Presenter terdaftar</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Peserta</CardTitle>
              <UserSquare2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {registrations.filter((r) => r.attendingAs === "PARTICIPANT").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Peserta terdaftar</p>
            </CardContent>
              </Card>
            </div>
          </>
        )}

        {user.role === Role.REVIEWER ? (
          <Tabs defaultValue="Paper" className="space-y-4 mt-6">
            <TabsList className="grid w-full grid-cols-1 h-12">
              <TabsTrigger value="Paper" className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Paper
              </TabsTrigger>
            </TabsList>
            <TabsContent value="Paper">
              <PaperTab registrations={registrations} />
            </TabsContent>
          </Tabs>
        ) : (
          <Tabs defaultValue="peserta" className="space-y-4 mt-6">
            <TabsList className="grid w-full grid-cols-5 h-12">
              <TabsTrigger value="peserta" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Peserta
              </TabsTrigger>
              <TabsTrigger value="presenter" className="flex items-center gap-2">
                <Presentation className="h-4 w-4" />
                Presenter
              </TabsTrigger>
              <TabsTrigger value="status_pembayaran" className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Status Pembayaran
              </TabsTrigger>
              <TabsTrigger value="Paper" className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Paper
              </TabsTrigger>
              <TabsTrigger value="early_bird" className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Early Bird
              </TabsTrigger>
            </TabsList>
            <TabsContent value="peserta">
              <ParticipantTab registrations={registrations} />
            </TabsContent>
            <TabsContent value="presenter">
              <PresenterTab registrations={registrations} />
            </TabsContent>
            <TabsContent value="status_pembayaran">
              <PaymentStatusTab registrations={registrations} />
            </TabsContent>
            <TabsContent value="Paper">
              <PaperTab registrations={registrations} />
            </TabsContent>
            <TabsContent value="early_bird">
              <Card>
                <iframe src="/dashboard/early-bird" className="w-full min-h-[800px] border-0" />
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
