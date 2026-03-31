# We Have Food At Home

A local-first mobile inventory app that helps households track food and ingredients at home. Works offline by default — cloud sync optional via sign in.

## Tech Stack
- React Native (Expo)
- TypeScript
- Supabase (Auth + PostgreSQL)
- AsyncStorage (local-first storage)

## Getting Started

### Prerequisites
- Node.js
- Expo CLI (`npm install -g expo-cli`)

### Installation
```bash
git clone https://github.com/levonl22/we-have-food-at-home
cd we-have-food-at-home
npm install
```

### Environment Setup
Create a `.env` file in the project root:
```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Run
```bash
npx expo start
```

## Download
[Latest APK](https://expo.dev/accounts/levonl22/projects/InventoryApp/builds/4c6e9084-f9f7-4fcf-a06d-9d31aece0513)

## Roadmap
- Union merge with duplicate prompting on login
- Expiration date tracking
- Household management
- Real-time sync between household members

## Demo
https://github.com/user-attachments/assets/9a62cb00-83bc-4381-88d1-6371235095ed