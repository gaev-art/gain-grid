# 🎨🎨🎨 ENTERING CREATIVE PHASE: API DESIGN

## Component Description

This component focuses on designing the API layer for the workout tracking system. The API will serve as the interface between the front-end applications (both web and mobile) and the database, handling all data operations for training plans, exercises, workout logs, and reminders.

## Requirements & Constraints

### Functional Requirements

1. Support CRUD operations for all workout tracking entities
2. Enable filtering and sorting of workout data
3. Support relationships between entities (e.g., exercises in a training plan)
4. Provide performant endpoints for common operations
5. Enable data synchronization between web and mobile

### Technical Constraints

1. Must use Next.js App Router API routes
2. Must be RESTful and follow consistent patterns
3. Must be secure with proper authentication
4. Must be backward compatible where possible
5. Must handle validation and error cases gracefully
6. Must support pagination for large data sets

## API Design Options Analysis

### Option 1: Resource-Centric API

This approach organizes endpoints strictly around resource entities with standard CRUD operations.

```
/api/training-plans
/api/training-plans/[id]
/api/exercises
/api/exercises/[id]
/api/workout-logs
/api/workout-logs/[id]
/api/reminders
/api/reminders/[id]
```

**Pros:**

- Clean, RESTful structure
- Predictable endpoint patterns
- Easy to document and understand
- Follows standard conventions

**Cons:**

- May require multiple requests for related data
- Less efficient for complex operations
- Limited flexibility for specialized operations
- May not optimize for common client usage patterns

### Option 2: Action-Centric API

This approach organizes endpoints around user actions and workflows rather than resources.

```
/api/workout/start
/api/workout/log-exercise
/api/workout/complete
/api/plan/create
/api/plan/assign-exercise
/api/plan/schedule
```

**Pros:**

- Aligns closely with user workflows
- Can optimize for specific use cases
- Often requires fewer requests for common operations
- Can handle complex operations in a single request

**Cons:**

- Less consistent structure
- Harder to document comprehensively
- May lead to endpoint proliferation
- Deviates from RESTful conventions

### Option 3: Hybrid Resource-Action API

This approach uses resource-centric endpoints for CRUD operations while adding specialized action endpoints for complex operations.

```
# Resource endpoints
/api/training-plans
/api/training-plans/[id]
/api/exercises
/api/exercises/[id]

# Specialized action endpoints
/api/training-plans/[id]/exercises
/api/training-plans/[id]/duplicate
/api/workout-logs/summary
```

**Pros:**

- Combines benefits of both approaches
- Optimizes for common operations
- Maintains RESTful structure for standard operations
- Flexible for complex workflows

**Cons:**

- Slightly less predictable API structure
- Requires careful documentation
- Need to decide which operations deserve specialized endpoints
- Risk of inconsistent design decisions

### Option 4: GraphQL API

This approach uses GraphQL instead of REST to allow clients to request exactly the data they need.

```
/api/graphql

# Example query
query {
  trainingPlan(id: "123") {
    name
    exercises {
      name
      muscleGroup
    }
  }
}
```

**Pros:**

- Flexible data fetching
- Reduced over-fetching and under-fetching
- Can handle complex relationships efficiently
- Single endpoint for all operations

**Cons:**

- Higher learning curve
- More complex to implement initially
- Different security considerations
- May not integrate as easily with Next.js App Router

## Recommended Approach

After analyzing all options, we recommend **Option 3: Hybrid Resource-Action API** for the following reasons:

1. **Balance of Structure and Flexibility**: Provides clean resource endpoints while allowing optimization for common operations
2. **Performance Optimization**: Can optimize specialized endpoints for common workflows
3. **RESTful Foundation**: Maintains RESTful principles for most operations
4. **Practical Approach**: Addresses real-world usage patterns without over-complicating the API
5. **Compatibility**: Works well with Next.js App Router structure

## Implementation Guidelines

### Core Resource Endpoints

#### Training Plans API

```
# List and create
GET /api/training-plans
POST /api/training-plans

# Retrieve, update, delete specific plan
GET /api/training-plans/[id]
PUT /api/training-plans/[id]
DELETE /api/training-plans/[id]

# Special operations
GET /api/training-plans/[id]/exercises
POST /api/training-plans/[id]/exercises
PUT /api/training-plans/[id]/status
```

#### Exercises API

```
# List and create
GET /api/exercises
POST /api/exercises

# Retrieve, update, delete specific exercise
GET /api/exercises/[id]
PUT /api/exercises/[id]
DELETE /api/exercises/[id]

# Special operations
GET /api/exercises/by-muscle-group/[group]
```

#### Workout Logs API

```
# List and create
GET /api/workout-logs
POST /api/workout-logs

# Retrieve, update, delete specific log
GET /api/workout-logs/[id]
PUT /api/workout-logs/[id]
DELETE /api/workout-logs/[id]

# Special operations
GET /api/workout-logs/summary
GET /api/workout-logs/history
GET /api/workout-logs/by-date/[date]
```

#### Reminders API

```
# List and create
GET /api/reminders
POST /api/reminders

# Retrieve, update, delete specific reminder
GET /api/reminders/[id]
PUT /api/reminders/[id]
DELETE /api/reminders/[id]

# Special operations
PUT /api/reminders/[id]/toggle-active
```

### Implementation Details

#### Request/Response Format

Use consistent JSON format:

```json
// Success response
{
  "success": true,
  "data": {
    // Resource data
  },
  "meta": {
    // Pagination, counts, etc.
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      // Additional error details
    }
  }
}
```

#### Pagination

Implement consistent pagination for list endpoints:

```
GET /api/training-plans?page=1&limit=20
```

Response should include pagination metadata:

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

#### Filtering and Sorting

Support consistent query parameters:

```
GET /api/exercises?muscleGroup=CHEST&difficulty=BEGINNER
GET /api/workout-logs?sortBy=date&order=desc
```

#### Route Implementation

For Next.js App Router, implement as:

```
/app/api/training-plans/route.ts
/app/api/training-plans/[id]/route.ts
/app/api/training-plans/[id]/exercises/route.ts
```

### Security Guidelines

1. **Authentication**: All endpoints require authentication via NextAuth.js
2. **Authorization**: Validate user has access to requested resources
3. **Input Validation**: Validate all inputs with appropriate schemas
4. **Error Handling**: Return appropriate HTTP status codes and error messages
5. **Rate Limiting**: Consider implementing rate limiting for public endpoints

### Service Layer Structure

Implement a service layer between API routes and Prisma:

```typescript
// Example training plan service
export class TrainingPlanService {
  async getTrainingPlans(userId: string, options: QueryOptions) {
    // Implementation
  }

  async getTrainingPlanById(id: string, userId: string) {
    // Implementation with authorization check
  }

  // Other methods
}
```

API route implementations:

```typescript
// GET /api/training-plans
export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const options = parseQueryOptions(req);
  const trainingPlanService = new TrainingPlanService();

  try {
    const result = await trainingPlanService.getTrainingPlans(session.user.id, options);
    return Response.json({ success: true, data: result.data, meta: result.meta });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Validation Strategy

1. Use Zod or similar for request validation:

```typescript
import { z } from 'zod';

const createTrainingPlanSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  targetDurationWeeks: z.number().int().positive().optional(),
});

// In API route
const result = createTrainingPlanSchema.safeParse(await req.json());
if (!result.success) {
  return Response.json(
    {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: result.error.format(),
      },
    },
    { status: 400 }
  );
}
```

2. Service-level validation for business rules
3. Database-level constraints via Prisma schema

## Verification Checkpoint

The proposed API design meets our requirements by:

1. ✅ Supporting all required CRUD operations
2. ✅ Providing optimized endpoints for common operations
3. ✅ Maintaining RESTful conventions where appropriate
4. ✅ Supporting filtering, sorting, and pagination
5. ✅ Implementing consistent error handling
6. ✅ Ensuring security through authentication and authorization
7. ✅ Enabling efficient data access patterns for both web and mobile clients

The hybrid resource-action approach provides a good balance between REST principles and practical optimization, creating an API that is both predictable and efficient for client applications.

# 🎨🎨🎨 EXITING CREATIVE PHASE
