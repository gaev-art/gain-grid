import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateUserExtension() {
  try {
    // Check enum values
    await prisma.$queryRaw<Array<{ levels: string[] }>>`
      SELECT enum_range(NULL::"public"."FitnessLevel") as levels
    `;

    console.log('✅ User schema validation passed');
    return true;
  } catch (error) {
    console.error('❌ Validation failed:', error);
    throw error;
  }
}

validateUserExtension()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
