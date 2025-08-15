import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ExerciseCategory = {
  STRENGTH: 'STRENGTH',
  CARDIO: 'CARDIO',
  FLEXIBILITY: 'FLEXIBILITY',
  BODYWEIGHT: 'BODYWEIGHT',
};

const exercises = [
  {
    name: 'Push-ups',
    description: 'Classic bodyweight exercise for chest, shoulders, and triceps',
    category: ExerciseCategory.BODYWEIGHT,
  },
  {
    name: 'Pull-ups',
    description: 'Upper body exercise that primarily targets the back and biceps',
    category: ExerciseCategory.BODYWEIGHT,
  },
  {
    name: 'Squats',
    description: 'Compound exercise that targets the legs and core',
    category: ExerciseCategory.BODYWEIGHT,
  },
  {
    name: 'Bench Press',
    description: 'Classic strength exercise for chest, shoulders, and triceps',
    category: ExerciseCategory.STRENGTH,
  },
  {
    name: 'Deadlift',
    description: 'Compound exercise that targets multiple muscle groups',
    category: ExerciseCategory.STRENGTH,
  },
  {
    name: 'Running',
    description: 'Cardiovascular exercise for endurance',
    category: ExerciseCategory.CARDIO,
  },
  {
    name: 'Yoga Flow',
    description: 'Series of poses for flexibility and mindfulness',
    category: ExerciseCategory.FLEXIBILITY,
  },
];

async function main() {
  console.log('Start seeding exercises...');

  for (const exercise of exercises) {
    const result = await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: exercise,
      create: exercise,
    });
    console.log(`Created exercise: ${result.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
