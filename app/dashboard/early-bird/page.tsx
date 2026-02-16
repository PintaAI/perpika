import { Card } from "@/components/ui/card"
import { Toaster } from "sonner"
import { db } from "@/lib/db"
import { CreateEarlyBirdForm, EditEarlyBirdForm } from "./create-early-bird-form"
import { PriceList } from "./price-list"

async function getEarlyBirdData() {
  const [totalRegistrations, earlyBirdRegistrations, currentPeriod, registrationFees] = await Promise.all([
    db.registration.count(),
    db.registration.count({
      where: { isEarlyBird: true }
    }),
    db.earlyBirdPeriod.findFirst({
      where: { isActive: true },
      orderBy: { endDate: 'desc' }
    }),
    db.registrationFee.findMany({
      orderBy: { registrationType: 'asc' }
    })
  ]);

  return {
    total: totalRegistrations,
    earlyBird: earlyBirdRegistrations,
    percentage: totalRegistrations > 0 
      ? ((earlyBirdRegistrations / totalRegistrations) * 100).toFixed(1)
      : 0,
    currentPeriod,
    registrationFees
  };
}

export default async function EarlyBirdPage() {
  const data = await getEarlyBirdData();

  return (
    <>
      <Toaster />
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Early Bird Management</h1>
          <p className="text-muted-foreground">
            Manage early bird registration periods and view statistics
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Total Registrasi</h3>
            <p className="text-3xl font-bold">{data.total}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Registrasi Early Bird</h3>
            <p className="text-3xl font-bold">{data.earlyBird}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Persentase Early Bird</h3>
            <p className="text-3xl font-bold">{data.percentage}%</p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Periode Early Bird Saat Ini</h2>
            {data.currentPeriod ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Mulai</p>
                  <p className="font-medium">
                    {new Date(data.currentPeriod.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Berakhir</p>
                  <p className="font-medium">
                    {new Date(data.currentPeriod.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${data.currentPeriod.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">
                    {data.currentPeriod.isActive ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Edit Periode Saat Ini</h3>
                  <EditEarlyBirdForm
                    periodId={data.currentPeriod.id}
                    initialStartDate={data.currentPeriod.startDate}
                    initialEndDate={data.currentPeriod.endDate}
                  />
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Tidak ada periode early bird yang aktif</p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Buat Periode Early Bird Baru</h2>
            <CreateEarlyBirdForm />
          </Card>
          <PriceList fees={data.registrationFees} />
        </div>
      </div>
    </>
  )
}
