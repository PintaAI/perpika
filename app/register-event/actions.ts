'use server'

import { db } from '@/lib/db'
import { RegistrationType } from './constants'
import { formSchema } from './schemas'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function checkEarlyBirdStatus() {
  try { //check if early bird period is active manually
    const now = new Date();
    const currentPeriod = await db.earlyBirdPeriod.findFirst({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now }
      },
      orderBy: {
        endDate: 'desc'
      }
    });
    return { isEarlyBird: !!currentPeriod, period: currentPeriod };
  } catch (error) {
    console.error('Error checking early bird status:', error);
    return { isEarlyBird: false, period: null };
  }
}

export async function getRegistrationFee(type: keyof typeof RegistrationType, isEarlyBird: boolean) {
  try {
    const fee = await db.registrationFee.findFirst({
      where: { registrationType: type }
    });
    return isEarlyBird ? fee?.earlyBirdFee : fee?.regularFee;
  } catch (error) {
    console.error('Error fetching registration fee:', error);
    return null;
  }
}

export async function registerEvent(formData: FormData) {
  try {
    // Convert FormData to object
    const rawData = Object.fromEntries(formData.entries())
    
    // Parse boolean values
    const data = {
      ...rawData,
      agreeToTerms: rawData.agreeToTerms === 'true',
      // Parse presenters array if it exists
      presenters: rawData.presenters ? JSON.parse(String(rawData.presenters)) : undefined,
    }

    // Validate the data
    const validatedData = formSchema.parse(data)

    // Check early bird status
    const { isEarlyBird, period } = await checkEarlyBirdStatus();

    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Create registration in database with the appropriate related records
    const registration = await db.registration.create({
      data: {
        attendingAs: validatedData.attendingAs,
        sessionType: validatedData.sessionType,
        registrationType: validatedData.registrationType,
        proofOfPayment: validatedData.proofOfPayment,
        paymentStatus: 'PENDING',
        isEarlyBird,
        periodId: period?.id,

        presenterRegistration: {
          create: {
            email: validatedData.email,
            currentStatus: validatedData.currentStatus,
            affiliation: validatedData.affiliation,
            topicPreference: validatedData.topicPreference,
            presentationTitle: validatedData.presentationTitle,
            PaperSubmission: validatedData.PaperSubmission,
            presenters: {
              create: validatedData.presenters.map((presenter: any, index: number) => ({
                ...presenter,
                order: index + 1
              }))
            },
            user: {
              create: {
                email: validatedData.email,
                password: hashedPassword,
                name: validatedData.presenters[0].name,
                role: 'PRESENTER'
              }
            }
          }
        }
      },
      include: {
        presenterRegistration: {
          include: {
            presenters: true
          }
        },
        participantRegistration: true
      }
    })

    revalidatePath('/register-event');
    return { success: true }; // Indicate successful registration
  } catch (error: any) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: error.message || 'Something went wrong'
    }
  }
}
