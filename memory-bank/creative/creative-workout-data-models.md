# Creative Phase: Workout Tracking Data Models Design

## Overview

This document outlines the design decisions for the workout tracking data models in the Gain Grid application. The models will support comprehensive tracking of workouts, training plans, exercise details, and workout reminders.

## Schema Design

```prisma
// Enhanced User model
model User {
  id            String         @id @default(cuid())
  name          String
  email         String         @unique
  password      String?        // Optional for OAuth users
  timezone      String?
  lastLogin     DateTime?
  isActive      Boolean        @default(true)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  // Profile fields
  weight        Float?
  height        Int?
  fitnessLevel  FitnessLevel?
  goals         String?

  // Relationships
  workouts      Workout[]
  trainingPlans TrainingPlan[]
  workoutLogs   WorkoutLog[]
  reminders     Reminder[]
  workoutSessions WorkoutSession[]
}

// Training Plan model
model TrainingPlan {
  id                 String     @id @default(cuid())
  userId             String
  name               String
  description        String?
  status             PlanStatus @default(ACTIVE)
  targetDurationWeeks Int?
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt

  // Relationships
  user               User       @relation(fields: [userId], references: [id])
  exercises          Exercise[]
  reminders          Reminder[]
  workoutSessions    WorkoutSession[]
}

// Enhanced Exercise model
model Exercise {
  id                 String            @id @default(cuid())
  trainingPlanId     String?
  name               String
  defaultSets        Int?
  defaultReps        Int?
  equipment          String?
  primaryMuscleGroup MuscleGroup?
  otherMuscles       String?           // Comma-separated list
  exerciseType       ExerciseType      @default(STRENGTH)
  durationMinutes    Int?
  difficulty         Difficulty?
  instructions       String?
  createdAt          DateTime          @default(now())
  updatedAt          DateTime          @updatedAt

  // Relationships
  trainingPlan       TrainingPlan?     @relation(fields: [trainingPlanId], references: [id])
  workoutLogs        WorkoutLog[]
}

// Workout Log model
model WorkoutLog {
  id              String    @id @default(cuid())
  userId          String
  exerciseId      String
  date            DateTime
  sets            Int
  reps            Int
  weight          Float?
  durationMinutes Int?
  rating          Int?      // 1-5 rating
  mood            Mood?
  notes           String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relationships
  user            User      @relation(fields: [userId], references: [id])
  exercise        Exercise  @relation(fields: [exerciseId], references: [id])

  // Optional relationship to workout session
  sessionId       String?
  session         WorkoutSession? @relation(fields: [sessionId], references: [id])
}

// Reminder model
model Reminder {
  id              String       @id @default(cuid())
  userId          String
  trainingPlanId  String?
  time            DateTime
  frequency       Frequency    // DAILY, WEEKLY
  message         String?
  lastSent        DateTime?
  active          Boolean      @default(true)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  // Relationships
  user            User         @relation(fields: [userId], references: [id])
  trainingPlan    TrainingPlan? @relation(fields: [trainingPlanId], references: [id])
}

// Optional: Workout Session model
model WorkoutSession {
  id                  String       @id @default(cuid())
  userId              String
  trainingPlanId      String?
  name                String
  date                DateTime
  totalDurationMinutes Int?
  overallRating       Int?         // 1-5 rating
  overallMood         Mood?
  notes               String?
  completed           Boolean      @default(false)
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  // Relationships
  user                User         @relation(fields: [userId], references: [id])
  trainingPlan        TrainingPlan? @relation(fields: [trainingPlanId], references: [id])
  workoutLogs         WorkoutLog[]
}

// Optional: Muscle Group reference model
model MuscleGroupRef {
  id          String     @id @default(cuid())
  name        String     @unique
  description String?
  createdAt   DateTime   @default(now())
}

// Enumerations
enum ExerciseType {
  STRENGTH
  CARDIO
  FLEXIBILITY
  BODYWEIGHT
}

enum MuscleGroup {
  CHEST
  BACK
  LEGS
  SHOULDERS
  BICEPS
  TRICEPS
  CORE
  FULL_BODY
  CARDIO
}

enum Difficulty {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum Mood {
  EXCELLENT
  GOOD
  OKAY
  TIRED
  EXHAUSTED
}

enum Frequency {
  DAILY
  WEEKLY
}

enum PlanStatus {
  ACTIVE
  ARCHIVED
  DRAFT
}

enum FitnessLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  ATHLETE
}
```

## API Structure

### Training Plans API

```
/api/training-plans
  GET    - List all training plans for current user
  POST   - Create new training plan

/api/training-plans/[id]
  GET    - Get specific training plan details
  PUT    - Update training plan
  DELETE - Delete/archive training plan

/api/training-plans/[id]/exercises
  GET    - List exercises in plan
  POST   - Add exercise to plan
```

### Exercises API

```
/api/exercises
  GET    - List all exercises (with optional filters)
  POST   - Create new exercise

/api/exercises/[id]
  GET    - Get specific exercise details
  PUT    - Update exercise
  DELETE - Delete exercise
```

### Workout Logs API

```
/api/workout-logs
  GET    - List workout history (with filters for date range)
  POST   - Add new workout log entry

/api/workout-logs/[id]
  GET    - Get specific workout log details
  PUT    - Update workout log
  DELETE - Delete workout log
```

### Reminders API

```
/api/reminders
  GET    - List all reminders
  POST   - Create new reminder

/api/reminders/[id]
  GET    - Get specific reminder details
  PUT    - Update reminder
  DELETE - Delete reminder
```

## Database Indexes

For optimal query performance, we'll add these indexes:

```prisma
// User email index (already exists via @unique)
// @@index([email])

// Find training plans by user and status
@@index([userId, status]) on TrainingPlan

// Find exercises by muscle group
@@index([primaryMuscleGroup]) on Exercise

// Find exercises in a training plan
@@index([trainingPlanId]) on Exercise

// Find workout logs by user and date (for history views)
@@index([userId, date]) on WorkoutLog

// Find workout logs by exercise
@@index([exerciseId]) on WorkoutLog

// Active reminders for a user
@@index([userId, active]) on Reminder
```

## Data Migration Strategy

1. Create a backup of the existing database
2. Run the Prisma migration to create new tables and modify existing ones
3. Write a migration script to:
   - Transfer user data to the enhanced User model
   - Move existing workout/exercise data to the new schema
4. Verify data integrity after migration
5. Update API endpoints to use the new models

## Security Considerations

- All endpoints will require authentication
- Users can only access their own data (enforced at the API level)
- Sensitive operations (delete/update) require proper validation
