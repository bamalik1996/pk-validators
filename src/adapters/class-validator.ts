/**
 * pk-validators/class-validator
 *
 * class-validator decorator adapters for Pakistani validators.
 * Requires class-validator >= 0.14.0 as a peer dependency.
 *
 * Usage:
 *   import { IsPkCnic, IsPkPhone, IsPkNtn, IsPkIban, IsPkPostal } from 'pk-validators/class-validator';
 *
 *   class KycDto {
 *     @IsPkCnic()
 *     cnic: string;
 *
 *     @IsPkPhone({ allowLandline: false })
 *     phone: string;
 *   }
 */
import { registerDecorator, type ValidationOptions } from 'class-validator';
import { isValidCnic } from '../validators/cnic';
import { isValidPhone } from '../validators/phone';
import { isValidNtn } from '../validators/ntn';
import { isValidIban } from '../validators/iban';
import { isValidPostal } from '../validators/postal';
import { isValidPassport } from '../validators/passport';
import type { PhoneValidationOptions } from '../validators/phone';

export function IsPkCnic(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPkCnic',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && isValidCnic(value).valid;
        },
        defaultMessage() {
          return 'Invalid Pakistani CNIC';
        },
      },
    });
  };
}

export function IsPkPhone(
  phoneOptions?: PhoneValidationOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPkPhone',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && isValidPhone(value, phoneOptions).valid;
        },
        defaultMessage() {
          return 'Invalid Pakistani phone number';
        },
      },
    });
  };
}

export function IsPkNtn(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPkNtn',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && isValidNtn(value).valid;
        },
        defaultMessage() {
          return 'Invalid Pakistani NTN';
        },
      },
    });
  };
}

export function IsPkIban(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPkIban',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && isValidIban(value).valid;
        },
        defaultMessage() {
          return 'Invalid Pakistani IBAN';
        },
      },
    });
  };
}

export function IsPkPostal(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPkPostal',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && isValidPostal(value).valid;
        },
        defaultMessage() {
          return 'Invalid Pakistani postal code';
        },
      },
    });
  };
}

export function IsPkPassport(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPkPassport',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && isValidPassport(value).valid;
        },
        defaultMessage() {
          return 'Invalid Pakistani passport number';
        },
      },
    });
  };
}
