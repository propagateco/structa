export * as ProductInterface from "./product.interface";

/**
 * Product Types and Interfaces
 * ---------------------------
 *
 * Type definitions for the product feature
 */

// Content type mapping
export const ContentTypeConfig = {
  workout: {
    label: "Workout",
    color: "#3B82F6", // blue
    icon: "dumbbell",
  },
  audio: {
    label: "Audio",
    color: "#10B981", // green
    icon: "headphones",
  },
  video: {
    label: "Video",
    color: "#8B5CF6", // purple
    icon: "play-circle",
  },
  assessment: {
    label: "Assessment",
    color: "#F59E0B", // amber
    icon: "clipboard-check",
  },
} as const;

export type ContentType = keyof typeof ContentTypeConfig;

// Difficulty level config
export const DifficultyConfig = {
  beginner: {
    label: "Beginner",
  },
  intermediate: {
    label: "Intermediate",
  },
  advanced: {
    label: "Advanced",
  },
  expert: {
    label: "Expert",
  },
} as const;

export type DifficultyLevel = keyof typeof DifficultyConfig;

// Training style config
export const TrainingStyleConfig = {
  strength: {
    label: "Strength",
  },
  cardio: {
    label: "Cardio",
  },
  hiit: {
    label: "HIIT",
  },
  yoga: {
    label: "Yoga",
  },
  pilates: {
    label: "Pilates",
  },
  mixed: {
    label: "Mixed",
  },
} as const;

export type TrainingStyle = keyof typeof TrainingStyleConfig;

// Day names
export const DayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

// Product card display data
export interface ProductCardData {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  durationWeeks: number;
  difficultyLevel: DifficultyLevel;
  trainingStyle: TrainingStyle;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  userId: string;
}
