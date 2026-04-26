import type { ValidationResult, ParsedPhone, PhoneCarrier, PhoneType } from '../types';

// Mobile prefixes (first 4 digits e.g. 0300)
const MOBILE_CARRIER_MAP: Record<string, PhoneCarrier> = {
  '0300': 'Jazz',  '0301': 'Jazz',  '0302': 'Jazz',  '0303': 'Jazz',
  '0304': 'Jazz',  '0305': 'Jazz',  '0306': 'Jazz',  '0307': 'Jazz',
  '0308': 'Jazz',  '0309': 'Jazz',
  '0310': 'Zong',  '0311': 'Zong',  '0312': 'Zong',  '0313': 'Zong',
  '0314': 'Zong',  '0315': 'Zong',  '0316': 'Zong',  '0317': 'Zong',
  '0318': 'Zong',  '0319': 'Zong',
  '0320': 'Ufone', '0321': 'Ufone', '0322': 'Ufone', '0323': 'Ufone',
  '0324': 'Ufone', '0325': 'Ufone', '0326': 'Ufone', '0327': 'Ufone',
  '0328': 'Ufone', '0329': 'Ufone',
  '0330': 'Ufone', '0331': 'Ufone', '0332': 'Ufone', '0333': 'Ufone',
  '0334': 'Ufone', '0335': 'Ufone',
  '0340': 'Zong',  '0341': 'Zong',  '0342': 'Zong',  '0343': 'Zong',
  '0344': 'Zong',  '0345': 'Zong',  '0346': 'Zong',  '0347': 'Zong',
  '0348': 'Zong',  '0349': 'Zong',
  '0350': 'Zong',  '0351': 'Zong',
  '0360': 'Jazz',  '0361': 'Jazz',
  '0380': 'SCO',   '0381': 'SCO',
  '0410': 'Telenor','0411': 'Telenor',
  '0420': 'Telenor','0421': 'Telenor',
};

// 3-digit prefix for broader matching fallback
const PREFIX3_MAP: Record<string, PhoneCarrier> = {
  '030': 'Jazz',   '031': 'Jazz',
  '032': 'Ufone',  '033': 'Ufone',
  '034': 'Zong',   '035': 'Zong',
  '036': 'Zong',
  '038': 'SCO',
  '041': 'Telenor','042': 'Telenor','043': 'Telenor',
  '044': 'Telenor','045': 'Telenor',
};

function normalizeDigits(value: string): string {
  let d = value.replace(/[\s\-().+]/g, '');
  if (d.startsWith('0092')) d = '0' + d.slice(4);
  else if (d.startsWith('92') && d.length === 12) d = '0' + d.slice(2);
  return d;
}

export interface PhoneValidationOptions {
  allowLandline?: boolean;
}

export function isValidPhone(
  value: string,
  options: PhoneValidationOptions = {}
): ValidationResult<ParsedPhone> {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: 'Phone number must be a non-empty string' };
  }

  const digits = normalizeDigits(value);

  if (!/^\d+$/.test(digits)) {
    return { valid: false, error: 'Phone number must contain digits only (after stripping spaces/dashes)' };
  }

  if (digits.length !== 11) {
    return { valid: false, error: `Expected 11 digits, got ${digits.length}` };
  }

  if (!digits.startsWith('0')) {
    return { valid: false, error: 'Pakistani phone numbers must start with 0' };
  }

  const isMobile = digits[1] === '3';
  const type: PhoneType = isMobile ? 'mobile' : 'landline';

  if (!isMobile && !options.allowLandline) {
    return {
      valid: false,
      error: 'Landline numbers are not validated by default. Pass { allowLandline: true } to enable.',
    };
  }

  const prefix4 = digits.slice(0, 4);
  const prefix3 = digits.slice(0, 3);
  const carrier: PhoneCarrier =
    MOBILE_CARRIER_MAP[prefix4] ?? PREFIX3_MAP[prefix3] ?? 'Unknown';

  return {
    valid: true,
    data: {
      carrier,
      type,
      local: `${digits.slice(0, 4)}-${digits.slice(4)}`,
      e164: `+92${digits.slice(1)}`,
      digits,
    },
  };
}

export function formatPhone(value: string, format: 'local' | 'e164' = 'local'): string {
  const result = isValidPhone(value, { allowLandline: true });
  if (!result.valid || !result.data) {
    throw new Error(`Cannot format invalid phone: ${result.error}`);
  }
  return format === 'e164' ? result.data.e164 : result.data.local;
}

export function parsePhone(value: string, options?: PhoneValidationOptions): ParsedPhone {
  const result = isValidPhone(value, options);
  if (!result.valid || !result.data) {
    throw new Error(`Cannot parse invalid phone: ${result.error}`);
  }
  return result.data;
}
