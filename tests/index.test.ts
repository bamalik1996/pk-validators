import { describe, it, expect } from 'vitest';

import { isValidCnic, formatCnic, parseCnic } from '../src/validators/cnic';
import { isValidPhone, formatPhone, parsePhone } from '../src/validators/phone';
import { isValidNtn, formatNtn } from '../src/validators/ntn';
import { isValidIban, getBankName } from '../src/validators/iban';
import { isValidPostal, getCity, getProvince } from '../src/validators/postal';

// ============================================================
// CNIC
// ============================================================
describe('CNIC', () => {
  describe('isValidCnic', () => {
    it('accepts formatted CNIC', () => {
      const r = isValidCnic('35202-1234567-3');
      expect(r.valid).toBe(true);
      expect(r.data?.province).toBe('Punjab');
      expect(r.data?.gender).toBe('male');
      expect(r.data?.formatted).toBe('35202-1234567-3');
    });

    it('accepts unformatted 13 digits', () => {
      const r = isValidCnic('3520212345673');
      expect(r.valid).toBe(true);
    });

    it('accepts Sindh CNIC (code 4)', () => {
      const r = isValidCnic('42101-1234567-2');
      expect(r.data?.province).toBe('Sindh');
      expect(r.data?.gender).toBe('female'); // even last digit
    });

    it('accepts Islamabad CNIC (code 6)', () => {
      const r = isValidCnic('61101-1234567-1');
      expect(r.data?.province).toBe('Islamabad');
    });

    it('rejects too short', () => {
      const r = isValidCnic('12345678');
      expect(r.valid).toBe(false);
      expect(r.error).toContain('13 digits');
    });

    it('rejects invalid province code 9', () => {
      const r = isValidCnic('95202-1234567-3');
      expect(r.valid).toBe(false);
      expect(r.error).toContain('province');
    });

    it('rejects non-numeric', () => {
      expect(isValidCnic('ABCDE-1234567-3').valid).toBe(false);
    });

    it('rejects empty string', () => {
      expect(isValidCnic('').valid).toBe(false);
    });
  });

  describe('formatCnic', () => {
    it('formats 13 raw digits correctly', () => {
      expect(formatCnic('3520212345673')).toBe('35202-1234567-3');
    });

    it('throws on invalid input', () => {
      expect(() => formatCnic('123')).toThrow();
    });
  });

  describe('parseCnic', () => {
    it('returns full parsed object', () => {
      const p = parseCnic('35202-1234567-3');
      expect(p.province).toBe('Punjab');
      expect(p.districtCode).toBe('35202');
      expect(p.registrationNumber).toBe('1234567');
      expect(p.gender).toBe('male');
    });
  });
});

// ============================================================
// Phone
// ============================================================
describe('Phone', () => {
  describe('isValidPhone', () => {
    it('detects Jazz number', () => {
      const r = isValidPhone('03001234567');
      expect(r.valid).toBe(true);
      expect(r.data?.carrier).toBe('Jazz');
      expect(r.data?.type).toBe('mobile');
    });

    it('detects Telenor number', () => {
      const r = isValidPhone('0341-1234567');
      expect(r.valid).toBe(true);
    });

    it('normalizes +92 prefix', () => {
      const r = isValidPhone('+923001234567');
      expect(r.valid).toBe(true);
      expect(r.data?.carrier).toBe('Jazz');
    });

    it('normalizes 0092 prefix', () => {
      const r = isValidPhone('00923001234567');
      expect(r.valid).toBe(true);
    });

    it('formats to E.164', () => {
      expect(formatPhone('03001234567', 'e164')).toBe('+923001234567');
    });

    it('formats to local', () => {
      expect(formatPhone('03001234567', 'local')).toBe('0300-1234567');
    });

    it('rejects landline without option', () => {
      const r = isValidPhone('05112345678');
      expect(r.valid).toBe(false);
      expect(r.error).toContain('allowLandline');
    });

    it('accepts landline with option', () => {
      const r = isValidPhone('05112345678', { allowLandline: true });
      expect(r.valid).toBe(true);
    });

    it('rejects too short', () => {
      expect(isValidPhone('0300123').valid).toBe(false);
    });

    it('rejects non-numeric', () => {
      expect(isValidPhone('0300-ABC-DEFG').valid).toBe(false);
    });
  });
});

// ============================================================
// NTN
// ============================================================
describe('NTN', () => {
  describe('isValidNtn', () => {
    it('accepts 8-digit NTN with check digit', () => {
      const r = isValidNtn('1234567-8');
      expect(r.valid).toBe(true);
      expect(r.data?.formatted).toBe('1234567-8');
    });

    it('accepts 7-digit legacy NTN', () => {
      const r = isValidNtn('1234567');
      expect(r.valid).toBe(true);
      expect(r.data?.formatted).toBe('1234567');
    });

    it('rejects all zeros', () => {
      expect(isValidNtn('0000000').valid).toBe(false);
    });

    it('rejects 6 digits', () => {
      expect(isValidNtn('123456').valid).toBe(false);
    });

    it('rejects non-numeric', () => {
      expect(isValidNtn('ABCDEFG').valid).toBe(false);
    });
  });

  describe('formatNtn', () => {
    it('formats 8-digit NTN', () => {
      expect(formatNtn('12345678')).toBe('1234567-8');
    });
  });
});

// ============================================================
// IBAN
// ============================================================
describe('IBAN', () => {
  describe('isValidIban', () => {
    it('accepts valid HBL IBAN', () => {
      // PK93HABB0000000017591921 — mod97 verified checksum
      const r = isValidIban('PK93HABB0000000017591921');
      expect(r.valid).toBe(true);
      expect(r.data?.bankCode).toBe('HABB');
      expect(r.data?.bankName).toBe('Habib Bank Limited (HBL)');
    });

    it('accepts valid Meezan IBAN', () => {
      // PK35MEZN0000000099887766 — mod97 verified checksum
      const r = isValidIban('PK35MEZN0000000099887766');
      expect(r.valid).toBe(true);
      expect(r.data?.bankCode).toBe('MEZN');
    });

    it('rejects non-PK IBAN', () => {
      const r = isValidIban('GB29NWBK60161331926819');
      expect(r.valid).toBe(false);
      expect(r.error).toContain('"PK"');
    });

    it('rejects wrong length', () => {
      const r = isValidIban('PK123456');
      expect(r.valid).toBe(false);
      expect(r.error).toContain('24 characters');
    });

    it('rejects empty', () => {
      expect(isValidIban('').valid).toBe(false);
    });
  });

  describe('getBankName', () => {
    it('returns Meezan Bank for MEZN', () => {
      expect(getBankName('MEZN')).toBe('Meezan Bank');
    });

    it('returns HBL for HABB', () => {
      expect(getBankName('HABB')).toBe('Habib Bank Limited (HBL)');
    });

    it('returns null for unknown code', () => {
      expect(getBankName('XXXX')).toBeNull();
    });
  });
});

// ============================================================
// Postal
// ============================================================
describe('Postal', () => {
  describe('isValidPostal', () => {
    it('validates Karachi postal code', () => {
      const r = isValidPostal('74000');
      expect(r.valid).toBe(true);
      expect(r.data?.city).toBe('Karachi');
      expect(r.data?.province).toBe('Sindh');
    });

    it('validates Lahore postal code', () => {
      const r = isValidPostal('54000');
      expect(r.valid).toBe(true);
      expect(r.data?.province).toBe('Punjab');
    });

    it('validates Islamabad postal code', () => {
      const r = isValidPostal('44000');
      expect(r.valid).toBe(true);
      expect(r.data?.province).toBe('Islamabad');
    });

    it('validates Peshawar (KPK)', () => {
      const r = isValidPostal('25000');
      expect(r.valid).toBe(true);
      expect(r.data?.province).toBe('KPK');
    });

    it('rejects unknown postal code', () => {
      const r = isValidPostal('99999');
      expect(r.valid).toBe(false);
    });

    it('rejects 4-digit code', () => {
      expect(isValidPostal('7400').valid).toBe(false);
    });

    it('rejects non-numeric', () => {
      expect(isValidPostal('ABCDE').valid).toBe(false);
    });
  });

  describe('getCity', () => {
    it('returns city for valid code', () => {
      expect(getCity('74000')).toBe('Karachi');
    });
    it('returns null for invalid code', () => {
      expect(getCity('00000')).toBeNull();
    });
  });

  describe('getProvince', () => {
    it('returns province for valid code', () => {
      expect(getProvince('87300')).toBe('Balochistan');
    });
  });
});

// ============================================================
// Passport
// ============================================================
import { isValidPassport, parsePassport } from '../src/validators/passport';

describe('Passport', () => {
  describe('isValidPassport', () => {
    it('accepts valid passport AB1234567', () => {
      const r = isValidPassport('AB1234567');
      expect(r.valid).toBe(true);
      expect(r.data?.series).toBe('AB');
      expect(r.data?.serial).toBe('1234567');
      expect(r.data?.type).toBe('ordinary');
    });

    it('accepts lowercase and normalizes to uppercase', () => {
      const r = isValidPassport('ab1234567');
      expect(r.valid).toBe(true);
      expect(r.data?.number).toBe('AB1234567');
    });

    it('detects diplomatic passport (D-prefix)', () => {
      const r = isValidPassport('DA1234567');
      expect(r.valid).toBe(true);
      expect(r.data?.type).toBe('diplomatic');
    });

    it('detects official passport (S-prefix)', () => {
      const r = isValidPassport('SA1234567');
      expect(r.valid).toBe(true);
      expect(r.data?.type).toBe('official');
    });

    it('rejects too short', () => {
      const r = isValidPassport('AB12345');
      expect(r.valid).toBe(false);
      expect(r.error).toContain('9 characters');
    });

    it('rejects all digits', () => {
      const r = isValidPassport('123456789');
      expect(r.valid).toBe(false);
      expect(r.error).toContain('2 letters');
    });

    it('rejects all letters', () => {
      const r = isValidPassport('ABCDEFGHI');
      expect(r.valid).toBe(false);
      expect(r.error).toContain('7 digits');
    });

    it('rejects empty string', () => {
      expect(isValidPassport('').valid).toBe(false);
    });
  });

  describe('parsePassport', () => {
    it('returns parsed passport object', () => {
      const p = parsePassport('AB1234567');
      expect(p.series).toBe('AB');
      expect(p.serial).toBe('1234567');
      expect(p.type).toBe('ordinary');
      expect(p.number).toBe('AB1234567');
    });

    it('throws on invalid passport', () => {
      expect(() => parsePassport('123')).toThrow();
    });
  });
});
