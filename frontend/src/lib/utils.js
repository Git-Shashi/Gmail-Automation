import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Parse email address from "Name <email@example.com>" format
export function parseEmailAddress(emailStr) {
  if (!emailStr) return { name: '', email: '' };
  
  const match = emailStr.match(/^(.+?)\s*<(.+?)>$/);
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() };
  }
  return { name: emailStr, email: emailStr };
}

// Get initials from name
export function getInitials(name) {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Format email date
export function formatEmailDate(dateStr, fullFormat = false) {
  if (!dateStr) return '';
  
  const date = new Date(dateStr);
  
  // Full format for email detail view
  if (fullFormat) {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  
  // Compact format for email cards
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Get category color
export function getCategoryColor(category) {
  const colors = {
    important: 'bg-red-100 text-red-800 border-red-300',
    social: 'bg-blue-100 text-blue-800 border-blue-300',
    promotions: 'bg-green-100 text-green-800 border-green-300',
    updates: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    spam: 'bg-gray-100 text-gray-800 border-gray-300',
    others: 'bg-purple-100 text-purple-800 border-purple-300'
  };
  return colors[category?.toLowerCase()] || colors.others;
}

// Validate email
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Format chat timestamp
export function formatChatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
