import { describe, it, expect } from 'vitest';

// ============================================================
// Zod adapter
// ============================================================
import { z } from 'zod';
import * as zodAdapter from '../src/adapters/zod';

describe('Zod adapter', () => {
  it('pkCnic — accepts valid CNIC', () => {
    const schema = z.object({ cnic: zodAdapter.pkCnic() });
    const result = schema.safeParse({ cnic: '35202-1234567-3' });
    expect(result.success).toBe(true);
  });

  it('pkCnic — rejects invalid CNIC with message', () => {
    const schema = z.object({ cnic: zodAdapter.pkCnic() });
    const result = schema.safeParse({ cnic: '99999' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('13 digits');
    }
  });

  it('pkPhone — accepts valid mobile', () => {
    const schema = z.object({ phone: zodAdapter.pkPhone() });
    const result = schema.safeParse({ phone: '03001234567' });
    expect(result.success).toBe(true);
  });

  it('pkPhone — rejects landline by default', () => {
    const schema = z.object({ phone: zodAdapter.pkPhone() });
    const result = schema.safeParse({ phone: '05112345678' });
    expect(result.success).toBe(false);
  });

  it('pkPhone — accepts landline with option', () => {
    const schema = z.object({ phone: zodAdapter.pkPhone({ allowLandline: true }) });
    const result = schema.safeParse({ phone: '05112345678' });
    expect(result.success).toBe(true);
  });

  it('pkNtn — accepts valid NTN', () => {
    const schema = z.object({ ntn: zodAdapter.pkNtn() });
    const result = schema.safeParse({ ntn: '1234567-8' });
    expect(result.success).toBe(true);
  });

  it('pkIban — accepts valid IBAN', () => {
    const schema = z.object({ iban: zodAdapter.pkIban() });
    const result = schema.safeParse({ iban: 'PK93HABB0000000017591921' });
    expect(result.success).toBe(true);
  });

  it('pkPostal — accepts valid postal code', () => {
    const schema = z.object({ postal: zodAdapter.pkPostal() });
    const result = schema.safeParse({ postal: '74000' });
    expect(result.success).toBe(true);
  });
});

// ============================================================
// Yup adapter
// ============================================================
import * as yup from 'yup';
import * as yupAdapter from '../src/adapters/yup';

describe('Yup adapter', () => {
  it('pkCnic — accepts valid CNIC', async () => {
    const schema = yup.object({ cnic: yupAdapter.pkCnic().required() });
    const result = await schema.isValid({ cnic: '35202-1234567-3' });
    expect(result).toBe(true);
  });

  it('pkCnic — rejects invalid CNIC', async () => {
    const schema = yup.object({ cnic: yupAdapter.pkCnic().required() });
    const result = await schema.isValid({ cnic: '99999' });
    expect(result).toBe(false);
  });

  it('pkCnic — allows empty when not required', async () => {
    const schema = yup.object({ cnic: yupAdapter.pkCnic() });
    const result = await schema.isValid({ cnic: undefined });
    expect(result).toBe(true);
  });

  it('pkPhone — accepts valid mobile', async () => {
    const schema = yup.object({ phone: yupAdapter.pkPhone().required() });
    const result = await schema.isValid({ phone: '03001234567' });
    expect(result).toBe(true);
  });

  it('pkNtn — accepts valid NTN', async () => {
    const schema = yup.object({ ntn: yupAdapter.pkNtn().required() });
    const result = await schema.isValid({ ntn: '1234567-8' });
    expect(result).toBe(true);
  });

  it('pkIban — accepts valid IBAN', async () => {
    const schema = yup.object({ iban: yupAdapter.pkIban().required() });
    const result = await schema.isValid({ iban: 'PK93HABB0000000017591921' });
    expect(result).toBe(true);
  });

  it('pkPostal — accepts valid postal', async () => {
    const schema = yup.object({ postal: yupAdapter.pkPostal().required() });
    const result = await schema.isValid({ postal: '74000' });
    expect(result).toBe(true);
  });
});

// ============================================================
// Joi adapter
// ============================================================
import Joi from 'joi';
import * as joiAdapter from '../src/adapters/joi';

describe('Joi adapter', () => {
  it('pkCnic — accepts valid CNIC', () => {
    const schema = Joi.object({ cnic: joiAdapter.pkCnic().required() });
    const { error } = schema.validate({ cnic: '35202-1234567-3' });
    expect(error).toBeUndefined();
  });

  it('pkCnic — rejects invalid CNIC', () => {
    const schema = Joi.object({ cnic: joiAdapter.pkCnic().required() });
    const { error } = schema.validate({ cnic: '99999' });
    expect(error).toBeDefined();
  });

  it('pkPhone — accepts valid mobile', () => {
    const schema = Joi.object({ phone: joiAdapter.pkPhone().required() });
    const { error } = schema.validate({ phone: '03001234567' });
    expect(error).toBeUndefined();
  });

  it('pkPhone — rejects landline by default', () => {
    const schema = Joi.object({ phone: joiAdapter.pkPhone().required() });
    const { error } = schema.validate({ phone: '05112345678' });
    expect(error).toBeDefined();
  });

  it('pkNtn — accepts valid NTN', () => {
    const schema = Joi.object({ ntn: joiAdapter.pkNtn().required() });
    const { error } = schema.validate({ ntn: '1234567-8' });
    expect(error).toBeUndefined();
  });

  it('pkIban — accepts valid IBAN', () => {
    const schema = Joi.object({ iban: joiAdapter.pkIban().required() });
    const { error } = schema.validate({ iban: 'PK93HABB0000000017591921' });
    expect(error).toBeUndefined();
  });

  it('pkPostal — accepts valid postal', () => {
    const schema = Joi.object({ postal: joiAdapter.pkPostal().required() });
    const { error } = schema.validate({ postal: '74000' });
    expect(error).toBeUndefined();
  });
});

// ============================================================
// Valibot adapter
// ============================================================
import * as v from 'valibot';
import * as valibotAdapter from '../src/adapters/valibot';

describe('Valibot adapter', () => {
  it('pkCnic — accepts valid CNIC', () => {
    const schema = v.object({ cnic: valibotAdapter.pkCnic() });
    const result = v.safeParse(schema, { cnic: '35202-1234567-3' });
    expect(result.success).toBe(true);
  });

  it('pkCnic — rejects invalid CNIC', () => {
    const schema = v.object({ cnic: valibotAdapter.pkCnic() });
    const result = v.safeParse(schema, { cnic: '99999' });
    expect(result.success).toBe(false);
  });

  it('pkPhone — accepts valid mobile', () => {
    const schema = v.object({ phone: valibotAdapter.pkPhone() });
    const result = v.safeParse(schema, { phone: '03001234567' });
    expect(result.success).toBe(true);
  });

  it('pkNtn — accepts valid NTN', () => {
    const schema = v.object({ ntn: valibotAdapter.pkNtn() });
    const result = v.safeParse(schema, { ntn: '1234567-8' });
    expect(result.success).toBe(true);
  });

  it('pkIban — accepts valid IBAN', () => {
    const schema = v.object({ iban: valibotAdapter.pkIban() });
    const result = v.safeParse(schema, { iban: 'PK93HABB0000000017591921' });
    expect(result.success).toBe(true);
  });

  it('pkPostal — accepts valid postal', () => {
    const schema = v.object({ postal: valibotAdapter.pkPostal() });
    const result = v.safeParse(schema, { postal: '74000' });
    expect(result.success).toBe(true);
  });
});

// ============================================================
// Superstruct adapter
// ============================================================
import { object, assert, is } from 'superstruct';
import * as superstructAdapter from '../src/adapters/superstruct';

describe('Superstruct adapter', () => {
  it('pkCnic — accepts valid CNIC', () => {
    const schema = object({ cnic: superstructAdapter.pkCnic() });
    expect(is({ cnic: '35202-1234567-3' }, schema)).toBe(true);
  });

  it('pkCnic — rejects invalid CNIC', () => {
    const schema = object({ cnic: superstructAdapter.pkCnic() });
    expect(is({ cnic: '99999' }, schema)).toBe(false);
  });

  it('pkCnic — assert throws on invalid', () => {
    const schema = object({ cnic: superstructAdapter.pkCnic() });
    expect(() => assert({ cnic: '99999' }, schema)).toThrow();
  });

  it('pkPhone — accepts valid mobile', () => {
    const schema = object({ phone: superstructAdapter.pkPhone() });
    expect(is({ phone: '03001234567' }, schema)).toBe(true);
  });

  it('pkNtn — accepts valid NTN', () => {
    const schema = object({ ntn: superstructAdapter.pkNtn() });
    expect(is({ ntn: '1234567-8' }, schema)).toBe(true);
  });

  it('pkIban — accepts valid IBAN', () => {
    const schema = object({ iban: superstructAdapter.pkIban() });
    expect(is({ iban: 'PK93HABB0000000017591921' }, schema)).toBe(true);
  });

  it('pkPostal — accepts valid postal', () => {
    const schema = object({ postal: superstructAdapter.pkPostal() });
    expect(is({ postal: '74000' }, schema)).toBe(true);
  });
});

// ============================================================
// class-validator adapter
// ============================================================
import 'reflect-metadata';
import { validate } from 'class-validator';
import {
  IsPkCnic,
  IsPkPhone,
  IsPkNtn,
  IsPkIban,
  IsPkPostal,
} from '../src/adapters/class-validator';

class TestDto {
  @IsPkCnic()
  cnic!: string;

  @IsPkPhone()
  phone!: string;

  @IsPkNtn()
  ntn!: string;

  @IsPkIban()
  iban!: string;

  @IsPkPostal()
  postal!: string;
}

describe('class-validator adapter', () => {
  it('accepts all valid fields', async () => {
    const dto = new TestDto();
    dto.cnic = '35202-1234567-3';
    dto.phone = '03001234567';
    dto.ntn = '1234567-8';
    dto.iban = 'PK93HABB0000000017591921';
    dto.postal = '74000';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid CNIC', async () => {
    const dto = new TestDto();
    dto.cnic = '99999';
    dto.phone = '03001234567';
    dto.ntn = '1234567-8';
    dto.iban = 'PK93HABB0000000017591921';
    dto.postal = '74000';

    const errors = await validate(dto);
    const cnicError = errors.find((e) => e.property === 'cnic');
    expect(cnicError).toBeDefined();
  });

  it('rejects invalid phone', async () => {
    const dto = new TestDto();
    dto.cnic = '35202-1234567-3';
    dto.phone = 'invalid';
    dto.ntn = '1234567-8';
    dto.iban = 'PK93HABB0000000017591921';
    dto.postal = '74000';

    const errors = await validate(dto);
    const phoneError = errors.find((e) => e.property === 'phone');
    expect(phoneError).toBeDefined();
  });

  it('rejects invalid IBAN', async () => {
    const dto = new TestDto();
    dto.cnic = '35202-1234567-3';
    dto.phone = '03001234567';
    dto.ntn = '1234567-8';
    dto.iban = 'GB29NWBK60161331926819';
    dto.postal = '74000';

    const errors = await validate(dto);
    const ibanError = errors.find((e) => e.property === 'iban');
    expect(ibanError).toBeDefined();
  });

  it('IsPkPhone with landline option accepts landlines', async () => {
    class LandlineDto {
      @IsPkPhone({ allowLandline: true })
      phone!: string;
    }
    const dto = new LandlineDto();
    dto.phone = '05112345678';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
