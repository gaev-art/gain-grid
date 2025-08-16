import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateTrainingModels() {
  try {
    // Create a test training plan
    const testUser = await prisma.user.create({
      data: {
        email: 'test-user@example.com',
        name: 'Test User',
        password: 'hashedpassword',
        isActive: true,
      },
    });

    const testPlan = await prisma.trainingPlan.create({
      data: {
        userId: testUser.id,
        name: 'Test Training Plan',
        description: 'A test training plan for validation',
        status: 'ACTIVE',
        targetDurationWeeks: 4,
      },
    });

    // Create test reminder
    const testReminder = await prisma.reminder.create({
      data: {
        userId: testUser.id,
        trainingPlanId: testPlan.id,
        time: new Date(),
        frequency: 'DAILY',
        message: 'Test reminder message',
        active: true,
      },
    });

    // Test relationship
    await prisma.trainingPlan.findUnique({
      where: { id: testPlan.id },
      include: { reminders: true },
    });

    // Clean up test data
    await prisma.reminder.delete({ where: { id: testReminder.id } });
    await prisma.trainingPlan.delete({ where: { id: testPlan.id } });
    await prisma.user.delete({ where: { id: testUser.id } });

    console.log('✅ Training models validation passed');
    return true;
  } catch (error) {
    console.error('❌ Validation failed:', error);
    throw error;
  }
}

validateTrainingModels()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
