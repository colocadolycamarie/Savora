// Centralized validation rules so every form (Reservations, Gift Cards,
// Contact) shares the same messages and behavior instead of re-implementing
// ad-hoc checks per page.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Loose international phone check: allows +, spaces, dashes, parens; 7-15 digits.
const PHONE_RE = /^[+]?[\d\s().-]{7,20}$/;

export function required(value: string, label = 'This field'): string | undefined {
  if (!value || !value.trim()) return `${label} is required.`;
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  if (!value || !value.trim()) return 'Email is required.';
  if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email address.';
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  if (!value || !value.trim()) return 'Phone number is required.';
  const digits = value.replace(/\D/g, '');
  if (!PHONE_RE.test(value.trim()) || digits.length < 7) {
    return 'Enter a valid phone number.';
  }
  return undefined;
}

export function validateName(value: string): string | undefined {
  if (!value || !value.trim()) return 'Name is required.';
  if (value.trim().length < 2) return 'Name looks too short.';
  return undefined;
}

export function validateMessage(value: string, min = 10): string | undefined {
  if (!value || !value.trim()) return 'Please enter a message.';
  if (value.trim().length < min) {
    return `Please add a little more detail (at least ${min} characters).`;
  }
  return undefined;
}
