// Types
export type {
  ValidationResult,
  Province,
  PhoneCarrier,
  PhoneType,
  ParsedCnic,
  ParsedPhone,
  ParsedNtn,
  ParsedIban,
  ParsedPostal,
} from './types';

// CNIC
export { isValidCnic, formatCnic, parseCnic } from './validators/cnic';

// Phone
export {
  isValidPhone,
  formatPhone,
  parsePhone,
} from './validators/phone';
export type { PhoneValidationOptions } from './validators/phone';

// NTN
export { isValidNtn, formatNtn, parseNtn } from './validators/ntn';

// IBAN
export {
  isValidIban,
  formatIban,
  parseIban,
  getBankName,
} from './validators/iban';

// Postal
export {
  isValidPostal,
  getCity,
  getProvince,
  parsePostal,
} from './validators/postal';
