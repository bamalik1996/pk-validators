import type { ValidationResult, ParsedIban } from '../types';

/**
 * Pakistani IBAN format (ISO 13616):
 * PK + 2 check digits + 4-letter bank code + 16-digit account number
 * Total: 24 characters
 */
const PK_BANKS: Record<string, string> = {
  MEZN: 'Meezan Bank',
  HABB: 'Habib Bank Limited (HBL)',
  UNIL: 'United Bank Limited (UBL)',
  MUCB: 'MCB Bank',
  ALFH: 'Bank Alfalah',
  SCBL: 'Standard Chartered Bank',
  NBPA: 'National Bank of Pakistan (NBP)',
  BAHL: 'Bank Al-Habib',
  JSBL: 'JS Bank',
  DUIB: 'Dubai Islamic Bank',
  ABPA: 'Allied Bank',
  FAYS: 'Faysal Bank',
  SADA: 'Sadapay',
  INPA: 'Industrial and Commercial Bank of China',
  BKIP: 'Bank of Punjab',
  ZTBL: 'Zarai Taraqiati Bank',
  SOMB: 'Summit Bank',
  SILK: 'Silkbank',
  PZNB: 'Nayapay',
  TMFB: 'Telenor Microfinance Bank (Easypaisa)',
  JAZB: 'Jazz Cash (Waseela Microfinance Bank)',
  KHYB: 'Bank of Khyber',
  BPUN: 'Bank of Punjab',
  SNBL: 'Soneri Bank',
  FASB: 'First Aso Bank',
  HPAY: 'HBL Konnect',
};

function mod97(numericString: string): number {
  let remainder = 0;
  for (const ch of numericString) {
    remainder = (remainder * 10 + parseInt(ch, 10)) % 97;
  }
  return remainder;
}

export function isValidIban(value: string): ValidationResult<ParsedIban> {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: 'IBAN must be a non-empty string' };
  }

  const iban = value.replace(/\s/g, '').toUpperCase();

  if (!iban.startsWith('PK')) {
    return { valid: false, error: 'Pakistani IBANs must start with "PK"' };
  }

  if (iban.length !== 24) {
    return {
      valid: false,
      error: `Pakistani IBAN must be 24 characters (got ${iban.length})`,
    };
  }

  // ISO 13616 checksum: move first 4 chars to end, convert letters to numbers
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged
    .split('')
    .map((ch) => {
      const code = ch.charCodeAt(0);
      return code >= 65 && code <= 90
        ? (code - 55).toString() // A=10, B=11 ... Z=35
        : ch;
    })
    .join('');

  if (mod97(numeric) !== 1) {
    return {
      valid: false,
      error: 'IBAN checksum validation failed — this IBAN is invalid',
    };
  }

  const bankCode = iban.slice(4, 8);
  const accountNumber = iban.slice(8);
  const bankName = PK_BANKS[bankCode] ?? 'Unknown bank';

  // Format: PK00 XXXX 0000 0000 0000 0000
  const formatted = iban.match(/.{1,4}/g)!.join(' ');

  return {
    valid: true,
    data: {
      bankCode,
      bankName,
      accountNumber,
      formatted,
      raw: iban,
    },
  };
}

export function formatIban(value: string): string {
  const result = isValidIban(value);
  if (!result.valid || !result.data) {
    throw new Error(`Cannot format invalid IBAN: ${result.error}`);
  }
  return result.data.formatted;
}

export function parseIban(value: string): ParsedIban {
  const result = isValidIban(value);
  if (!result.valid || !result.data) {
    throw new Error(`Cannot parse invalid IBAN: ${result.error}`);
  }
  return result.data;
}

export function getBankName(ibanOrBankCode: string): string | null {
  const code = ibanOrBankCode.length === 4
    ? ibanOrBankCode.toUpperCase()
    : ibanOrBankCode.replace(/\s/g, '').toUpperCase().slice(4, 8);
  return PK_BANKS[code] ?? null;
}
