"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { ContentCard, INITIAL_CARDS } from "@/data/mockData";
import {
  fetchCardsFromDb,
  upsertCardInDb,
  deleteCardFromDb,
  clearAllCardsInDb,
  mapRowToCard,
} from "@/lib/contentService";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface TaskItem {
  id: string;
  title: string;
  cardId?: string;
  cardTitle?: string;
  dueDate?: string;
  priority: "Low" | "Medium" | "High";
  status: "todo" | "in_progress" | "done";
  assignee?: string;
  createdAt: string;
}

interface ContentContextType {
  cards: ContentCard[];
  updateCardStatus: (cardId: string, newStatus: string) => void;
  updateCard: (updatedCard: ContentCard) => void;
  addCard: (card: Partial<ContentCard>) => ContentCard;
  deleteCard: (id: string) => void;
  clearAllCards: () => void;
  getCardById: (id: string) => ContentCard | undefined;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedWriter: string;
  setSelectedWriter: (writer: string) => void;
  viewMode: "Board" | "List";
  setViewMode: (mode: "Board" | "List") => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isDbConnected: boolean;
  isSyncing: boolean;
  uniqueWriters: string[];
  uniqueCategories: string[];
  tasks: TaskItem[];
  addTask: (task: Partial<TaskItem>) => TaskItem;
  updateTask: (task: TaskItem) => void;
  deleteTask: (id: string) => void;
  refreshFromCloud: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "content_os_cards_v1";
const LOCAL_TASKS_KEY = "content_os_tasks_v1";

const INITIAL_TASKS: TaskItem[] = [
  {
    id: "t-1",
    title: "Draft opening hook for '5 Dangerous Thinking Traps'",
    cardTitle: "5 Dangerous Thinking Traps That Distort Your Decisions",
    dueDate: "2026-11-22",
    priority: "High",
    status: "in_progress",
    assignee: "Muzammil",
    createdAt: new Date().toISOString(),
  },
  {
    id: "t-2",
    title: "Generate carousel visual mockup with Stoic collage theme",
    cardTitle: "The Art of Thinking Clearly When Everyone Has an Opinion",
    dueDate: "2026-11-23",
    priority: "Medium",
    status: "todo",
    assignee: "Muzammil",
    createdAt: new Date().toISOString(),
  },
  {
    id: "t-3",
    title: "Review slide-by-slide copy before recording voiceover",
    cardTitle: "AI Did Your Homework. Can You Pass Without It?",
    dueDate: "2026-11-24",
    priority: "Medium",
    status: "todo",
    assignee: "Muzammil",
    createdAt: new Date().toISOString(),
  },
];

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<ContentCard[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [activeCategory, setActiveCategory] = useState<string>("All Categories");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedWriter, setSelectedWriter] = useState<string>("All Writers");
  const [viewMode, setViewMode] = useState<"Board" | "List">("Board");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Initial load from LocalStorage first (instant paint) then Supabase
  const refreshFromCloud = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    setIsSyncing(true);
    try {
      const dbCards = await fetchCardsFromDb();
      if (Array.isArray(dbCards) && dbCards.length > 0) {
        setCards(dbCards);
        setIsDbConnected(true);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dbCards));
        } catch (e) {
          console.warn("Could not cache dbCards to localStorage", e);
        }
      }
    } catch (err) {
      console.warn("Supabase fetch error:", err);
      setIsDbConnected(false);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    let initialCards = INITIAL_CARDS;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialCards = parsed;
        }
      }
      const storedTasks = localStorage.getItem(LOCAL_TASKS_KEY);
      if (storedTasks !== null) {
        const parsedTasks = JSON.parse(storedTasks);
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        } else {
          setTasks(INITIAL_TASKS);
        }
      } else {
        setTasks(INITIAL_TASKS);
      }
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }
    setCards(initialCards);
    setIsLoaded(true);

    // Initial fetch from cloud
    refreshFromCloud();
  }, [refreshFromCloud]);

  // Realtime Supabase Subscription
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel("realtime:content_cards")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "content_cards" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newCard = mapRowToCard(payload.new);
            setCards((prev) => {
              if (prev.some((c) => c.id === newCard.id)) return prev;
              return [newCard, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            const updated = mapRowToCard(payload.new);
            setCards((prev) =>
              prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
            );
          } else if (payload.eventType === "DELETE") {
            const deletedId = (payload.old as { id?: string }).id;
            if (deletedId) {
              setCards((prev) => prev.filter((c) => c.id !== deletedId));
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsDbConnected(true);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cards));
      } catch (e) {
        console.warn("Could not save to localStorage", e);
      }
    }
  }, [cards, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
      } catch (e) {
        console.warn("Could not save tasks to localStorage", e);
      }
    }
  }, [tasks, isLoaded]);

  const updateCardStatus = useCallback((cardId: string, newStatus: string) => {
    setCards((prev) => {
      const target = prev.find((c) => c.id === cardId);
      if (!target) return prev;

      const updated = {
        ...target,
        status: newStatus,
        activityLog: [
          { text: `Moved to ${newStatus}`, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
          ...(target.activityLog || []),
        ],
      };

      // Background push to DB
      upsertCardInDb(updated).catch((err) =>
        console.warn("Error updating card status in DB:", err)
      );

      return prev.map((c) => (c.id === cardId ? updated : c));
    });
  }, []);

  const updateCard = useCallback((updatedCard: ContentCard) => {
    setCards((prev) => {
      const newCards = prev.map((c) => (c.id === updatedCard.id ? updatedCard : c));
      upsertCardInDb(updatedCard).catch((err) =>
        console.warn("Error updating card in DB:", err)
      );
      return newCards;
    });
  }, []);

  const addCard = useCallback((cardData: Partial<ContentCard>) => {
    const newCard: ContentCard = {
      id: "card-" + Date.now(),
      title: cardData.title || "Untitled Card",
      type: cardData.type || "IG Carousel",
      status: cardData.status || "Idea",
      category: cardData.category || "Mindset & Philosophy",
      priority: cardData.priority || "Medium",
      slidesCount: cardData.slidesCount || 8,
      slideCopy: cardData.slideCopy || "Slide 1 (cover): ...\nSlide 2: ...",
      caption: cardData.caption || "",
      hashtags: cardData.hashtags || "#RewriteMinds #Mindset #Productivity",
      owner: cardData.owner || "Muzammil",
      pm: cardData.pm || "Unassigned",
      designer: cardData.designer || "Unassigned",
      writer: cardData.writer || "Muzammil",
      tags: cardData.tags || "mindset, mental-models",
      activityLog: [
        { text: `Created as ${cardData.type || "IG Carousel"} in ${cardData.status || "Idea"}`, time: "Just now" },
        ...(cardData.activityLog || []),
      ],
      ...cardData,
    };

    setCards((prev) => [newCard, ...prev]);

    upsertCardInDb(newCard).catch((err) =>
      console.warn("Error inserting card into DB:", err)
    );

    return newCard;
  }, []);

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    deleteCardFromDb(id).catch((err) =>
      console.warn("Error deleting card from DB:", err)
    );
  }, []);

  const clearAllCards = useCallback(() => {
    setCards([]);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
    } catch (e) {}
    clearAllCardsInDb().catch((err) =>
      console.warn("Error clearing cards in DB:", err)
    );
  }, []);

  const getCardById = useCallback(
    (id: string) => {
      return cards.find((c) => c.id === id);
    },
    [cards]
  );

  // Dynamic unique writers & categories
  const uniqueWriters = useMemo(() => {
    const set = new Set<string>();
    cards.forEach((c) => {
      if (c.writer && c.writer !== "Unassigned") set.add(c.writer);
      if (c.owner && c.owner !== "Unassigned") set.add(c.owner);
    });
    return Array.from(set).sort();
  }, [cards]);

  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    cards.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set).sort();
  }, [cards]);

  // Tasks methods
  const addTask = useCallback((taskData: Partial<TaskItem>): TaskItem => {
    const newTask: TaskItem = {
      id: "t-" + Date.now(),
      title: taskData.title || "Untitled Task",
      cardId: taskData.cardId,
      cardTitle: taskData.cardTitle,
      dueDate: taskData.dueDate || new Date().toISOString().split("T")[0],
      priority: taskData.priority || "Medium",
      status: taskData.status || "todo",
      assignee: taskData.assignee || "Muzammil",
      createdAt: new Date().toISOString(),
      ...taskData,
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((updatedTask: TaskItem) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ContentContext.Provider
      value={{
        cards,
        updateCardStatus,
        updateCard,
        addCard,
        deleteCard,
        clearAllCards,
        getCardById,
        activeFilter,
        setActiveFilter,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedWriter,
        setSelectedWriter,
        viewMode,
        setViewMode,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isDbConnected,
        isSyncing,
        uniqueWriters,
        uniqueCategories,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        refreshFromCloud,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
