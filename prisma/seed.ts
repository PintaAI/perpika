import { PrismaClient, RegistrationType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Delete existing registration fees
  await prisma.registrationFee.deleteMany()

  // Create registration fees with early bird prices
  const registrationFees = [
    {
      registrationType: RegistrationType.ONLINE_PARTICIPANT_ONE_DAY,
      regularFee: 5000,
      earlyBirdFee: 5000,
    },
    {
      registrationType: RegistrationType.ONLINE_PARTICIPANT_TWO_DAYS,
      regularFee: 5000,
      earlyBirdFee: 5000,
    },
    {
      registrationType: RegistrationType.OFFLINE_PARTICIPANT_ONE_DAY,
      regularFee: 15000,
      earlyBirdFee: 15000,
    },
    {
      registrationType: RegistrationType.OFFLINE_PARTICIPANT_TWO_DAYS,
      regularFee: 15000,
      earlyBirdFee: 15000,
    },
    {
      registrationType: RegistrationType.PRESENTER_INDONESIA_STUDENT_ONLINE,
      regularFee: 25000,
      earlyBirdFee: 20000,
    },
    {
      registrationType: RegistrationType.PRESENTER_INDONESIA_STUDENT_OFFLINE,
      regularFee: 50000,
      earlyBirdFee: 40000,
    },
    {
      registrationType: RegistrationType.PRESENTER_FOREIGNER_ONLINE,
      regularFee: 25000,
      earlyBirdFee: 20000,
    },
    {
      registrationType: RegistrationType.PRESENTER_FOREIGNER_OFFLINE,
      regularFee: 50000,
      earlyBirdFee: 40000,
    },
  ]

  for (const fee of registrationFees) {
    await prisma.registrationFee.create({
      data: fee,
    })
  }

  console.log('Registration fees seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
