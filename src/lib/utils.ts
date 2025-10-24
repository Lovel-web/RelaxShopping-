import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function validateNigerianPhone(phone: string): boolean {
  // Nigerian phone numbers: +234XXXXXXXXXX or 0XXXXXXXXXXX
  const regex = /^(\+234|0)[789][01]\d{8}$/;
  return regex.test(phone.replace(/\s/g, ''));
}

export function formatNigerianPhone(phone: string): string {
  // Convert to +234 format
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.startsWith('0')) {
    return '+234' + cleaned.slice(1);
  }
  if (cleaned.startsWith('234')) {
    return '+' + cleaned;
  }
  if (cleaned.startsWith('+234')) {
    return cleaned;
  }
  return phone;
}

export function generateOrderReference(estateOrHotel?: string): string {
  // Use the first word of the estate/hotel, uppercase, or default 'UNK' if not provided
  const prefix = estateOrHotel
    ? estateOrHotel.split(" ")[0].toUpperCase()
    : "UNK";

  // Generate a random 4-digit number (1000–9999)
  const random = Math.floor(1000 + Math.random() * 9000);

  return `${prefix}-${random}`;
};
