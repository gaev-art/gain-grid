# 🎨🎨🎨 ENTERING CREATIVE PHASE: DATA MODEL DESIGN

## Component Description

This component focuses on the detailed design of the data models needed for the workout tracking system. We will evaluate different approaches to model the various entities (User, TrainingPlan, Exercise, WorkoutLog, Reminder) and their relationships to ensure optimal data structure, query performance, and scalability.

## Requirements & Constraints

### Functional Requirements

1. Store comprehensive user fitness profiles
2. Support detailed exercise metadata (muscle groups, difficulty, etc.)
3. Track workout history with performance metrics
4. Manage training plans with scheduled exercises
5. Handle workout reminders with customizable frequency

### Technical Constraints

1. Must work with Prisma ORM and PostgreSQL
2. Must support efficient querying for common operations
3. Must handle relationships between entities efficiently
4. Must be extensible for future features
5. Must migrate gracefully from existing schema

## Data Model Options Analysis

### Option 1: Minimalist Model

This approach focuses on essential fields only, keeping the schema lean and simple.

```prisma
model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String?
  password      String?
  timezone      String?

  // Minimal fitness fields
  weight        Float?
  height        Int?

  // Relationships
  trainingPlans TrainingPlan[]
  workoutLogs   WorkoutLog[]
}

model TrainingPlan {
  id          String     @id @default(cuid())
  userId      String
  name        String
  status      String     @default("active")

  // Relationships
  user        User       @relation(fields: [userId], references: [id])
  exercises   Exercise[]
}

// Similar minimalist approach for other models
```

**Pros:**

- Simpler schema, easier to maintain
- Faster queries due to fewer fields
- Lower storage requirements
- Simpler migration path

**Cons:**

- Limited metadata for analytics
- May require schema updates for new features
- Less descriptive for complex fitness tracking
- May not meet all advanced user needs

### Option 2: Comprehensive Model

This approach captures extensive metadata for rich fitness tracking and analytics.

```prisma
model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String
  password      String?
  timezone      String?
  lastLogin     DateTime?
  isActive      Boolean        @default(true)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  // Comprehensive fitness fields
  weight        Float?
  height        Int?
  fitnessLevel  FitnessLevel?
  goals         String?
  age           Int?
  gender        String?
  activityLevel String?
  medicalNotes  String?

  // Relationships
  trainingPlans TrainingPlan[]
  workoutLogs   WorkoutLog[]
  reminders     Reminder[]
  bodyMetrics   BodyMetric[]  // Additional tracking
}

// Similarly detailed models for other entities
```

**Pros:**

- Rich data collection for advanced analytics
- Comprehensive fitness tracking capabilities
- Future-proof for most anticipated features
- Better personalization opportunities

**Cons:**

- More complex schema
- Potentially slower queries for common operations
- Higher storage requirements
- More complex migration path

### Option 3: Balanced Model with Extensibility

This approach balances essential fields with targeted metadata, using JSON fields for flexible extension.

```prisma
model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String?
  password      String?
  timezone      String?
  lastLogin     DateTime?
  isActive      Boolean        @default(true)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  // Core fitness fields
  weight        Float?
  height        Int?
  fitnessLevel  FitnessLevel?
  goals         String?

  // Extensibility
  metadata      Json?          // For future extensions without schema changes

  // Relationships
  trainingPlans TrainingPlan[]
  workoutLogs   WorkoutLog[]
  reminders     Reminder[]
}

// Similarly balanced models for other entities
```

**Pros:**

- Good balance between simplicity and capability
- Flexible extension through JSON fields
- Reasonable query performance
- Adaptable to new requirements without schema changes

**Cons:**

- JSON fields harder to query efficiently
- Some complexity in application code to handle dynamic fields
- Potential for inconsistent data structure in JSON fields
- Requires discipline to maintain data integrity

### Option 4: Domain-Segregated Model

This approach organizes models by functional domains with clear boundaries.

```prisma
// User domain
model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String?
  password      String?
  // Basic user fields
}

model UserProfile {
  id            String         @id @default(cuid())
  userId        String         @unique
  weight        Float?
  height        Int?
  fitnessLevel  FitnessLevel?
  goals         String?
  // All fitness-specific fields

  user          User           @relation(fields: [userId], references: [id])
}

// Training domain
model TrainingPlan {
  // Training plan fields
}

// Tracking domain
model WorkoutLog {
  // Workout log fields
}

// Notification domain
model Reminder {
  // Reminder fields
}
```

**Pros:**

- Clean separation of concerns
- Models aligned with business domains
- Can evolve domains independently
- Better support for domain-specific access patterns

**Cons:**

- More complex relationships across domains
- More joins needed for some queries
- More models to maintain
- More complex migration path

## Recommended Approach

After analyzing all options, we recommend **Option 3: Balanced Model with Extensibility** for the following reasons:

1. **Balanced Complexity**: Provides sufficient metadata for core functionality without overcomplicating the schema
2. **Extensibility**: JSON fields allow for flexible extension without schema migrations
3. **Query Performance**: Core fields remain directly queryable for common operations
4. **Migration Path**: Reasonable migration complexity from existing schema
5. **Future Adaptability**: Can accommodate new requirements through metadata fields

## Implementation Guidelines

### Core Model Fields

#### User Model

```prisma
model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String
  password      String?        // Optional for OAuth users
  timezone      String?
  lastLogin     DateTime?
  isActive      Boolean        @default(true)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  // Fitness profile fields
  weight        Float?
  height        Int?
  fitnessLevel  FitnessLevel?
  goals         String?
  metadata      Json?          // For extensibility

  // Relationships
  trainingPlans TrainingPlan[]
  workoutLogs   WorkoutLog[]
  reminders     Reminder[]
  workoutSessions WorkoutSession[]
}
```

#### TrainingPlan Model

```prisma
model TrainingPlan {
  id                 String     @id @default(cuid())
  userId             String
  name               String
  description        String?
  status             PlanStatus @default(ACTIVE)
  targetDurationWeeks Int?
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt
  metadata           Json?      // For extensibility

  // Relationships
  user               User       @relation(fields: [userId], references: [id])
  exercises          Exercise[]
  reminders          Reminder[]
  workoutSessions    WorkoutSession[]
}
```

#### Exercise Model

```prisma
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
  metadata           Json?             // For extensibility

  // Relationships
  trainingPlan       TrainingPlan?     @relation(fields: [trainingPlanId], references: [id])
  workoutLogs        WorkoutLog[]
}
```

#### WorkoutLog Model

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
  rating          Int?      // 1-5 rating
  mood            Mood?
  notes           String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  metadata        Json?     // For extensibility

  // Relationships
  user            User      @relation(fields: [userId], references: [id])
  exercise        Exercise  @relation(fields: [exerciseId], references: [id])

  // Optional relationship to workout session
  sessionId       String?
  session         WorkoutSession? @relation(fields: [sessionId], references: [id])
}
```

### Enumerations

Define clear enumerations to ensure data consistency:

```prisma
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

### Indexing Strategy

Implement targeted indexes for common query patterns:

```prisma
// User indexes (email already indexed via @unique)

// Training Plan indexes
@@index([userId, status]) on TrainingPlan

// Exercise indexes
@@index([primaryMuscleGroup]) on Exercise
@@index([trainingPlanId]) on Exercise

// WorkoutLog indexes
@@index([userId, date]) on WorkoutLog
@@index([exerciseId]) on WorkoutLog

// Reminder indexes
@@index([userId, active]) on Reminder
```

### JSON Field Usage Guidelines

For consistent use of JSON metadata fields:

1. **Schema Validation**: Implement application-level validation for JSON fields
2. **Field Standardization**: Establish naming conventions for metadata fields
3. **Documentation**: Document all metadata fields used in each model
4. **Query Considerations**: Avoid complex filtering on JSON fields in database queries
5. **Migration Path**: Have a plan to migrate frequently used JSON fields to proper columns when needed

### Database Migrations

1. **Incremental Approach**:
   - Start with core models and relationships
   - Add indexes after initial data migration
   - Add JSON metadata support last

2. **Data Preservation**:
   - Ensure existing workout and exercise data is preserved
   - Map old model fields to new model fields explicitly

3. **Validation**:
   - Validate data integrity after migration
   - Check relationship consistency across models

## Verification Checkpoint

The proposed data model meets our requirements by:

1. ✅ Supporting comprehensive user fitness profiles
2. ✅ Providing detailed exercise metadata
3. ✅ Enabling efficient workout history tracking
4. ✅ Supporting training plans with exercises
5. ✅ Accommodating workout reminders
6. ✅ Allowing for future extensibility through metadata

The balanced approach with JSON extension fields provides a good compromise between structure and flexibility, allowing the application to evolve without requiring frequent schema changes.

# 🎨🎨🎨 EXITING CREATIVE PHASE
