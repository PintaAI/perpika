import * as z from "zod"
import {
  AttendingAs,
  SessionType,
  CurrentStatus,
  TopicPreference,
  RegistrationType,
  PresentationCategory,
} from "./constants"

export const baseSchema = z.object({
  attendingAs: z.literal(AttendingAs.PRESENTER),
  presentationCategory: z.enum([PresentationCategory.ORAL, PresentationCategory.POSTER], {
    required_error: "Please select presentation category",
  }),
  sessionType: z.enum([SessionType.ONLINE, SessionType.OFFLINE], {
    required_error: "Please select your session type",
  }),
  registrationType: z.enum([
    RegistrationType.PRESENTER_INDONESIA_STUDENT_ONLINE,
    RegistrationType.PRESENTER_INDONESIA_STUDENT_OFFLINE,
    RegistrationType.PRESENTER_FOREIGNER_ONLINE,
    RegistrationType.PRESENTER_FOREIGNER_OFFLINE,
  ], {
    required_error: "Please select your registration type",
  }),
  proofOfPayment: z.string().refine((val) => val.startsWith("http"), {
    message: "Payment proof must be uploaded",
  }),
  agreeToTerms: z.boolean({
    required_error: "You must agree to the terms and conditions",
  }),
})

const presenterSchema = z.object({
  name: z.string().min(1, { message: "Presenter name is required" }),
  nationality: z.string().min(1, { message: "Presenter nationality is required" }),
})

export const presenterRegistrationSchema = z.object({
  presenters: z.array(presenterSchema)
    .min(1, { message: "At least one presenter is required" })
    .max(3, { message: "Maximum of three presenters allowed" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  currentStatus: z.enum([
    CurrentStatus.BACHELOR_STUDENT,
    CurrentStatus.MASTER_STUDENT,
    CurrentStatus.PHD_STUDENT,
    CurrentStatus.RESEARCHER_PROFESSIONAL,
    CurrentStatus.OTHER,
  ], {
    required_error: "Please select your current status",
  }),
  affiliation: z.string().min(1, { message: "Affiliation is required" }),
  topicPreference: z.enum([
    TopicPreference.ENGINEERING,
    TopicPreference.HEALTH_SCIENCE,
    TopicPreference.LIFE_SCIENCE,
    TopicPreference.EARTH_SCIENCE,
    TopicPreference.MATERIAL_SCIENCE,
    TopicPreference.SOCIAL_LAW_POLITICAL_SCIENCE,
    TopicPreference.HUMANITIES,
    TopicPreference.SPORTS_AND_ARTS,
    TopicPreference.BUSINESS_PUBLIC_ADMINISTRATION,
    TopicPreference.EDUCATION,
  ], {
    required_error: "Please select your topic preference",
  }),
  presentationTitle: z.string().min(1, { message: "Presentation title is required" }),
  PaperSubmission: z.string().min(1, { message: "Paper must be uploaded" }),
})

export const formSchema = z.object({
  ...baseSchema.shape,
  ...presenterRegistrationSchema.shape,
})
