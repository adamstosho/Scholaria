import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format as formatDateFn, parseISO, isValid } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Robust date formatting utility that handles various date formats and edge cases
 * @param dateInput - Date string, Date object, or timestamp
 * @param formatString - Date format string (default: 'MMM dd, yyyy')
 * @param fallback - Fallback text if date is invalid (default: 'N/A')
 * @returns Formatted date string or fallback
 */
export function formatDate(
  dateInput: string | Date | number | null | undefined,
  formatString: string = 'MMM dd, yyyy',
  fallback: string = 'N/A'
): string {
  // Handle null/undefined
  if (!dateInput) {
    console.warn('Date formatting: null/undefined input');
    return fallback;
  }
  
  try {
    let date: Date;
    
    // Handle different input types
    if (typeof dateInput === 'string') {
      // Try parsing as ISO string first
      if (dateInput.includes('T') || dateInput.includes('Z')) {
        date = parseISO(dateInput);
      } else {
        // Try as regular date string
        date = new Date(dateInput);
      }
    } else if (typeof dateInput === 'number') {
      // Handle timestamp
      date = new Date(dateInput);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      console.warn('Date formatting: unknown input type:', typeof dateInput, dateInput);
      return fallback;
    }
    
    // Validate the date
    if (!isValid(date) || isNaN(date.getTime())) {
      console.warn('Date formatting: invalid date:', dateInput, 'Parsed as:', date);
      return fallback;
    }
    
    // Format the date
    const result = formatDateFn(date, formatString);
    console.log('Date formatting success:', dateInput, '->', result);
    return result;
  } catch (error) {
    console.warn('Date formatting error:', error, 'Input:', dateInput);
    return fallback;
  }
}

/**
 * Format date with time
 * @param dateInput - Date input
 * @param formatString - Date format string (default: 'MMM dd, yyyy HH:mm')
 * @returns Formatted date string
 */
export function formatDateTime(
  dateInput: string | Date | number | null | undefined,
  formatString: string = 'MMM dd, yyyy HH:mm'
): string {
  return formatDate(dateInput, formatString);
}

/**
 * Format date for display in lists (short format)
 * @param dateInput - Date input
 * @returns Formatted date string
 */
export function formatDateShort(dateInput: string | Date | number | null | undefined): string {
  return formatDate(dateInput, 'MMM dd');
}

/**
 * Format date for display in cards (medium format)
 * @param dateInput - Date input
 * @returns Formatted date string
 */
export function formatDateMedium(dateInput: string | Date | number | null | undefined): string {
  return formatDate(dateInput, 'MMM dd, yyyy');
}

/**
 * Format date for display in details (full format with time)
 * @param dateInput - Date input
 * @returns Formatted date string
 */
export function formatDateFull(dateInput: string | Date | number | null | undefined): string {
  return formatDate(dateInput, 'MMM dd, yyyy HH:mm');
}
