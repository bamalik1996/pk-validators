/**
 * pk-validators/joi
 *
 * Joi schema adapters for Pakistani validators.
 * Requires joi >= 17.0.0 as a peer dependency.
 *
 * Usage:
 *   import { pkCnic, pkPhone, pkNtn, pkIban, pkPostal } from 'pk-validators/joi';
 */
import Joi from 'joi';
import { isValidCnic } from '../validators/cnic';
import { isValidPhone } from '../validators/phone';
import { isValidNtn } from '../validators/ntn';
import { isValidIban } from '../validators/iban';
import { isValidPostal } from '../validators/postal';
import type { PhoneValidationOptions } from '../validators/phone';

export const pkCnic = () =>
  Joi.string().custom((value, helpers) => {
    const result = isValidCnic(value);
    if (!result.valid) {
      return helpers.error('any.invalid', { error: result.error });
    }
    return value;
  }, 'pk-cnic').messages({
    'any.invalid': '{{#error}}',
  });

export const pkPhone = (options: PhoneValidationOptions = {}) =>
  Joi.string().custom((value, helpers) => {
    const result = isValidPhone(value, options);
    if (!result.valid) {
      return helpers.error('any.invalid', { error: result.error });
    }
    return value;
  }, 'pk-phone').messages({
    'any.invalid': '{{#error}}',
  });

export const pkNtn = () =>
  Joi.string().custom((value, helpers) => {
    const result = isValidNtn(value);
    if (!result.valid) {
      return helpers.error('any.invalid', { error: result.error });
    }
    return value;
  }, 'pk-ntn').messages({
    'any.invalid': '{{#error}}',
  });

export const pkIban = () =>
  Joi.string().custom((value, helpers) => {
    const result = isValidIban(value);
    if (!result.valid) {
      return helpers.error('any.invalid', { error: result.error });
    }
    return value;
  }, 'pk-iban').messages({
    'any.invalid': '{{#error}}',
  });

export const pkPostal = () =>
  Joi.string().custom((value, helpers) => {
    const result = isValidPostal(value);
    if (!result.valid) {
      return helpers.error('any.invalid', { error: result.error });
    }
    return value;
  }, 'pk-postal').messages({
    'any.invalid': '{{#error}}',
  });
