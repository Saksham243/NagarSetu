// Seed script for NagarSetu Firestore database
// Run with: node src/data/seed.js path/to/serviceAccountKey.json

import admin from 'firebase-admin'
import { readFileSync } from 'fs'

// Initialize Firebase Admin
const serviceAccountPath = process.argv[2] // eslint-disable-line no-undef
if (!serviceAccountPath) {
  console.error('Usage: node src/data/seed.js <path-to-service-account-key.json>')
  process.exit(1) // eslint-disable-line no-undef
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

// Sample scheme data
const schemes = [
  {
    title: 'Gruha Lakshmi',
    state: 'Karnataka',
    category: 'Women & Family',
    description: 'Monthly financial assistance to women from economically weaker sections to enhance their socio-economic status.',
    benefit: '₹2,000/month',
    eligibility: 'Women aged 18-60 from families with annual income less than ₹2.5 lakh',
    applyUrl: 'https://sevasindhu.karnataka.gov.in/',
    topic: 'Women & Family',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: 'Yuva Nidhi',
    state: 'Karnataka',
    category: 'Employment',
    description: 'Unemployment allowance for educated youth who are unable to find employment.',
    benefit: '₹3,000/month',
    eligibility: 'Unemployed graduates aged 18-35 with family income less than ₹2 lakh/year',
    applyUrl: 'https://sevasindhu.karnataka.gov.in/',
    topic: 'Employment',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: 'Ayushman Bharat',
    state: 'Central',
    category: 'Health',
    description: 'Health insurance scheme providing coverage up to ₹5 lakh per family per year for secondary and tertiary care hospitalization.',
    benefit: '₹5 lakh coverage',
    eligibility: 'Families identified through SECC database',
    applyUrl: 'https://www.pmjay.gov.in/',
    topic: 'Health',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: 'PM Kisan',
    state: 'Central',
    category: 'Agriculture',
    description: 'Income support scheme for small and marginal farmers.',
    benefit: '₹6,000/year',
    eligibility: 'Small and marginal farmers with landholding up to 2 hectares',
    applyUrl: 'https://pmkisan.gov.in/',
    topic: 'Agriculture',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: 'Startup India',
    state: 'Central',
    category: 'Startup & Business',
    description: 'Government initiative to promote entrepreneurship and innovation.',
    benefit: 'Tax exemptions, funding support',
    eligibility: 'New startups incorporated after 2016',
    applyUrl: 'https://www.startupindia.gov.in/',
    topic: 'Startup & Business',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: 'Ladki Bahin Yojana',
    state: 'Maharashtra',
    category: 'Women & Family',
    description: 'Financial assistance for girl child education and marriage.',
    benefit: '₹1,500/month + ₹1 lakh at marriage',
    eligibility: 'Girls from families with annual income less than ₹8 lakh',
    applyUrl: 'https://aaplesarkar.maharashtra.gov.in/',
    topic: 'Women & Family',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: 'Lek Ladki',
    state: 'Maharashtra',
    category: 'Women & Family',
    description: 'One-time financial assistance to families on birth of a girl child.',
    benefit: '₹1,01,000',
    eligibility: 'Families with annual income less than ₹8 lakh',
    applyUrl: 'https://aaplesarkar.maharashtra.gov.in/',
    topic: 'Women & Family',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: 'Anna Bhagya',
    state: 'Karnataka',
    category: 'Social Welfare',
    description: 'Rice at subsidized rates for BPL families.',
    benefit: '30kg rice at ₹5/kg',
    eligibility: 'BPL families identified through state survey',
    applyUrl: 'https://ahara.karnataka.gov.in/',
    topic: 'Social Welfare',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: 'PM SVANidhi',
    state: 'Central',
    category: 'Startup & Business',
    description: 'Micro-credit facility for street vendors.',
    benefit: '₹10,000 loan',
    eligibility: 'Street vendors with valid certificate',
    applyUrl: 'https://pmsvanidhi.mohua.gov.in/',
    topic: 'Startup & Business',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: 'PMAY',
    state: 'Central',
    category: 'Housing',
    description: 'Pradhan Mantri Awas Yojana for affordable housing.',
    benefit: '₹2.5 lakh subsidy',
    eligibility: 'EWS/LIG families in urban areas',
    applyUrl: 'https://pmaymis.gov.in/',
    topic: 'Housing',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: 'Mid-Day Meal',
    state: 'Central',
    category: 'Education',
    description: 'Nutritious meal provided to school children.',
    benefit: 'Free nutritious meal',
    eligibility: 'Children studying in government schools',
    applyUrl: 'https://mdm.nic.in/',
    topic: 'Education',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: 'MGNREGA',
    state: 'Central',
    category: 'Employment',
    description: 'Guarantee of 100 days of wage employment.',
    benefit: '₹250/day wage',
    eligibility: 'Rural households willing to do unskilled manual work',
    applyUrl: 'https://nrega.nic.in/',
    topic: 'Employment',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
]

async function seedDatabase() {
  console.log('Starting database seeding...')

  for (const scheme of schemes) {
    try {
      const docRef = await db.collection('schemes').add(scheme)
      console.log(`✅ Added scheme: ${scheme.title} (${docRef.id})`)
    } catch (error) {
      console.error(`❌ Error adding scheme ${scheme.title}:`, error)
    }
  }

  console.log('Database seeding completed!')
  process.exit(0) // eslint-disable-line no-undef
}

seedDatabase().catch((error) => {
  console.error('Seeding failed:', error)
  process.exit(1) // eslint-disable-line no-undef
})