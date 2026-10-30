export type EventCategory =
  | "Cleanup"
  | "Plantation"
  | "Donation"
  | "Education"
  | "Healthcare"
  | "Community Support"
  | "Other";

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  image: string;
  location: string;
  date: string; // ISO date string or YYYY-MM-DD
  organizerName: string;
  organizerEmail: string;
  organizerAvatar: string;
  participantCount: number;
  maxCapacity?: number;
  createdBy: string;
  featured?: boolean;
  status?: "upcoming" | "completed" | "cancelled";
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  phone?: string;
  location?: string;
  joinedDate?: string;
}

export interface JoinedEvent {
  id: string;
  eventId: string;
  userId: string;
  joinedAt: string;
  status: "confirmed" | "attended" | "cancelled";
  event?: Event;
}

export interface EventFilterState {
  search: string;
  category: string;
  sortBy: "date-asc" | "date-desc" | "popular";
  location: string;
}

export interface StatsData {
  totalEvents: number;
  activeVolunteers: number;
  communitiesReached: number;
  hoursContributed: number;
}
