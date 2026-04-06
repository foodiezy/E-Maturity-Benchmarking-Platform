import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with AIMM data...')

  const model = await prisma.maturityModel.create({
    data: {
      name: 'Adaptive Integrated Maturity Model (AIMM)',
      description: 'E-Maturity Assessment Model across People, Innovation, and Capability.',
      version: '1.0',
    }
  })

  const dimensions = [
    { name: 'People' },
    { name: 'Innovation' },
    { name: 'Capability' }
  ]

  const levels = [
    { level: 1, name: 'Random', description: 'Ad-hoc, inconsistent, and unpredictable.' },
    { level: 2, name: 'Emerging', description: 'Some processes defined but unstable.' },
    { level: 3, name: 'Specified', description: 'Processes defined, documented, and embedded.' },
    { level: 4, name: 'Measured', description: 'Quantitatively managed, more predictable.' },
    { level: 5, name: 'Aligned', description: 'Continuous improvement, aligned with strategy.' }
  ]

  for (const dim of dimensions) {
    const createdDim = await prisma.dimension.create({
      data: {
        name: dim.name,
        maturityModelId: model.id,
        description: `${dim.name} dimension of the AIMM.`
      }
    })

    // Create level descriptions
    for (const lvl of levels) {
      await prisma.levelDescription.create({
        data: {
          dimensionId: createdDim.id,
          level: lvl.level,
          name: lvl.name,
          description: lvl.description
        }
      })
    }

    // Define specific questions with codes based on PICaMM structure
    let dimensionQuestions: { code: string, text: string }[] = []
    
    if (dim.name === 'Innovation') {
      dimensionQuestions = [
        { code: 'QI1', text: "How important is innovation to the success of your company?" },
        { code: 'QI2', text: "Does innovation play a significant role in the strategic intent of your company?" },
        { code: 'QI3', text: "Is your company's strategy linked to its innovation process?" },
        { code: 'QI4', text: "Does your company ensure that innovative employee practices and technologies are identified and evaluated?" },
        { code: 'QI5', text: "Continuous employee innovation practices are institutionalised to ensure they are performed as defined in the company's innovation process." }
      ]
    } else if (dim.name === 'People') {
      dimensionQuestions = [
        { code: 'QP1', text: "The company has a well-defined skills improvement policy that consistently meets the employee's expectations for training and skills development." },
        { code: 'QP2', text: "Employees receive training to improve their knowledge and skill in accordance with the defined skills and development policy." },
        { code: 'QP3', text: "Employees are trained and encouraged to improve their knowledge and skills to fulfill more senior roles in the company." },
        { code: 'QP4', text: "The integration and empowerment of employee skills and abilities is managed quantitatively and is measured without bias." },
        { code: 'QP5', text: "There are individuals who are equipped to provide training to employees, consistently developing them for more significant roles in the company." }
      ]
    } else if (dim.name === 'Capability') {
      dimensionQuestions = [
        { code: 'QC1', text: "Employees are encouraged to continuously improve their skill and ability toward their personal work processes." },
        { code: 'QC2', text: "To what extent does your company maintain a positive attitude towards the application of processes that support the company structure?" },
        { code: 'QC3', text: "The employee's ability to apply skill-based processes is continuously being improved." },
        { code: 'QC4', text: "Do the defined operational processes of company enable high levels of service delivery and high quality products to the customer base?" },
        { code: 'QC5', text: "Organisational process areas are managed quantitatively to provide avenues of improvement." }
      ]
    }

    for (const q of dimensionQuestions) {
      await prisma.question.create({
        data: {
          code: q.code,
          text: q.text,
          dimensionId: createdDim.id
        }
      })
    }
  }

  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Create an admin user
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@aimm.local',
      password: hashedPassword,
      role: 'ADMIN',
    }
  })

  // Create an organization
  const org = await prisma.organization.create({
    data: {
      name: 'Global Tech Solutions',
      industry: 'Technology',
      size: 250,
    }
  })

  // Seed with standard risks as per the "Risk Management and Mitigation Plan" requirements
  await prisma.risk.createMany({
    data: [
      {
        organizationId: org.id,
        description: "Lack of senior management buy-in for digital transformation",
        probability: 4,
        impact: 9,
        status: "OPEN",
        mitigationPlan: "Regular steering committee meetings and ROI demonstration phase."
      },
      {
        organizationId: org.id,
        description: "Employee resistance to new 'Aligned' innovation processes",
        probability: 7,
        impact: 6,
        status: "OPEN",
        mitigationPlan: "Comprehensive change management program and internal workshops."
      },
      {
        organizationId: org.id,
        description: "Inconsistent data quality across dimensions affecting maturity scores",
        probability: 5,
        impact: 8,
        status: "OPEN",
        mitigationPlan: "Data validation checkpoints and automated collection tools."
      }
    ]
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
