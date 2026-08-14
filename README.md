# s-tracker

> Comprehensive Semester Attendance Tracker & Bunk Forecaster web application built with React, TypeScript, and Vite.

## Features

- 📅 **Interactive Calendar & Timetable**: Real-time IST day/slot matching with dynamic lecture cards.
- 📊 **Target & Bunk Calculator**: Live safe-bunk forecasting against target attendance thresholds.
- 📈 **Trend Forecasts**: Projection charts with scenario planning and reserve days buffer.
- ☁️ **Cloud Sync**: Firebase Firestore integration with local offline persistence.
- 🌓 **Nocturne Aesthetic**: Sleek glassmorphism and refined typography.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/dhruvamity/s-tracker.git
cd s-tracker

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Configuration

Copy `.env.example` to `.env` or `.env.local` to configure optional default Firebase synchronization:

```bash
cp .env.example .env
```

## Build

```bash
npm run build
```

## License
MIT
