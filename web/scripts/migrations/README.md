# Migration Validation Scripts

This directory contains scripts for validating database migrations and schema changes.

## Scripts

### validate-training-models.ts

Validates the TrainingPlan and Reminder models by:

- Creating test data
- Testing relationships between models
- Cleaning up test data
- Verifying schema integrity

### validate-user-extension.ts

Validates the extended User model by:

- Verifying FitnessLevel enum values
- Testing field accessibility

### validate-workout-models.ts

Validates the Exercise and WorkoutLog models by:

- Creating test exercise with enhanced fields
- Testing workout logging functionality
- Verifying relationships between models
- Cleaning up test data

## Usage

### Individual Scripts

```bash
# Validate training models
npm run validate:training-models

# Validate user extension
npm run validate:user-extension

# Validate workout models
npm run validate:workout-models
```

### All Scripts

```bash
# Run all validation scripts
npm run validate:all
```

### Direct Execution

```bash
# Using tsx directly
npx tsx scripts/migrations/validate-training-models.ts
npx tsx scripts/migrations/validate-user-extension.ts
npx tsx scripts/migrations/validate-workout-models.ts
```

## Prerequisites

- Database must be running and accessible
- Prisma schema must be up to date
- Prisma Client must be generated

## Notes

- Scripts create temporary test data that is automatically cleaned up
- Use these scripts after running migrations to verify schema integrity
- Scripts are safe to run multiple times
