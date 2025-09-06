export interface User {
  id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  userType: "student" | "admin";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student extends User {
  grade: string;
  enrolledCourses: string[];
  points: number;
  rank: number;
  badges: Badge[];
  streakDays: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  category: string;
}
