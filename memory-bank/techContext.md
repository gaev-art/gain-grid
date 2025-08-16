# Technical Context

## Core Technologies

- TypeScript v5.0.0+
- Turborepo for monorepo management

## Web Application

- Next.js
- Prisma for database operations
- NextAuth.js for authentication

## Mobile Application

- React Native
- Expo

## Development Tools

- Turbo for monorepo management
- TypeScript for static typing
- ESLint for linting
- Type checking via turbo

## Database

- Prisma ORM
- PostgreSQL for data storage
- Migrations managed through Prisma

## Authentication

- NextAuth.js with support for:
  - Email/password authentication
  - Google OAuth

## Data Models

### User Management

- User model supporting both OAuth and traditional authentication
- Extended profile fields for fitness data

### Workout Tracking System

- TrainingPlan - model for workout plans
- Exercise - model for exercises with metadata
- WorkoutLog - model for tracking completed exercises
- Reminder - model for workout reminders
- WorkoutSession - model for grouping exercises into sessions
- Support for various workout types and muscle groups

## API Structure

- RESTful API endpoints
- Routes based on Next.js App Router
- Service layer for business logic
- Data layer through Prisma

## Build & Development

- Turbo for parallel task execution
- EAS for mobile app building
- Separate scripts for web and mobile development
