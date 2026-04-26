/**
 * pk-validators/yup
 *
 * Yup schema adapters for Pakistani validators.
 * Requires yup >= 1.0.0 as a peer dependency.
 *
 * Usage:
 *   import { pkCnic, pkPhone, pkNtn, pkIban, pkPostal } from 'pk-validators/yup';
 */
import * as yup from 'yup';
import { isValidCnic } from '../validators/cnic';
import { isValidPhone } from '../validators/phone';
import { isValidNtn } from '../validators/ntn';
import { isValidIban } from '../validators/iban';
import { isValidPostal } from '../validators/postal';
import type { PhoneValidationOptions } from '../validators/phone';

export const pkCnic = () =>
  yup.string().test('pk-cnic', 'Invalid CNIC', function (value) {
    if (!value) return true; // let required() handle empty
    const result = isValidCnic(value);
    if (result.valid) return true;
    return this.createError({ message: result.error });
  });

export const pkPhone = (options: PhoneValidationOptions = {}) =>
  yup.string().test('pk-phone', 'Invalid phone number', function (value) {
    if (!value) return true;
    const result = isValidPhone(value, options);
    if (result.valid) return true;
    return this.createError({ message: result.error });
  });

export const pkNtn = () =>
  yup.string().test('pk-ntn', 'Invalid NTN', function (value) {
    if (!value) return true;
    const result = isValidNtn(value);
    if (result.valid) return true;
    return this.createError({ message: result.error });
  });

export const pkIban = () =>
  yup.string().test('pk-iban', 'Invalid IBAN', function (value) {
    if (!value) return true;
    const result = isValidIban(value);
    if (result.valid) return true;
    return this.createError({ message: result.error });
  });

export const pkPostal = () =>
  yup.string().test('pk-postal', 'Invalid postal code', function (value) {
    if (!value) return true;
    const result = isValidPostal(value);
    if (result.valid) return true;
    return this.createError({ message: result.error });
  });
