"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Event, User, JoinedEvent } from "@/types";
import { initialCurrentUser, initialEvents, initialJoinedEvents } from "@/lib/mock-data";

interface EventsContextType {
  events: Event[];
  joinedEvents: JoinedEvent[];
  currentUser: User | null;
  isAuthenticatedPreview: boolean;
  setIsAuthenticatedPreview: (val: boolean) => void;
  toggleAuthPreview: () => void;
  addEvent: (
    eventData: Omit<
      Event,
      | "id"
      | "organizerName"
      | "organizerEmail"
      | "organizerAvatar"
      | "participantCount"
      | "createdBy"
      | "status"
    >
  ) => Event;
  updateEvent: (id: string, updated: Partial<Event>) => boolean;
  deleteEvent: (id: string) => boolean;
  joinEvent: (eventId: string) => { success: boolean; message: string };
  leaveEvent: (eventId: string) => boolean;
  isJoined: (eventId: string) => boolean;
  getEventById: (id: string) => Event | undefined;
  updateUserProfile: (data: Partial<User>) => void;
  resetToDefaults: () => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EVENTS: "twc_events_data_v1",
  JOINED: "twc_joined_events_v1",
  USER: "twc_user_profile_v1",
  AUTH_PREVIEW: "twc_auth_preview_state_v1",
};

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [joinedEvents, setJoinedEvents] = useState<JoinedEvent[]>(initialJoinedEvents);
  const [currentUser, setCurrentUser] = useState<User | null>(initialCurrentUser);
  const [isAuthenticatedPreview, setIsAuthenticatedPreview] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted mock state if available in browser
  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      }
      const savedJoined = localStorage.getItem(STORAGE_KEYS.JOINED);
      if (savedJoined) {
        setJoinedEvents(JSON.parse(savedJoined));
      }
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH_PREVIEW);
      if (savedAuth !== null) {
        setIsAuthenticatedPreview(savedAuth === "true");
      }
    } catch {
      // Ignore parse errors, fallback to defaults
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error(e);
    }
  }, [events, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.JOINED, JSON.stringify(joinedEvents));
    } catch (e) {
      console.error(e);
    }
  }, [joinedEvents, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_PREVIEW, String(isAuthenticatedPreview));
    } catch (e) {
      console.error(e);
    }
  }, [isAuthenticatedPreview, isLoaded]);

  const toggleAuthPreview = () => {
    setIsAuthenticatedPreview((prev) => !prev);
  };

  const addEvent = (
    eventData: Omit<
      Event,
      | "id"
      | "organizerName"
      | "organizerEmail"
      | "organizerAvatar"
      | "participantCount"
      | "createdBy"
      | "status"
    >
  ): Event => {
    const newEvent: Event = {
      ...eventData,
      id: `evt-${Date.now()}`,
      organizerName: currentUser?.name || "Community Volunteer",
      organizerEmail: currentUser?.email || "volunteer@togetherwecan.org",
      organizerAvatar:
        currentUser?.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      participantCount: 1,
      createdBy: currentUser?.id || "usr-001",
      status: "upcoming",
    };

    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  };

  const updateEvent = (id: string, updated: Partial<Event>): boolean => {
    let found = false;
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === id) {
          found = true;
          return { ...evt, ...updated };
        }
        return evt;
      })
    );
    return found;
  };

  const deleteEvent = (id: string): boolean => {
    let found = false;
    setEvents((prev) => {
      const filtered = prev.filter((evt) => {
        if (evt.id === id) {
          found = true;
          return false;
        }
        return true;
      });
      return filtered;
    });

    // Also remove from joined
    setJoinedEvents((prev) => prev.filter((j) => j.eventId !== id));
    return found;
  };

  const isJoined = (eventId: string): boolean => {
    const userId = currentUser?.id || "usr-001";
    return joinedEvents.some((j) => j.eventId === eventId && j.userId === userId && j.status !== "cancelled");
  };

  const joinEvent = (eventId: string): { success: boolean; message: string } => {
    if (!isAuthenticatedPreview) {
      return {
        success: false,
        message: "Please log in to register as a volunteer for this event.",
      };
    }

    const userId = currentUser?.id || "usr-001";
    if (isJoined(eventId)) {
      return {
        success: false,
        message: "You are already registered for this event!",
      };
    }

    const newJoined: JoinedEvent = {
      id: `jnd-${Date.now()}`,
      eventId,
      userId,
      joinedAt: new Date().toISOString(),
      status: "confirmed",
    };

    setJoinedEvents((prev) => [newJoined, ...prev]);

    // Increment event participantCount
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId
          ? { ...evt, participantCount: evt.participantCount + 1 }
          : evt
      )
    );

    return {
      success: true,
      message: "Congratulations! You have joined this event as a volunteer.",
    };
  };

  const leaveEvent = (eventId: string): boolean => {
    const userId = currentUser?.id || "usr-001";
    let found = false;

    setJoinedEvents((prev) =>
      prev.filter((j) => {
        if (j.eventId === eventId && j.userId === userId) {
          found = true;
          return false;
        }
        return true;
      })
    );

    if (found) {
      setEvents((prev) =>
        prev.map((evt) =>
          evt.id === eventId
            ? { ...evt, participantCount: Math.max(0, evt.participantCount - 1) }
            : evt
        )
      );
    }

    return found;
  };

  const getEventById = (id: string): Event | undefined => {
    return events.find((evt) => evt.id === id);
  };

  const updateUserProfile = (data: Partial<User>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const resetToDefaults = () => {
    setEvents(initialEvents);
    setJoinedEvents(initialJoinedEvents);
    setCurrentUser(initialCurrentUser);
    setIsAuthenticatedPreview(true);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.JOINED);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_PREVIEW);
  };

  const value = useMemo(
    () => ({
      events,
      joinedEvents,
      currentUser,
      isAuthenticatedPreview,
      setIsAuthenticatedPreview,
      toggleAuthPreview,
      addEvent,
      updateEvent,
      deleteEvent,
      joinEvent,
      leaveEvent,
      isJoined,
      getEventById,
      updateUserProfile,
      resetToDefaults,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [events, joinedEvents, currentUser, isAuthenticatedPreview]
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};
