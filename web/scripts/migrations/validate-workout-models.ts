import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateWorkoutModels() {
  try {
    // Create test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test-workout@example.com',
        name: 'Test Workout User',
        password: 'hashedpassword',
        isActive: true,
      },
    });

    // Create test training plan
    const testPlan = await prisma.trainingPlan.create({
      data: {
        userId: testUser.id,
        name: 'Test Workout Plan',
        description: 'A plan for testing exercise and workout log models',
        status: 'ACTIVE',
      },
    });

    // Create test exercise
    const testExercise = await prisma.exercise.create({
      data: {
        name: 'Enhanced Bench Press',
        description: 'A chest exercise',
        trainingPlanId: testPlan.id,
        defaultSets: 3,
        defaultReps: 10,
        equipment: 'Barbell, Bench',
        primaryMuscleGroup: 'CHEST',
        otherMuscles: 'SHOULDERS,TRICEPS',
        exerciseType: 'STRENGTH',
        durationMinutes: 5,
        difficulty: 'INTERMEDIATE',
        instructions: 'Lie on bench, lower bar to chest, press up',
      },
    });

    // Test relationships
    await prisma.trainingPlan.findUnique({
      where: { id: testPlan.id },
      include: { exercises: true },
    });

    // Create test workout log
    const testWorkoutLog = await prisma.workoutLog.create({
      data: {
        userId: testUser.id,
        exerciseId: testExercise.id,
        date: new Date(),
        sets: 4,
        reps: 8,
        weight: 185.5,
        durationMinutes: 6,
        rating: 5,
        mood: 'EXCELLENT',
        notes: 'Felt strong today',
      },
    });

    // Test relationships
    await prisma.user.findUnique({
      where: { id: testUser.id },
      include: { workoutLogs: true },
    });

    await prisma.exercise.findUnique({
      where: { id: testExercise.id },
      include: { workoutLogs: true },
    });

    // Clean up test data
    await prisma.workoutLog.delete({ where: { id: testWorkoutLog.id } });
    await prisma.exercise.delete({ where: { id: testExercise.id } });
    await prisma.trainingPlan.delete({ where: { id: testPlan.id } });
    await prisma.user.delete({ where: { id: testUser.id } });

    console.log('✅ Workout models validation passed');
    return true;
  } catch (error) {
    console.error('❌ Validation failed:', error);
    throw error;
  }
}

validateWorkoutModels()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
