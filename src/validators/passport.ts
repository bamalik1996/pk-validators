import type { ValidationResult } from '../types';

export type PassportType = 'ordinary' | 'diplomatic' | 'official';

export interface ParsedPassport {
  /** Full 9-character passport number (uppercase) */
  number: string;
  /** Two-letter series prefix */
  series: string;
  /** Seven-digit serial number */
  serial: string;
  /** Passport type inferred from series letter */
  type: PassportType;
}

/**
 * Series-letter to passport type mapping.
 * A–E → Ordinary, D-prefix → Diplomatic, S-prefix → Official.
 * Fallback to 'ordinary' for unknown series.
 */
function inferPassportType(series: string): PassportType {
  const first = series[0];
  if (first === 'D') return 'diplomatic';
  if (first === 'S') return 'official';
  return 'ordinary';
}

/**
 * Pakistani passport number format:
 *   - 2 uppercase letters + 7 digits (e.g. AB1234567)
 *   - Total: 9 characters
 *   - No spaces or dashes
 */
export function isValidPassport(value: string): ValidationResult<ParsedPassport> {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: 'Passport number must be a non-empty string' };
  }

  const raw = value.replace(/[\s-]/g, '').toUpperCase();

  if (raw.length !== 9) {
    return {
      valid: false,
      error: `Passport number must be 9 characters (got ${raw.length})`,
    };
  }

  const series = raw.slice(0, 2);
  const serial = raw.slice(2);

  if (!/^[A-Z]{2}$/.test(series)) {
    return {
      valid: false,
      error: 'Passport number must start with 2 letters (e.g. AB1234567)',
    };
  }

  if (!/^\d{7}$/.test(serial)) {
    return {
      valid: false,
      error: 'Passport number must end with 7 digits (e.g. AB1234567)',
    };
  }

  return {
    valid: true,
    data: {
      number: raw,
      series,
      serial,
      type: inferPassportType(series),
    },
  };
}

export function parsePassport(value: string): ParsedPassport {
  const result = isValidPassport(value);
  if (!result.valid || !result.data) {
    throw new Error(`Cannot parse invalid passport: ${result.error}`);
  }
  return result.data;
}
