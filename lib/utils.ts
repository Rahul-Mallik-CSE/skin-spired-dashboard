/** @format */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFullImageUrl = (
  imagePath: string | undefined | null
): string => {
  if (!imagePath) {
    return "";
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  if (imagePath.startsWith("/images") || imagePath.startsWith("/images")) {
    return `${process.env.NEXT_PUBLIC_API_URL}${imagePath}`;
  }
  return imagePath;
};
