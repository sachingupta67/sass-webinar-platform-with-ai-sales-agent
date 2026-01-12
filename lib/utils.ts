import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BADGE_STYLES = [
  "bg-red-100 text-red-700 border-red-200",
  "bg-green-100 text-green-700 border-green-200",
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-purple-100 text-purple-700 border-purple-200",
  "bg-pink-100 text-pink-700 border-pink-200",
  "bg-yellow-100 text-yellow-800 border-yellow-300",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
  "bg-teal-100 text-teal-700 border-teal-200",
];

export const getRandomBadgeStyle = () => {
  return BADGE_STYLES[Math.floor(Math.random() * BADGE_STYLES.length)];
};
