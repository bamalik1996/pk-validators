/**
 * pk-validators/valibot
 *
 * Valibot schema adapters for Pakistani validators.
 * Requires valibot >= 1.0.0 as a peer dependency.
 *
 * Usage:
 *   import { pkCnic, pkPhone, pkNtn, pkIban, pkPostal } from 'pk-validators/valibot';
 */
import * as v from 'valibot';
import { isValidCnic } from '../validators/cnic';
import { isValidPhone } from '../validators/phone';
import { isValidNtn } from '../validators/ntn';
import { isValidIban } from '../validators/iban';
import { isValidPostal } from '../validators/postal';
import type { PhoneValidationOptions } from '../validators/phone';

export const pkCnic = () =>
  v.pipe(
    v.string(),
    v.check((val) => isValidCnic(val).valid, 'Invalid CNIC'),
  );

export const pkPhone = (options: PhoneValidationOptions = {}) =>
  v.pipe(
    v.string(),
    v.check((val) => isValidPhone(val, options).valid, 'Invalid phone number'),
  );

export const pkNtn = () =>
  v.pipe(
    v.string(),
    v.check((val) => isValidNtn(val).valid, 'Invalid NTN'),
  );

export const pkIban = () =>
  v.pipe(
    v.string(),
    v.check((val) => isValidIban(val).valid, 'Invalid IBAN'),
  );

export const pkPostal = () =>
  v.pipe(
    v.string(),
    v.check((val) => isValidPostal(val).valid, 'Invalid postal code'),
  );
