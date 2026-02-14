import { Card } from "@/components/ui/card"
import { Mic, User2 } from "lucide-react"
import { motion } from "framer-motion"
import { ReactNode } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const AnimatedCard = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 280 }} className={className}>
      <Card className="p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow h-full">{children}</Card>
    </motion.div>
  )
}

const keynoteSpeakers = [
  {
    name: "Anies Rasyid Baswedan, S.E., M.P.P., Ph.D.",
    title: "Governor of Jakarta (2017-2022); Minister of Education and Culture (2014-2016)",
    image: "/speakers/Anies%20Rasyid%20Baswedan.jpeg",
  },
  {
    name: "Prof. Brian Yuliarto, S.T., M.Eng., Ph.D.",
    title: "Minister of Higher Education, Science, and Technology (2025-now)",
    image: "/speakers/Prof.%20Brian%20Yuliarto.jpg",
  },
]

const plenarySpeakers = [
  {
    name: "Prof. Hyung-Jun Kim",
    title: "Department of Cultural Anthropology, Kangwon National University",
    image: "/speakers/Prof.%20Hyung-Jun%20Kim.jpg",
  },
]

const SpeakerCard = ({ name, title, image, large = false }: { name: string; title: string; image: string; large?: boolean }) => (
  <AnimatedCard className="h-full">
    <div className="flex flex-col gap-4 items-start h-full">
      <div className={`relative w-full rounded-xl overflow-hidden bg-muted border shrink-0 ${large ? "h-72 md:h-80" : "h-64 md:h-72"}`}>
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none"
            e.currentTarget.parentElement?.querySelector(".fallback-icon")?.classList.remove("hidden")
          }}
        />
        <div className="fallback-icon hidden h-full w-full items-center justify-center flex">
          <User2 className="h-12 w-12 text-muted-foreground/60" />
        </div>
      </div>
      <div className="w-full min-h-28 flex flex-col">
        <h4 className="text-lg sm:text-xl font-semibold leading-snug">{name}*</h4>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{title}</p>
      </div>
    </div>
  </AnimatedCard>
)

const KeynoteSpeakers = () => {
  const columns = [
    { ...keynoteSpeakers[0], label: "Keynote Speaker" },
    { ...keynoteSpeakers[1], label: "Keynote Speaker" },
    { ...plenarySpeakers[0], label: "Plenary Speaker" },
  ]

  return (
    <section id="speakers" className="py-8 sm:py-12 md:py-20 px-2 sm:px-4 bg-white scroll-mt-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 justify-center mb-6 sm:mb-8">
          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full">
            <Mic className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">Speakers</h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-4 items-stretch">
          {columns.map((speaker) => (
            <div key={speaker.name} className="h-full">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">{speaker.label}</p>
              <SpeakerCard
                name={speaker.name}
                title={speaker.title}
                image={speaker.image}
                large
              />
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-5">*on confirmation</p>
      </div>
    </section>
  )
}

export default KeynoteSpeakers
