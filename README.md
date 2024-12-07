### 🚀 **Idea Tracker**

A platform designed for indie builders to track projects from idea to launch, showcase completed projects, and engage with other makers.

---

### **Core Features**

**For Builders:**
- **Idea Management:** Track project lifecycle, from ideation to launch.
- **Progress Tracking:** Built-in step system with real-time status updates for milestones.
- **Resource Organization:** A place to keep resources, links, documentation, and collaboration tools centralized.
- **Public Portfolio:** Showcase finished projects to attract collaborators or clients.
- **Analytics:** Track project interactions like views, clicks, and engagement from the community.

**For Community:**
- **Featured Projects:** Highlight trending or noteworthy builds.
- **Builder Profiles:** Allow creators to showcase their work and track their milestones and progress.
- **Project Categories:** Group projects by tech stack, industry, or type (e.g., Web, API, App).
- **Builder Stats:** Show metrics such as shipping streaks, completed projects, or engagement with the community.
- **Real-time Updates:** Push notifications or updates to keep users informed on new projects.

---

### **Tech Stack**
- **Framework:** Next.js 14 (with App Router for streamlined routing)
- **Database:** Firebase Firestore (Real-time data storage and easy-to-integrate with Firebase services)
- **Auth:** Firebase Authentication (Supports social logins, email/password)
- **UI:** Shadcn UI + Tailwind CSS (Flexible and modern UI with excellent accessibility support)
- **Analytics:** Custom Firebase tracking (For project views, clicks, etc.)

---

### **Project Structure Overview**

```plaintext
idea-tracker/
├── app/
│ ├── (auth)/             # Auth-related pages (Login, Signup, Reset Password)
│ ├── (dashboard)/        # Protected dashboard routes (User's projects, progress, settings)
│ ├── api/                # Firebase API functions (Fetch data, update Firestore, etc.)
│ └── page.tsx            # Landing page for project overview and signups
├── components/
│ ├── auth/               # Auth components (Login, Signup forms)
│ ├── dashboard/          # Dashboard components (Project management, Analytics)
│ ├── landing/            # Landing page components (Featured projects, CTA)
│ ├── ui/                 # Shadcn UI components (Buttons, Cards, etc.)
├── lib/
│ ├── auth.ts             # Auth context & hooks (Manage user session)
│ ├── firebase.ts         # Firebase config and initialization
│ └── types.ts            # TypeScript types (Define types for projects, categories, users, etc.)
```

---

### **Key Features Breakdown**

#### **Dashboard:**
- **Real-Time Project Tracking:** Use Firestore's real-time capabilities to track the current status of each project and update the progress bar/steps in real-time.
- **Step-by-Step Progress System:** Each project could have a set of predefined steps (or customizable steps). This system could allow builders to mark each step as completed, contributing to project progress.
- **Resource Management:** Allow builders to upload files, add links to resources, or embed documentation directly in the project dashboard.
- **Project Analytics:** Track engagement metrics such as views, clicks, and interactions. Could be implemented using Firebase Analytics or Firestore fields.
- **Public/Private Toggle:** Builders can toggle between public or private visibility for their projects. Private projects are only visible to the creator, while public projects are showcased to the community.

#### **Builder Profiles:**
- **Shipping Streaks:** Track how many consecutive days or weeks the builder has shipped or completed projects.
- **Project Portfolio:** Builders can showcase their completed projects, with metrics, category tags, and real-time updates.
- **View & Click Analytics:** Builders can see how many users have engaged with their projects (via views, clicks, etc.).
- **Technology Tags:** Allow builders to tag their projects with technologies they used (e.g., React, Node.js, Firebase).
- **Activity Timeline:** Builders can show off the timeline of their work (e.g., milestone completions, comments, and collaborations).

#### **Community:**
- **Featured Projects Feed:** Showcase the top trending or featured projects to inspire other builders.
- **Top Builders Leaderboard:** Display a leaderboard of the most active or popular builders (based on metrics like shipping streaks, completed projects, or engagement).
- **Category Browsing:** Users can browse projects by category (e.g., Web Apps, APIs, etc.) with filters to sort by status, technology, or completion.
- **Project Engagement Metrics:** Display metrics on each project (views, likes, shares) to allow community members to gauge the popularity of each project.
- **Real-Time Updates:** Push real-time updates to users when new projects are shipped or when milestones are reached.

---

### **Getting Started**

#### 1. **Clone and Install Dependencies:**

```bash
git clone https://github.com/yourusername/idea-tracker.git
cd idea-tracker
npm install
```

#### 2. **Set up Firebase:**
- Create a Firebase project in the Firebase Console.
- Enable Firebase Authentication and Firestore.
- Add your Firebase config to `.env.local`:
  
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

#### 3. **Run Development Server:**

```bash
npm run dev
```

---

### **Contributing**

Refer to the [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how you can contribute to the project.

---

### **License**

MIT License - see [LICENSE](./LICENSE).

---

### **Author:**
Farajabien
