import type { ValidationResult, ParsedNtn } from '../types';

/**
 * NTN (National Tax Number) — Pakistan Federal Board of Revenue
 * Format: XXXXXXX-X (7 digits, dash, 1 check digit)
 * Total digits: 8
 * Some older NTNs are 7 digits without check digit.
 */
export function isValidNtn(value: string): ValidationResult<ParsedNtn> {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: 'NTN must be a non-empty string' };
  }

  const raw = value.replace(/[-\s]/g, '');

  if (!/^\d+$/.test(raw)) {
    return { valid: false, error: 'NTN must contain digits only' };
  }

  // Accept 7 digits (old format) or 8 digits (new format with check digit)
  if (raw.length !== 7 && raw.length !== 8) {
    return {
      valid: false,
      error: `NTN must be 7 or 8 digits (got ${raw.length})`,
    };
  }

  // All zeros is invalid
  if (/^0+$/.test(raw)) {
    return { valid: false, error: 'NTN cannot be all zeros' };
  }

  const body = raw.slice(0, 7);
  const checkDigit = raw.length === 8 ? raw[7] : null;
  const formatted =
    raw.length === 8
      ? `${body}-${checkDigit}`
      : body;

  return {
    valid: true,
    data: {
      ntn: body,
      formatted,
      raw,
    },
  };
}

export function formatNtn(value: string): string {
  const result = isValidNtn(value);
  if (!result.valid || !result.data) {
    throw new Error(`Cannot format invalid NTN: ${result.error}`);
  }
  return result.data.formatted;
}

export function parseNtn(value: string): ParsedNtn {
  const result = isValidNtn(value);
  if (!result.valid || !result.data) {
    throw new Error(`Cannot parse invalid NTN: ${result.error}`);
  }
  return result.data;
}
