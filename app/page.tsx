"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CountdownTimer } from "@/components/countdown-timer"
import {
  Calendar,
  Info,
  MapPin,
  Target,
  BookOpen,
  Users,
  FlaskConical,
  HeartPulse,
  Cpu,
  Leaf,
  GraduationCap,
  Palette,
  Briefcase,
  Landmark,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import KeynoteSpeakers from "@/components/keynote-speakers"
import Schedule from "@/components/schedule"
import { motion, useScroll, useSpring, useInView, useAnimation } from "framer-motion"
import { useRef, useEffect, ReactNode } from "react"

const Section = ({ children }: { children: ReactNode }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) controls.start("visible")
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      variants={{ visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}

const AnimatedCard = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 280 }} className={className}>
      <Card className="p-4 sm:p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow h-full">{children}</Card>
    </motion.div>
  )
}

const committees = [
  {
    title: "Chairman",
    members: ["Muhammad Naufal Fadhillah - Korea Advanced Institute of Science and Technology (KAIST)"],
  },
  {
    title: "Vice Chairman",
    members: ["Rani Nur Bening - Seoul National University of Science and Technology (SeoulTech)"],
  },
  {
    title: "Secretary",
    members: ["Adzaniya Maghfira Sausan - Seoul National University"],
  },
  {
    title: "Treasurer",
    members: ["Lutfiah Annisa Billa - Pohang University of Science and Technology (POSTECH)"],
  },
  {
    title: "Event Organizer",
    members: [
      "Fauzan Syarif Nursyafi - Kumoh National Institute of Technology",
      "Syifa Hana Agristya - Korea University of Science and Technology (UST)",
      "Abdul Basyir - Pusan National University",
      "Zahra Sakina Maharani - Korea University",
      "Jennifer Ilene - Dongseo University",
      "Afra Rafilah Khansa - Sunmoon University",
      "Rendy Saputra - Kangwon National University",
    ],
  },
  {
    title: "Scientific Board",
    members: [
      "Reza Adhitama Putra Hernanda - Chungbuk National University",
      "Triatma Putri - Pukyong National University",
      "Kriestian Valerio Sugianto - Korea Advanced Institute of Science and Technology (KAIST)",
    ],
  },
  {
    title: "External Relation",
    members: [
      "Lia Amelia Nurkhazanah - Keimyung University",
      "Dina Lestari - Sunchon National University",
      "Salsabiila Qurotu Aini Arri - Kongju National University",
    ],
  },
  {
    title: "Partnership",
    members: [
      "Vianny Quininta - Kangwon National University",
      "Latanggang Shinta Anindita - Korea University",
      "Anastasya Tangkas - Seoul National University",
      "Nabilah Nur Azizah - Yonsei University",
      "Najla Humaira Taslim - Soonchunhyang University",
      "Dian Paramita - KDI School of Public Policy and Management",
      "Candra Dwi Pebrian - Chungnam National University",
    ],
  },
  {
    title: "Media and Publication",
    members: [
      "Zahra Nabilla Putri - Ewha Womans University",
      "Alfito Fakhri Naufal - Yonsei University",
      "Michelle Angelina Hadi - Ewha Womans University",
      "Rhocelyn Angel - Yonsei University",
      "Ida Bagus Dwiweka Naratama - Kwangwoon University",
    ],
  },
  {
    title: "Logistic",
    members: ["Ilham Darni - Korea Advanced Institute of Science and Technology (KAIST)"],
  },
]

const topics = [
  { title: "Natural Sciences", icon: FlaskConical, tone: "bg-emerald-100 text-emerald-700" },
  { title: "Life and Health Science", icon: HeartPulse, tone: "bg-rose-100 text-rose-700" },
  { title: "Engineering and Applied Innovations", icon: Cpu, tone: "bg-blue-100 text-blue-700" },
  { title: "Earth, Energy, and Environment", icon: Leaf, tone: "bg-lime-100 text-lime-700" },
  { title: "Education and Human Capital", icon: GraduationCap, tone: "bg-amber-100 text-amber-700" },
  { title: "Art, Culture, and Society", icon: Palette, tone: "bg-fuchsia-100 text-fuchsia-700" },
  { title: "Economy and Business", icon: Briefcase, tone: "bg-cyan-100 text-cyan-700" },
  { title: "Law, Government, and Politics", icon: Landmark, tone: "bg-violet-100 text-violet-700" },
]

export default function Home() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <main className="min-h-screen relative bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50" style={{ scaleX }} />

      <Section>
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 sm:py-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
            <div className="absolute inset-0 opacity-10">
              <Image src="/perpika.png" alt="ICONIK 2026 Background" fill className="object-contain scale-[0.7]" />
            </div>
          </div>

          <div className="container relative z-10 max-w-6xl mx-auto px-4">
            <div className="space-y-8 sm:space-y-12">
              <div className="space-y-4 sm:space-y-6">
                <span className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">ICONIK 2026</span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-700 via-primary to-orange-500 leading-tight">
                  International Conference by Indonesian Students in Korea
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto">
                  Recent Innovations at the Multidisciplinary Crossroads for Indonesia&apos;s Sustainable Development Goals
                </p>
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />27th June 2026
                  </div>
                  <div className="flex items-center gap-2 text-center">
                    <MapPin className="h-5 w-5 text-primary" />KAIST Guseong Campus, Daejeon, South Korea
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
                <Link href="/register-event">
                  <Button size="lg" className="bg-primary shadow-xl text-white font-semibold px-8 py-6 rounded-md">
                    <Users className="w-5 h-5 mr-2" />REGISTER NOW
                  </Button>
                </Link>
                <Link
                  href="https://docs.google.com/document/d/1EPkIG_Jhl2cL9qMEdKHj0Kl8uRCR9LgV/edit?usp=sharing&ouid=109284380288306681099&rtpof=true&sd=true"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg" className="border-2 border-primary/80 hover:bg-primary/10 text-primary shadow-lg text-base font-semibold px-8 py-6 rounded-md">
                    Guideline
                  </Button>
                </Link>
              </div>

              <div>
                <CountdownTimer />
              </div>
            </div>
          </div>
        </section>
      </Section>

      <Section>
        <section id="about" className="py-10 sm:py-14 md:py-20 px-2 sm:px-4 bg-white/80 backdrop-blur-sm scroll-mt-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 justify-center mb-6 md:mb-8">
              <div className="p-2 bg-primary/10 rounded-full"><Info className="h-5 w-5 md:h-6 md:w-6 text-primary" /></div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">About Us and Objectives</h2>
            </div>
            <div className="grid gap-5">
              <AnimatedCard>
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 sm:p-8">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      About Us
                    </span>
                    <span className="text-4xl leading-none text-primary/20">"</span>
                  </div>
                  <div className="space-y-4 border-l-4 border-primary/30 pl-5 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    <p>
                    Indonesia is currently on an inspiring journey toward Indonesia Emas 2045, a vision marking a century of independence defined by prosperity, innovation, and global prominence. At the heart of this transformation is the academic diaspora, specifically Indonesian students abroad, who serve as dynamic architects of the nation&apos;s future.
                    </p>
                    <p>
                    Moving beyond the role of traditional learners, these students act as vital links in the global innovation chain. To harness this potential, ICONIK (International Conference by Indonesian Students in Korea) serves as a structured, reputable, and sustainable forum designed to integrate diverse disciplines in response to national and global challenges.
                    </p>
                    <p>
                    This conference emphasizes a multidisciplinary approach aligned with Indonesia&apos;s agenda to reach the Sustainable Development Goals (SDGs). Together, we celebrate these young minds as the primary drivers of progress, ensuring that the journey toward 2045 is fueled by inclusive, innovative, and sustainable solutions for a brighter Indonesia.
                    </p>
                  </div>
                </div>
              </AnimatedCard>

              <div id="objectives" className="grid gap-4 sm:gap-5 scroll-mt-16">
                <Card className="p-4 border bg-primary/5">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary/70" />
                    <h3 className="text-lg sm:text-xl font-semibold">Objectives</h3>
                  </div>
                </Card>
                <div className="grid lg:grid-cols-3 gap-4">
                  <AnimatedCard className="h-full">
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 h-full flex">
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Providing a credible scientific forum for Indonesian students and researchers, especially in South Korea, to present their latest research and innovations relevant to Indonesia&apos;s sustainable development.
                      </p>
                    </div>
                  </AnimatedCard>
                  <AnimatedCard className="h-full">
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 h-full flex">
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Facilitating the exchange of ideas, experiences, and networks between academics, policymakers, and public figures across disciplines and countries, especially Indonesia and South Korea.
                      </p>
                    </div>
                  </AnimatedCard>
                  <AnimatedCard className="h-full">
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 h-full flex">
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Strengthening the role of the Indonesian academic diaspora as strategic contributors to the knowledge and innovation ecosystem for sustainable national development.
                      </p>
                    </div>
                  </AnimatedCard>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Section>

      <KeynoteSpeakers />

      <Section>
        <section id="timeline" className="py-10 sm:py-14 md:py-20 px-2 sm:px-4 bg-gradient-to-r from-sky-50 to-orange-50 scroll-mt-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 justify-center mb-6 md:mb-8">
              <div className="p-2 bg-primary/10 rounded-full"><Calendar className="h-5 w-5 md:h-6 md:w-6 text-primary" /></div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">Timeline</h2>
            </div>
            <AnimatedCard>
              <Schedule />
            </AnimatedCard>
          </div>
        </section>
      </Section>


      <Section>
        <section id="topics" className="py-10 sm:py-14 md:py-20 px-2 sm:px-4 bg-white scroll-mt-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 justify-center mb-6 md:mb-8">
              <div className="p-2 bg-primary/10 rounded-full"><BookOpen className="h-5 w-5 md:h-6 md:w-6 text-primary" /></div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">Topics</h2>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-5 text-center">
              The scope of ICONIK 2026 includes, but is not limited to, the following fields:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topics.map((topic) => (
                <Card key={topic.title} className="p-4 border shadow-sm hover:shadow-md transition-shadow">
                  <div className={`inline-flex rounded-lg p-2 ${topic.tone}`}>
                    <topic.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-medium leading-snug">{topic.title}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </Section>

      <Section>
        <section id="venue" className="py-10 sm:py-14 md:py-20 px-2 sm:px-4 bg-slate-50 scroll-mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 justify-center mb-6 md:mb-8">
              <div className="p-2 bg-primary/10 rounded-full"><MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" /></div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">Location</h2>
            </div>
            <AnimatedCard>
              <div className="space-y-3">
                <p className="text-sm sm:text-base text-muted-foreground">Korea Advanced Institute of Science and Technology (KAIST), Daejeon</p>
                <iframe
                  src="https://maps.google.com/maps?q=Korea%20Advanced%20Institute%20of%20Science%20and%20Technology%20(KAIST),%20Daejeon&z=16&output=embed"
                  width="100%"
                  height="420"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </AnimatedCard>
          </div>
        </section>
      </Section>

      <Section>
        <section id="committee" className="py-10 sm:py-14 md:py-20 px-2 sm:px-4 bg-gradient-to-r from-slate-50 to-sky-50 scroll-mt-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 justify-center mb-6 md:mb-8">
              <div className="p-2 bg-primary/10 rounded-full"><Users className="h-5 w-5 md:h-6 md:w-6 text-primary" /></div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">Organizing Committee</h2>
            </div>
            <Card className="border bg-white/95 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b bg-slate-50/80">
                <p className="text-sm text-muted-foreground">
                  A concise view of the committee structure and members.
                </p>
              </div>
              <div className="divide-y">
                {committees.map((group) => (
                  <div key={group.title} className="px-5 py-4 grid gap-2 md:grid-cols-[220px_1fr] md:gap-4">
                    <h3 className="text-sm sm:text-base font-semibold text-foreground">{group.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {group.members.join(" • ")}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </Section>
    </main>
  )
}
