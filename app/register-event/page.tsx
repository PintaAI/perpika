import RegisterEventForm from "./register-event-form";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";


export default function RegisterEventPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-dot-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background"></div>
      
      <div className="relative mx-auto w-full max-w-[600px] px-4 py-12 md:py-16">
        <div className="relative rounded-2xl bg-card/30 backdrop-blur-sm">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-background shadow-xl">
              <Image
                src="/perpika.png"
                alt="Perpika Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="flex flex-col items-center px-6 pt-16 text-center md:px-8">
            <div className="space-y-4 pb-8">
              <div className="space-y-2">
                <h1 className="bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
                  ICONIK 2026
                </h1>
                <p className="text-lg font-medium text-muted-foreground">
                  International Conference by Indonesian Students in Korea
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <span>27th June 2026</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>KAIST Guseong Campus, Daejeon, South Korea</span>
                </div>
              </div>

              <div className="mx-auto max-w-md pt-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Theme: Recent Innovations at the Multidisciplinary Crossroads for Indonesia&apos;s Sustainable Development Goals.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <RegisterEventForm />
        </div>
      </div>
    </div>
  )
}
