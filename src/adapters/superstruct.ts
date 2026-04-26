/**
 * pk-validators/superstruct
 *
 * Superstruct schema adapters for Pakistani validators.
 * Requires superstruct >= 2.0.0 as a peer dependency.
 *
 * Usage:
 *   import { pkCnic, pkPhone, pkNtn, pkIban, pkPostal } from 'pk-validators/superstruct';
 */
import { string, refine } from 'superstruct';
import { isValidCnic } from '../validators/cnic';
import { isValidPhone } from '../validators/phone';
import { isValidNtn } from '../validators/ntn';
import { isValidIban } from '../validators/iban';
import { isValidPostal } from '../validators/postal';
import { isValidPassport } from '../validators/passport';
import type { PhoneValidationOptions } from '../validators/phone';

export const pkCnic = () =>
  refine(string(), 'pk-cnic', (value) => {
    const result = isValidCnic(value);
    return result.valid || result.error || 'Invalid CNIC';
  });

export const pkPhone = (options: PhoneValidationOptions = {}) =>
  refine(string(), 'pk-phone', (value) => {
    const result = isValidPhone(value, options);
    return result.valid || result.error || 'Invalid phone number';
  });

export const pkNtn = () =>
  refine(string(), 'pk-ntn', (value) => {
    const result = isValidNtn(value);
    return result.valid || result.error || 'Invalid NTN';
  });

export const pkIban = () =>
  refine(string(), 'pk-iban', (value) => {
    const result = isValidIban(value);
    return result.valid || result.error || 'Invalid IBAN';
  });

export const pkPostal = () =>
  refine(string(), 'pk-postal', (value) => {
    const result = isValidPostal(value);
    return result.valid || result.error || 'Invalid postal code';
  });

export const pkPassport = () =>
  refine(string(), 'pk-passport', (value) => {
    const result = isValidPassport(value);
    return result.valid || result.error || 'Invalid passport number';
  });
