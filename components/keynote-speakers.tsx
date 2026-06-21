import { Card } from "@/components/ui/card"
import { Mic, User2 } from "lucide-react"
import { motion } from "framer-motion"
import { ReactNode } from "react"
import Image from "next/image"

const AnimatedCard = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 280 }} className={className}>
      <Card className="p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow h-full">{children}</Card>
    </motion.div>
  )
}

const keynoteSpeakers = [
  {
    name: "Thomas Trikasih Lembong",
    title: [
      "Indonesian Minister of Trade (2015-2016)",
      "Head of Indonesia's Investment Coordinating Board (2016-2019)",
      "Advisory Board Member of the Institute for International Strategic Studies (IISS)",
    ],
    image: "/speakers/TomLembong.png",
  },
  {
    name: "Ali Andika Wardhana",
    title: ["Deputy Chief of Mission, The Embassy of the Republic of Indonesia in Seoul"],
    image: "/speakers/AliAndikaWardanapng",
  },
]

const plenarySpeakers = [
  {
    name: "Prof. Hyung-Jun Kim",
    title: ["Department of Cultural Anthropology, Kangwon National University"],
    image: "/speakers/ProfHyungJunKim.png",
  },
  {
    name: "Prof. Bernado Nugroho Yahya",
    title: ["Department of Industrial and Management Engineering, Hankuk University of Foreign Studies"],
    image: "/speakers/ProfBernado.png",
  },
]

const SpeakerCard = ({ name, title, image, large = false }: { name: string; title: string[]; image?: string; large?: boolean }) => (
  <AnimatedCard className="h-full">
    <div className="flex flex-col gap-4 items-start h-full">
      <div className={`relative w-full rounded-xl overflow-hidden bg-muted border shrink-0 ${large ? "h-72 md:h-80" : "h-64 md:h-72"}`}>
        {image ? (
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
        ) : null}
        <div className={`fallback-icon h-full w-full items-center justify-center flex ${image ? "hidden" : ""}`}>
          <User2 className="h-12 w-12 text-muted-foreground/60" />
        </div>
      </div>
      <div className="w-full min-h-28 flex flex-col">
        <h4 className="text-lg sm:text-xl font-semibold leading-snug">{name}</h4>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground leading-relaxed">
          {title.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  </AnimatedCard>
)

const KeynoteSpeakers = () => {
  return (
    <section id="speakers" className="py-8 sm:py-12 md:py-20 px-2 sm:px-4 bg-white scroll-mt-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 justify-center mb-6 sm:mb-8">
          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full">
            <Mic className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">Speakers</h2>
        </div>
        <div className="space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">Keynote Speakers</p>
            <div className="grid md:grid-cols-2 gap-4 items-stretch">
              {keynoteSpeakers.map((speaker) => (
                <div key={speaker.name} className="h-full">
                  <SpeakerCard
                    name={speaker.name}
                    title={speaker.title}
                    image={speaker.image}
                    large
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">Plenary Speakers</p>
            <div className="grid md:grid-cols-2 gap-4 items-stretch">
              {plenarySpeakers.map((speaker) => (
                <div key={speaker.name} className="h-full">
                  <SpeakerCard
                    name={speaker.name}
                    title={speaker.title}
                    image={speaker.image}
                    large
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default KeynoteSpeakers
