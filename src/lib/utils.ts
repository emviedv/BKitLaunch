import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 

export function reorderArray<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  const length = Array.isArray(list) ? list.length : 0
  if (length === 0) return []

  const boundedFrom = Math.max(0, Math.min(length - 1, fromIndex))
  const boundedTo = Math.max(0, Math.min(length - 1, toIndex))
  if (boundedFrom === boundedTo) return list.slice()

  const result = list.slice()
  const [moved] = result.splice(boundedFrom, 1)
  result.splice(boundedTo, 0, moved)
  return result
}