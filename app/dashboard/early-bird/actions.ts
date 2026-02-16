'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function updateEarlyBirdRegistrationFee(
  id: number,
  data: {
    earlyBirdFee?: number
    regularFee?: number
  }
) {
  try {
    const fee = await db.registrationFee.update({
      where: { id },
      data,
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/early-bird')
    revalidatePath('/register-event')

    return { success: true, data: fee }
  } catch (error: any) {
    console.error('Failed to update registration fee:', error)
    return { success: false, error: error.message }
  }
}
