# GainGrid 💪

GainGrid is a monolithic application for workout tracking, accessible through a web app, mobile app, and Telegram bot.

## 🎯 Features

- 📝 **Workout Planning**
  - Exercise customization
  - Goal setting
  - Schedule management

- 📊 **Result Tracking**
  - Exercise logging
  - Weight and rep tracking
  - Time tracking

- 📈 **Progress Analysis**
  - Results visualization
  - Progress charts
  - Workout statistics

- 🔔 **Reminders**
  - Workout notifications
  - Motivational messages
  - Consistency tracking

## 🏗 Architecture

The project is built as a monorepo with three main components:

```
gain-grid/
├── web/            # Next.js web application
├── mobile/         # React Native mobile app
└── packages/       # Shared packages and utilities
```

### 🌐 Web Application (Next.js)

- Server-side rendering
- REST API
- PostgreSQL database
- Authentication

### 📱 Mobile Application (React Native + Expo)

- Cross-platform app
- Offline mode
- Push notifications
- Native features

## 🛠 Tech Stack

- **Frontend:**
  - Next.js
  - React Native
  - TypeScript
  - TailwindCSS

- **Backend:**
  - Node.js
  - PostgreSQL
  - Prisma ORM

## 🚀 Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/your-username/gain-grid.git
cd gain-grid
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment**

```bash
# For web application
cp web/.env.example web/.env
# For mobile application
cp mobile/.env.example mobile/.env
```

4. **Run applications**

```bash
# Web application
npm run dev:web
# Mobile application
npm run dev:mobile
```
