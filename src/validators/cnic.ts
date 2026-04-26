import type { ValidationResult, ParsedCnic, Province } from '../types';

const PROVINCE_MAP: Record<string, Province> = {
  '1': 'KPK',
  '2': 'FATA',
  '3': 'Punjab',
  '4': 'Sindh',
  '5': 'Balochistan',
  '6': 'Islamabad',
  '7': 'Gilgit-Baltistan',
  '8': 'AJK',
};

export function isValidCnic(value: string): ValidationResult<ParsedCnic> {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: 'CNIC must be a non-empty string' };
  }

  const raw = value.replace(/[-\s]/g, '');

  if (raw.length !== 13) {
    return { valid: false, error: `CNIC must be 13 digits (got ${raw.length})` };
  }

  if (!/^\d+$/.test(raw)) {
    return { valid: false, error: 'CNIC must contain digits only' };
  }

  const provinceCode = raw[0];
  const province = PROVINCE_MAP[provinceCode];

  if (!province) {
    return { valid: false, error: `Invalid province code: ${provinceCode}. Valid codes are 1–8` };
  }

  const lastDigit = parseInt(raw[12], 10);
  const gender: 'male' | 'female' = lastDigit % 2 === 0 ? 'female' : 'male';
  const districtCode = raw.slice(0, 5);
  const registrationNumber = raw.slice(5, 12);

  return {
    valid: true,
    data: {
      province,
      districtCode,
      registrationNumber,
      gender,
      raw,
      formatted: `${raw.slice(0, 5)}-${raw.slice(5, 12)}-${raw[12]}`,
    },
  };
}

export function formatCnic(value: string): string {
  const result = isValidCnic(value);
  if (!result.valid || !result.data) {
    throw new Error(`Cannot format invalid CNIC: ${result.error}`);
  }
  return result.data.formatted;
}

export function parseCnic(value: string): ParsedCnic {
  const result = isValidCnic(value);
  if (!result.valid || !result.data) {
    throw new Error(`Cannot parse invalid CNIC: ${result.error}`);
  }
  return result.data;
}
