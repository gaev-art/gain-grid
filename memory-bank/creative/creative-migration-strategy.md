# 🎨🎨🎨 ENTERING CREATIVE PHASE: MIGRATION STRATEGY

## Component Description

This component focuses on designing an effective migration strategy for transitioning from the existing workout data model to the new comprehensive workout tracking system. This includes both schema migration and data migration, with special attention to preserving existing data while enabling new features.

## Requirements & Constraints

### Functional Requirements

1. Preserve all existing user, workout, and exercise data
2. Transition to new enhanced models without data loss
3. Enable new functionality with minimal disruption
4. Maintain backward compatibility during transition period
5. Provide rollback capability in case of issues

### Technical Constraints

1. Must use Prisma migrations for schema changes
2. Must handle complex data transformations between schemas
3. Must minimize downtime during migration
4. Must verify data integrity after migration
5. Must be testable in development before production deployment

## Migration Strategy Options Analysis

### Option 1: Direct Migration

This approach involves creating a single Prisma migration that transforms the schema from current to target state, with data migration handled by SQL in the migration.

```
npx prisma migrate dev --name workout_tracking_system
```

**Pros:**

- Single-step process
- Built-in transaction handling
- All changes applied atomically
- Simpler deployment process

**Cons:**

- Complex SQL for data transformation
- Higher risk if migration fails
- Limited testing capability
- More difficult to rollback
- Less visibility into the migration process

### Option 2: Phased Schema Evolution

This approach involves multiple smaller migrations that gradually transform the schema, with separate data migration steps.

```
# Phase 1: Add new fields to existing models
npx prisma migrate dev --name add_user_fitness_fields

# Phase 2: Create new models
npx prisma migrate dev --name add_training_plan_model

# Phase 3: Transform relationships
npx prisma migrate dev --name update_relationships

# Phase 4: Data migration script
node scripts/migrate-workout-data.js
```

**Pros:**

- Lower risk with smaller changes
- Easier to test and validate each phase
- Better visibility into the process
- More manageable rollback options
- Can deploy incrementally

**Cons:**

- More complex orchestration
- Longer overall migration period
- Requires maintaining compatibility across phases
- More development effort

### Option 3: Shadow Tables Approach

This approach creates new models alongside existing ones, with a period of dual-writing before switching over.

```
# Phase 1: Create new tables without disrupting existing ones
npx prisma migrate dev --name add_new_workout_models

# Phase 2: Implement dual-writing in application code
# (Application writes to both old and new models)

# Phase 3: Backfill historical data
node scripts/backfill-historical-data.js

# Phase 4: Switch reads to new models
# (Application starts reading from new models)

# Phase 5: Remove dual-writing and old models
npx prisma migrate dev --name cleanup_old_workout_models
```

**Pros:**

- Minimal disruption to production
- Near-zero downtime
- Lower risk with gradual transition
- Ability to validate before full cutover
- Simplest rollback strategy

**Cons:**

- Highest development complexity
- Longest migration timeline
- Temporary data duplication
- More complex application code during transition
- Risk of data inconsistency between systems

### Option 4: Export-Transform-Import

This approach involves exporting existing data, transforming it externally, and importing to the new schema.

```
# Phase 1: Create new schema from scratch
npx prisma migrate dev --name new_workout_schema

# Phase 2: Export existing data
node scripts/export-existing-data.js

# Phase 3: Transform data offline
node scripts/transform-workout-data.js

# Phase 4: Import to new schema
node scripts/import-transformed-data.js
```

**Pros:**

- Clean separation between old and new schemas
- Transformations can be complex and customized
- Can be tested thoroughly offline
- Lower risk of production issues
- Cleaner final schema without migration artifacts

**Cons:**

- Requires application downtime during migration
- More complex tooling required
- Potential for data loss during export/import
- Difficult to preserve certain relationships
- Higher effort for large datasets

## Recommended Approach

After analyzing all options, we recommend **Option 2: Phased Schema Evolution** for the following reasons:

1. **Balanced Risk Profile**: Provides incremental changes with validation at each step
2. **Visibility and Control**: Offers better visibility into the migration process
3. **Testing Capability**: Each phase can be tested independently
4. **Rollback Options**: Easier to implement specific rollback strategies for each phase
5. **Development Complexity**: Manageable development effort compared to more complex approaches

## Implementation Guidelines

### Phase 1: Prepare and Plan

1. **Create Database Backup**:

   ```bash
   pg_dump -U postgres -d gain_grid > backup_before_migration.sql
   ```

2. **Set Up Test Environment**:
   - Clone production database to staging
   - Set up automated testing for data integrity

3. **Create Migration Scripts Directory**:
   ```bash
   mkdir -p scripts/migrations
   ```

### Phase 2: Extend Existing Models

1. **Add New Fields to User Model**:

   ```prisma
   // Update User model with fitness fields
   model User {
     // Existing fields

     // New fields
     timezone      String?
     lastLogin     DateTime?
     isActive      Boolean   @default(true)
     weight        Float?
     height        Int?
     fitnessLevel  String?
     goals         String?
   }
   ```

2. **Generate and Apply Migration**:

   ```bash
   npx prisma migrate dev --name extend_user_model
   ```

3. **Validation Script**:

   ```typescript
   // scripts/migrations/validate-user-extension.ts
   import { PrismaClient } from '@prisma/client';

   const prisma = new PrismaClient();

   async function validateUserExtension() {
     const users = await prisma.user.findMany();
     console.log(`Validated ${users.length} users with extended schema`);
     // Check for any issues
   }

   validateUserExtension()
     .catch(console.error)
     .finally(() => prisma.$disconnect());
   ```

### Phase 3: Add New Models

1. **Add Training Plan Model**:

   ```prisma
   model TrainingPlan {
     id                 String     @id @default(cuid())
     userId             String
     name               String
     description        String?
     status             String     @default("ACTIVE")
     targetDurationWeeks Int?
     createdAt          DateTime   @default(now())
     updatedAt          DateTime   @updatedAt

     user               User       @relation(fields: [userId], references: [id])
   }
   ```

2. **Add Reminder Model**:

   ```prisma
   model Reminder {
     id              String       @id @default(cuid())
     userId          String
     trainingPlanId  String?
     time            DateTime
     frequency       String       // "DAILY", "WEEKLY"
     message         String?
     lastSent        DateTime?
     active          Boolean      @default(true)
     createdAt       DateTime     @default(now())
     updatedAt       DateTime     @updatedAt

     user            User         @relation(fields: [userId], references: [id])
     trainingPlan    TrainingPlan? @relation(fields: [trainingPlanId], references: [id])
   }
   ```

3. **Generate and Apply Migration**:
   ```bash
   npx prisma migrate dev --name add_training_models
   ```

### Phase 4: Extend Exercise Model

1. **Update Exercise Model**:

   ```prisma
   model Exercise {
     id                 String            @id @default(cuid())
     name               String
     description        String?
     category           ExerciseCategory
     trainingPlanId     String?
     defaultSets        Int?
     defaultReps        Int?
     equipment          String?
     primaryMuscleGroup String?
     otherMuscles       String?
     durationMinutes    Int?
     difficulty         String?
     instructions       String?
     createdAt          DateTime          @default(now())
     updatedAt          DateTime          @updatedAt

     // Relationships
     workouts           WorkoutExercise[]
     trainingPlan       TrainingPlan?     @relation(fields: [trainingPlanId], references: [id])
   }
   ```

2. **Generate and Apply Migration**:

   ```bash
   npx prisma migrate dev --name extend_exercise_model
   ```

3. **Data Validation**:
   ```typescript
   // scripts/migrations/validate-exercise-extension.ts
   // Similar validation logic for exercises
   ```

### Phase 5: Transform WorkoutExercise to WorkoutLog

1. **Create WorkoutLog Model**:

   ```prisma
   model WorkoutLog {
     id              String    @id @default(cuid())
     userId          String
     exerciseId      String
     date            DateTime
     sets            Int
     reps            Int
     weight          Float?
     durationMinutes Int?
     rating          Int?
     mood            String?
     notes           String?
     createdAt       DateTime  @default(now())
     updatedAt       DateTime  @updatedAt

     // Relationships
     user            User      @relation(fields: [userId], references: [id])
     exercise        Exercise  @relation(fields: [exerciseId], references: [id])
   }
   ```

2. **Generate Migration**:

   ```bash
   npx prisma migrate dev --name add_workout_log
   ```

3. **Data Migration Script**:

   ```typescript
   // scripts/migrations/migrate-workout-exercise-to-log.ts
   import { PrismaClient } from '@prisma/client';

   const prisma = new PrismaClient();

   async function migrateWorkoutExerciseToLog() {
     // Get all workout exercises
     const workoutExercises = await prisma.workoutExercise.findMany({
       include: {
         workout: true,
         exercise: true,
       },
     });

     console.log(`Found ${workoutExercises.length} workout exercises to migrate`);

     // Convert each workout exercise to workout log
     for (const we of workoutExercises) {
       await prisma.workoutLog.create({
         data: {
           userId: we.workout.userId,
           exerciseId: we.exerciseId,
           date: we.workout.date,
           sets: we.sets,
           reps: we.reps,
           weight: we.weight,
           durationMinutes: we.time,
           notes: we.notes,
           createdAt: we.createdAt,
           updatedAt: we.updatedAt,
         },
       });
     }

     console.log('Migration completed successfully');
   }

   migrateWorkoutExerciseToLog()
     .catch(console.error)
     .finally(() => prisma.$disconnect());
   ```

4. **Run Migration Script**:
   ```bash
   npx ts-node scripts/migrations/migrate-workout-exercise-to-log.ts
   ```

### Phase 6: Add Indexes for Performance

1. **Add Database Indexes**:

   ```prisma
   // Add to appropriate models
   @@index([userId, status]) on TrainingPlan
   @@index([primaryMuscleGroup]) on Exercise
   @@index([trainingPlanId]) on Exercise
   @@index([userId, date]) on WorkoutLog
   @@index([exerciseId]) on WorkoutLog
   @@index([userId, active]) on Reminder
   ```

2. **Generate and Apply Migration**:
   ```bash
   npx prisma migrate dev --name add_performance_indexes
   ```

### Phase 7: Verification and Cleanup

1. **Comprehensive Data Verification**:

   ```typescript
   // scripts/migrations/verify-migration.ts
   import { PrismaClient } from '@prisma/client';

   const prisma = new PrismaClient();

   async function verifyMigration() {
     // Count records in key tables
     const userCount = await prisma.user.count();
     const exerciseCount = await prisma.exercise.count();
     const workoutLogCount = await prisma.workoutLog.count();
     const workoutExerciseCount = await prisma.workoutExercise.count();

     console.log('Migration verification:');
     console.log(`- Users: ${userCount}`);
     console.log(`- Exercises: ${exerciseCount}`);
     console.log(`- Workout Logs: ${workoutLogCount}`);
     console.log(`- Original Workout Exercises: ${workoutExerciseCount}`);

     // Verify sample records
     // ... detailed verification logic
   }

   verifyMigration()
     .catch(console.error)
     .finally(() => prisma.$disconnect());
   ```

2. **Run Verification**:

   ```bash
   npx ts-node scripts/migrations/verify-migration.ts
   ```

3. **Optional: Clean Up Old Tables**:
   ```prisma
   // Only after successful verification and transition period
   // Remove WorkoutExercise model if no longer needed
   ```

### Rollback Strategy

For each phase, implement a specific rollback strategy:

1. **Phase-Specific Rollback Scripts**:

   ```typescript
   // scripts/rollback/rollback-phase1.ts
   // scripts/rollback/rollback-phase2.ts
   // etc.
   ```

2. **Complete Rollback Plan**:
   ```bash
   # If needed, restore from backup
   psql -U postgres -d gain_grid < backup_before_migration.sql
   ```

### Deployment Strategy

1. **Testing Environment Deployment**:
   - Deploy and test each phase in development
   - Deploy and test each phase in staging
   - Validate with sample queries

2. **Production Deployment Window**:
   - Schedule during low-traffic period
   - Communicate planned maintenance
   - Prepare rollback plans

3. **Post-Deployment Verification**:
   - Run verification scripts
   - Monitor application performance
   - Check for errors or anomalies

## Verification Checkpoint

The proposed migration strategy meets our requirements by:

1. ✅ Preserving all existing user data and workout history
2. ✅ Breaking the process into manageable phases
3. ✅ Providing validation steps at each phase
4. ✅ Including rollback options for each phase
5. ✅ Minimizing risk through incremental changes
6. ✅ Allowing thorough testing before production deployment

The phased approach provides a balance between safety and efficiency, ensuring that we can migrate to the new schema while preserving valuable user data and minimizing disruption.

# 🎨🎨🎨 EXITING CREATIVE PHASE
