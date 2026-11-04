# 🤝 TogetherWeCan — Community-Driven Social Development & Volunteer Platform

> **TogetherWeCan** is a modern, full-stack community-service platform designed to connect passionate volunteers with impactful local development initiatives—from tree plantation and environmental cleanups to winter clothing drives and educational workshops.

---

## 🌐 Live URLs

- **Client Live Website:** [https://together-we-can-seven.vercel.app](https://together-we-can-seven.vercel.app)
- **Server API (Vercel):** [https://together-we-can-server.vercel.app](https://together-we-can-server.vercel.app)
- **GitHub Repository:** [https://github.com/tamimkhan887/TogetherWeCan](https://github.com/tamimkhan887/TogetherWeCan)

---

## 🌟 Key Features

- **🎯 Community Event Discovery & Responsive Showcase:**
  Browse upcoming and past social initiatives with dynamic responsive grid layouts, category indicators, date/time formatting, and real-time attendee counts.
- **🙋 Interactive Event Participation & RSVP System:**
  Volunteers can view event details and RSVP to participate with one click. Includes built-in safety rules preventing duplicate signups, full-capacity warnings, and automated restrictions ensuring organizers cannot RSVP to their own events.
- **🛠️ Event Organizer Management Portal (CRUD):**
  Authenticated organizers can easily publish new community initiatives with custom banners, categories, locations, dates, and volunteer quotas, as well as edit or delete their events through a dedicated management dashboard.
- **📋 Personalized "Joined Events" Dashboard:**
  Dedicated user dashboard to track all registered events in chronological order (sort by soonest or furthest date), with one-click cancellation capability and automatic categorization of upcoming vs. past events.
- **🔐 Secure Authentication & JWT Authorization:**
  Integrated with **Better Auth** supporting both Google OAuth and Email/Password credentials, issuing cryptographically signed JWT tokens passed via `Authorization: Bearer <token>` for secure backend communication.
- **🌓 Modern, Accessible UI with Theme Toggle:**
  Designed with Tailwind CSS, Lucide Icons, smooth micro-interactions, responsive navigation, toast notifications (Sonner), and full Light/Dark mode support.

---

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server & Client Components)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons & UI:** [Lucide React](https://lucide.dev/), Radix UI primitives, [Sonner](https://sonner.emilkowal.ski/)
- **Authentication:** [Better Auth](https://www.better-auth.com/) (`better-auth/react`, `jwtClient`)
- **Theme:** [next-themes](https://github.com/pacocoursey/next-themes)

### Backend (Server)
- **Runtime & Framework:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) with native MongoDB Node.js Driver
- **Security & Tokens:** [jose](https://github.com/panva/jose) (JWT verification with JWKS / secret), [cors](https://www.npmjs.com/package/cors)
- **Hosting:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

Follow the steps below to run the project locally.

### 1. Clone the Repository
```bash
git clone https://github.com/tamimkhan887/TogetherWeCan.git
cd TogetherWeCan
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add the following keys:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000

# MongoDB Database Connection
MONGODB_URL=your_mongodb_connection_string

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Backend API Endpoint (Supports Deployed Vercel URL or Localhost)
NEXT_PUBLIC_BACKEND_URL=https://together-we-can-server.vercel.app
# For local backend testing, use: http://localhost:8000
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/upcomingevents` | Fetch all upcoming events (sorted by date) |
| `GET` | `/upcomingevents/:idOrEmail` | Fetch event by ID or fetch events created by organizer email |
| `POST` | `/upcomingevents` | Create a new community event (Protected) |
| `PATCH` | `/upcomingevents/:id` | Update an existing event |
| `DELETE` | `/upcomingevents/:id` | Delete an event |
| `GET` | `/pastevents` | Fetch past events |
| `GET` | `/joinedevents/:email` | Fetch all events joined by a user email |
| `GET` | `/joinedevents/event/:eventId` | Fetch all attendees for a specific event |
| `POST` | `/joinedevents` | Join an event |
| `DELETE` | `/joinedevents/:id` | Cancel an event registration |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
