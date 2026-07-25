import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validateName,
  validatePhone,
  validateMessage,
} from '@/lib/validation';

describe('validateEmail', () => {
  it('accepts a well-formed email', () => {
    expect(validateEmail('maria@example.com')).toBeUndefined();
  });

  it('rejects an empty value', () => {
    expect(validateEmail('')).toBe('Email is required.');
  });

  it('rejects a value missing an @', () => {
    expect(validateEmail('not-an-email')).toBe('Enter a valid email address.');
  });

  it('rejects a value missing a domain', () => {
    expect(validateEmail('maria@')).toBe('Enter a valid email address.');
  });
});

describe('validateName', () => {
  it('accepts a normal name', () => {
    expect(validateName('Maria Clara')).toBeUndefined();
  });

  it('rejects an empty value', () => {
    expect(validateName('')).toBe('Name is required.');
  });

  it('rejects a single character', () => {
    expect(validateName('M')).toBe('Name looks too short.');
  });

  it('rejects whitespace-only input', () => {
    expect(validateName('   ')).toBe('Name is required.');
  });
});

describe('validatePhone', () => {
  it('accepts a Philippine mobile number with country code', () => {
    expect(validatePhone('+639171234567')).toBeUndefined();
  });

  it('accepts a formatted number with spaces and dashes', () => {
    expect(validatePhone('+63 917-123-4567')).toBeUndefined();
  });

  it('rejects a too-short number', () => {
    expect(validatePhone('123')).toBe('Enter a valid phone number.');
  });

  it('rejects letters', () => {
    expect(validatePhone('call-me-maybe')).toBe('Enter a valid phone number.');
  });
});

describe('validateMessage', () => {
  it('accepts a message meeting the minimum length', () => {
    expect(validateMessage('Do you have vegan options available?')).toBeUndefined();
  });

  it('rejects an empty message', () => {
    expect(validateMessage('')).toBe('Please enter a message.');
  });

  it('rejects a too-short message with a helpful minimum', () => {
    expect(validateMessage('Hi', 10)).toContain('at least 10 characters');
  });
});
