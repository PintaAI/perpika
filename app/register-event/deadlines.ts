import { SessionType } from "./constants"

export const TALKSHOW_PARTICIPANT_DEADLINES = {
  [SessionType.OFFLINE]: {
    label: "Onsite",
    displayDate: "21 June 2026, 23:59 KST",
    closesAt: "2026-06-21T23:59:00+09:00",
  },
  [SessionType.ONLINE]: {
    label: "Online",
    displayDate: "25 June 2026, 23:59 KST",
    closesAt: "2026-06-25T23:59:00+09:00",
  },
} as const

export function isTalkshowParticipantClosed(sessionType: string | undefined, now = new Date()) {
  if (sessionType !== SessionType.ONLINE && sessionType !== SessionType.OFFLINE) {
    return false
  }

  return now.getTime() > new Date(TALKSHOW_PARTICIPANT_DEADLINES[sessionType].closesAt).getTime()
}
