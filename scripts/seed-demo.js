const {
  PrismaClient,
  AttendingAs,
  SessionType,
  RegistrationType,
  PaymentStatus,
  CurrentStatus,
  TopicPreference,
  DietaryPreference,
  Gender,
} = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function bool(chance = 0.5) {
  return Math.random() < chance
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const firstNames = [
  'Alya', 'Bima', 'Citra', 'Dewi', 'Eko', 'Fajar', 'Gita', 'Hana',
  'Indra', 'Joko', 'Kirana', 'Luthfi', 'Maya', 'Nadia', 'Oki', 'Putri',
  'Qori', 'Rafi', 'Salsa', 'Tari', 'Umar', 'Vina', 'Wahyu', 'Yusuf', 'Zahra',
]

const lastNames = [
  'Pratama', 'Saputra', 'Wibowo', 'Nugroho', 'Sari', 'Utami', 'Rahman',
  'Putra', 'Ananda', 'Permata', 'Lestari', 'Maulana', 'Hidayat', 'Susanto',
]

const cities = [
  'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang', 'Medan', 'Makassar',
]

const affiliations = [
  'Universitas Indonesia',
  'Institut Teknologi Bandung',
  'Universitas Gadjah Mada',
  'Universitas Airlangga',
  'Kangwon National University',
  'Seoul National University',
]

const countries = ['Indonesia', 'South Korea', 'Malaysia', 'Singapore', 'Japan']

const presenterTypes = [
  RegistrationType.PRESENTER_INDONESIA_STUDENT_ONLINE,
  RegistrationType.PRESENTER_INDONESIA_STUDENT_OFFLINE,
  RegistrationType.PRESENTER_FOREIGNER_ONLINE,
  RegistrationType.PRESENTER_FOREIGNER_OFFLINE,
]

const participantTypes = [
  RegistrationType.ONLINE_PARTICIPANT_ONE_DAY,
  RegistrationType.ONLINE_PARTICIPANT_TWO_DAYS,
  RegistrationType.OFFLINE_PARTICIPANT_ONE_DAY,
  RegistrationType.OFFLINE_PARTICIPANT_TWO_DAYS,
]

async function ensureDefaultAdmin() {
  const hashed = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: 'Admin',
      role: 'ADMIN',
      password: hashed,
    },
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      role: 'ADMIN',
      password: hashed,
    },
  })

  console.log('Admin ensured: admin@example.com / admin123')
}

async function ensureRegistrationFees() {
  const fees = [
    { registrationType: RegistrationType.ONLINE_PARTICIPANT_ONE_DAY, regularFee: 5000, earlyBirdFee: 5000 },
    { registrationType: RegistrationType.ONLINE_PARTICIPANT_TWO_DAYS, regularFee: 5000, earlyBirdFee: 5000 },
    { registrationType: RegistrationType.OFFLINE_PARTICIPANT_ONE_DAY, regularFee: 15000, earlyBirdFee: 15000 },
    { registrationType: RegistrationType.OFFLINE_PARTICIPANT_TWO_DAYS, regularFee: 15000, earlyBirdFee: 15000 },
    { registrationType: RegistrationType.PRESENTER_INDONESIA_STUDENT_ONLINE, regularFee: 25000, earlyBirdFee: 20000 },
    { registrationType: RegistrationType.PRESENTER_INDONESIA_STUDENT_OFFLINE, regularFee: 50000, earlyBirdFee: 40000 },
    { registrationType: RegistrationType.PRESENTER_FOREIGNER_ONLINE, regularFee: 25000, earlyBirdFee: 20000 },
    { registrationType: RegistrationType.PRESENTER_FOREIGNER_OFFLINE, regularFee: 50000, earlyBirdFee: 40000 },
  ]

  await prisma.registrationFee.deleteMany()
  await prisma.registrationFee.createMany({ data: fees })
}

function makeName() {
  return `${pick(firstNames)} ${pick(lastNames)}`
}

function makeEmail(name, i, prefix) {
  const slug = name.toLowerCase().replace(/\s+/g, '.')
  return `${prefix}.${slug}.${i}@example.com`
}

async function createParticipant(i) {
  const name = makeName()
  const sessionType = pick([SessionType.ONLINE, SessionType.OFFLINE])
  const registrationType = sessionType === SessionType.ONLINE
    ? pick(participantTypes.slice(0, 2))
    : pick(participantTypes.slice(2))

  return prisma.registration.create({
    data: {
      attendingAs: AttendingAs.PARTICIPANT,
      sessionType,
      registrationType,
      paymentStatus: pick([PaymentStatus.PENDING, PaymentStatus.CONFIRMED, PaymentStatus.REJECTED]),
      isEarlyBird: bool(0.35),
      proofOfPayment: `https://example.com/payments/participant-${i}.png`,
      participantRegistration: {
        create: {
          fullName: name,
          gender: pick([Gender.MALE, Gender.FEMALE]),
          nationality: pick(countries),
          cityState: pick(cities),
          email: makeEmail(name, i, 'participant'),
          currentStatus: pick(Object.values(CurrentStatus)),
          affiliation: pick(affiliations),
          dietaryPreference: sessionType === SessionType.OFFLINE ? pick(Object.values(DietaryPreference)) : null,
        },
      },
    },
  })
}

async function createPresenter(i) {
  const leadName = makeName()
  const isForeign = bool(0.4)
  const sessionType = pick([SessionType.ONLINE, SessionType.OFFLINE])

  let registrationType
  if (isForeign) {
    registrationType = sessionType === SessionType.ONLINE
      ? RegistrationType.PRESENTER_FOREIGNER_ONLINE
      : RegistrationType.PRESENTER_FOREIGNER_OFFLINE
  } else {
    registrationType = sessionType === SessionType.ONLINE
      ? RegistrationType.PRESENTER_INDONESIA_STUDENT_ONLINE
      : RegistrationType.PRESENTER_INDONESIA_STUDENT_OFFLINE
  }

  const email = makeEmail(leadName, i, 'presenter')
  const password = await bcrypt.hash('presenter123', 10)

  const additionalCount = randInt(0, 2)
  const presenters = [{ name: leadName, nationality: isForeign ? pick(countries.filter((c) => c !== 'Indonesia')) : 'Indonesia' }]
  for (let idx = 0; idx < additionalCount; idx += 1) {
    presenters.push({ name: makeName(), nationality: pick(countries) })
  }

  return prisma.registration.create({
    data: {
      attendingAs: AttendingAs.PRESENTER,
      sessionType,
      registrationType,
      paymentStatus: pick([PaymentStatus.PENDING, PaymentStatus.CONFIRMED, PaymentStatus.REJECTED]),
      isEarlyBird: bool(0.35),
      proofOfPayment: `https://example.com/payments/presenter-${i}.png`,
      presenterRegistration: {
        create: {
          email,
          currentStatus: pick(Object.values(CurrentStatus)),
          affiliation: pick(affiliations),
          topicPreference: pick(Object.values(TopicPreference)),
          presentationTitle: `Research Topic ${i}: ${pick(['AI', 'Health', 'Education', 'Sustainability', 'Materials'])}`,
          PaperSubmission: `https://example.com/papers/paper-${i}.pdf`,
          dietaryPreference: sessionType === SessionType.OFFLINE ? pick(Object.values(DietaryPreference)) : null,
          presenters: {
            create: presenters.map((p, idx) => ({
              name: p.name,
              nationality: p.nationality,
              order: idx + 1,
            })),
          },
          user: {
            create: {
              email,
              password,
              name: leadName,
              role: 'PRESENTER',
            },
          },
        },
      },
    },
  })
}

async function main() {
  const participantCount = Number(process.argv[2] || 14)
  const presenterCount = Number(process.argv[3] || 8)

  if (Number.isNaN(participantCount) || Number.isNaN(presenterCount)) {
    throw new Error('Counts must be numbers. Example: npm run seed-demo -- 20 10')
  }

  await ensureDefaultAdmin()
  await ensureRegistrationFees()

  for (let i = 1; i <= participantCount; i += 1) {
    await createParticipant(i)
  }

  for (let i = 1; i <= presenterCount; i += 1) {
    await createPresenter(i)
  }

  console.log(`Dummy data created: ${participantCount} participants, ${presenterCount} presenters.`)
  console.log('Presenter dummy login password: presenter123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
