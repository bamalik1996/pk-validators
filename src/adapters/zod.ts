/**
 * pk-validators/zod
 *
 * Zod schema adapters for Pakistani validators.
 * Requires zod >= 3.0.0 as a peer dependency.
 *
 * Usage:
 *   import { pkCnic, pkPhone, pkNtn, pkIban, pkPostal } from 'pk-validators/zod';
 */
import { z } from 'zod';
import { isValidCnic } from '../validators/cnic';
import { isValidPhone } from '../validators/phone';
import { isValidNtn } from '../validators/ntn';
import { isValidIban } from '../validators/iban';
import { isValidPostal } from '../validators/postal';
import type { PhoneValidationOptions } from '../validators/phone';

export const pkCnic = () =>
  z.string().superRefine((val, ctx) => {
    const result = isValidCnic(val);
    if (!result.valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error ?? 'Invalid CNIC',
      });
    }
  });

export const pkPhone = (options: PhoneValidationOptions = {}) =>
  z.string().superRefine((val, ctx) => {
    const result = isValidPhone(val, options);
    if (!result.valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error ?? 'Invalid phone number',
      });
    }
  });

export const pkNtn = () =>
  z.string().superRefine((val, ctx) => {
    const result = isValidNtn(val);
    if (!result.valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error ?? 'Invalid NTN',
      });
    }
  });

export const pkIban = () =>
  z.string().superRefine((val, ctx) => {
    const result = isValidIban(val);
    if (!result.valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error ?? 'Invalid IBAN',
      });
    }
  });

export const pkPostal = () =>
  z.string().superRefine((val, ctx) => {
    const result = isValidPostal(val);
    if (!result.valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error ?? 'Invalid postal code',
      });
    }
  });
