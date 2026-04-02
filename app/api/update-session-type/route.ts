import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { SessionType, RegistrationType } from "@prisma/client";

const registrationTypeMap: Partial<Record<RegistrationType, RegistrationType>> = {
  ONLINE_PARTICIPANT_ONE_DAY: RegistrationType.OFFLINE_PARTICIPANT_ONE_DAY,
  ONLINE_PARTICIPANT_TWO_DAYS: RegistrationType.OFFLINE_PARTICIPANT_TWO_DAYS,
  OFFLINE_PARTICIPANT_ONE_DAY: RegistrationType.ONLINE_PARTICIPANT_ONE_DAY,
  OFFLINE_PARTICIPANT_TWO_DAYS: RegistrationType.ONLINE_PARTICIPANT_TWO_DAYS,
  PRESENTER_INDONESIA_STUDENT_ONLINE: RegistrationType.PRESENTER_INDONESIA_STUDENT_OFFLINE,
  PRESENTER_INDONESIA_STUDENT_OFFLINE: RegistrationType.PRESENTER_INDONESIA_STUDENT_ONLINE,
  PRESENTER_FOREIGNER_ONLINE: RegistrationType.PRESENTER_FOREIGNER_OFFLINE,
  PRESENTER_FOREIGNER_OFFLINE: RegistrationType.PRESENTER_FOREIGNER_ONLINE,
};

export async function POST(request: Request) {
  try {
    const { id, sessionType } = await request.json();

    if (!id || !sessionType) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const registration = await db.registration.findUnique({ where: { id } });
    if (!registration) {
      return NextResponse.json({ success: false, error: "Registration not found" }, { status: 404 });
    }

    if (registration.sessionType === sessionType) {
      return NextResponse.json({ success: true });
    }

    const newRegistrationType = registrationTypeMap[registration.registrationType] ?? registration.registrationType;

    await db.registration.update({
      where: { id },
      data: {
        sessionType: sessionType as SessionType,
        registrationType: newRegistrationType,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating session type:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
