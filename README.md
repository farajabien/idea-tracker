# 🚀 Idea Tracker

A platform for indie builders to track projects from idea to launch, showcase their builds, and connect with other makers.

## Core Features

### For Builders
- **Idea Management:** Track projects from concept to launch
- **Progress Tracking:** Built-in step system with completion tracking
- **Resource Organization:** Centralize project resources and links
- **Public Portfolio:** Showcase completed projects
- **Analytics:** Track views, clicks, and engagement

### For Community
- **Featured Projects:** Discover trending builds
- **Builder Profiles:** Connect with active makers
- **Project Categories:** Browse by tech categories
- **Builder Stats:** View shipping streaks and metrics
- **Real-time Updates:** See recently shipped projects

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Database:** Firebase Firestore
- **Auth:** Firebase Authentication
- **UI:** Shadcn UI + Tailwind CSS
- **Analytics:** Custom Firebase tracking

## Project Structure

```plaintext
idea-tracker/
├── app/
│ ├── (auth)/ # Auth-related pages
│ ├── (dashboard)/ # Protected dashboard routes
�� ├── api/ # Firebase API functions
│ └── page.tsx # Landing page
├── components/
│ ├── auth/ # Auth components
│ ├── dashboard/ # Dashboard features
│ ├── landing/ # Landing page sections
│ └── ui/ # Shadcn UI components
├── lib/
│ ├── auth.ts # Auth context & hooks
│ ├── firebase.ts # Firebase config
│ └── types.ts # TypeScript types
```

## Key Features

### Dashboard
- Real-time project tracking
- Step-by-step progress system
- Resource management
- Project analytics
- Public/private toggle

### Builder Profiles
- Shipping streaks
- Project portfolio
- View & click analytics
- Technology tags
- Activity timeline

### Community
- Featured projects feed
- Top builders leaderboard
- Category browsing
- Project engagement metrics
- Real-time updates

## Getting Started

1. Clone and install dependencies:

```bash
git clone https://github.com/yourusername/idea-tracker.git
cd idea-tracker
npm install
```

2. Set up Firebase:
- Create a project in Firebase Console
- Enable Authentication and Firestore
- Add config to .env.local:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

3. Run development server:

```bash
npm run dev
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](./LICENSE)

## Author: farajabien
