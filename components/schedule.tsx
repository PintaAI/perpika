"use client"
import { useEffect, useMemo, useState } from "react"

const scheduleItems = [
  {
    date: "16th February - 13th March 2026",
    title: "Early Bird Registration and Abstract Submission",
    checkpoint: "2026-03-13T23:59:59+09:00",
  },
  {
    date: "16th March - 30th April 2026",
    title: "Regular Registration and Abstract Submission",
    checkpoint: "2026-04-30T23:59:59+09:00",
  },
  {
    date: "11th May 2026",
    title: "Notification of Abstract Review Result",
    checkpoint: "2026-05-11T23:59:59+09:00",
  },
  {
    date: "16th May - 20th June 2026",
    title: "Registration for Talk Session Participants",
    checkpoint: "2026-06-20T23:59:59+09:00",
  },
  {
    date: "27th June 2026",
    title: "Main Event of ICONIK 2026",
    checkpoint: "2026-06-27T23:59:59+09:00",
  },
]

const Schedule = () => {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60 * 1000)
    return () => clearInterval(timer)
  }, [])

  const { progressPercent, checkpointDates } = useMemo(() => {
    const start = new Date("2026-02-16T00:00:00+09:00").getTime()
    const end = new Date("2026-06-27T23:59:59+09:00").getTime()
    const nowTs = now.getTime()
    const clamped = Math.min(Math.max(nowTs, start), end)
    const percent = ((clamped - start) / (end - start)) * 100
    return {
      progressPercent: `${percent}%`,
      checkpointDates: scheduleItems.map((item) => new Date(item.checkpoint).getTime()),
    }
  }, [now])

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-[880px] px-1">
        <div className="relative mt-10 h-1 rounded-full bg-border">
          <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-sky-500 transition-all duration-700" style={{ width: progressPercent }} />
        </div>
        <div className="grid grid-cols-5 gap-4 mt-0">
          {scheduleItems.map((item, index) => (
            <div key={item.title} className="relative pt-8">
              <div className={`absolute -top-3 left-0 h-7 w-7 rounded-full border-4 border-background shadow transition-colors ${
                now.getTime() >= checkpointDates[index] ? "bg-primary" : "bg-slate-300"
              }`} />
              <p className={`text-xs font-semibold uppercase tracking-wide ${
                now.getTime() >= checkpointDates[index] ? "text-primary" : "text-muted-foreground"
              }`}>{item.date}</p>
              <div className="mt-2 rounded-lg border bg-background p-3 shadow-sm min-h-24">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Schedule
