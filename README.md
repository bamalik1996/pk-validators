# pk-validators

> **Pakistan Data Validation & Formatting SDK** — CNIC, NTN, IBAN, phone, passport, and postal codes.

[![npm version](https://img.shields.io/npm/v/pk-validators)](https://www.npmjs.com/package/pk-validators)
[![CI](https://github.com/bamalik1996/pk-validators/actions/workflows/ci.yml/badge.svg)](https://github.com/bamalik1996/pk-validators/actions/workflows/ci.yml)
[![bundle size](https://img.shields.io/bundlephobia/minzip/pk-validators)](https://bundlephobia.com/package/pk-validators)
[![license](https://img.shields.io/npm/l/pk-validators)](./LICENSE)

Zero dependencies. Tree-shakeable. TypeScript-first. Built-in **data intelligence** (province, carrier, bank detection). Adapters for **Zod**, **Yup**, **Joi**, **Valibot**, **Superstruct**, and **class-validator**.

---

## Installation

```bash
npm install pk-validators
```

---

## Validators

### CNIC

```ts
import { isValidCnic, parseCnic, formatCnic } from "pk-validators";

// Basic validation
isValidCnic("35202-1234567-3");
// { valid: true, data: { province: 'Punjab', gender: 'male', ... } }

isValidCnic("95202-1234567-3");
// { valid: false, error: 'Invalid province code: 9. Valid codes are 1–8' }

// Parse — throws if invalid
const cnic = parseCnic("35202-1234567-3");
cnic.province; // 'Punjab'
cnic.gender; // 'male'
cnic.districtCode; // '35202'
cnic.registrationNumber; // '1234567'
cnic.formatted; // '35202-1234567-3'

// Format raw digits
formatCnic("3520212345673"); // '35202-1234567-3'
```

Accepts both `35202-1234567-3` (formatted) and `3520212345673` (raw digits).  
Province is decoded from the first digit. Gender is decoded from the last digit.

| Code | Province         |
| ---- | ---------------- |
| 1    | KPK              |
| 2    | FATA             |
| 3    | Punjab           |
| 4    | Sindh            |
| 5    | Balochistan      |
| 6    | Islamabad        |
| 7    | Gilgit-Baltistan |
| 8    | AJK              |

---

### Phone

```ts
import { isValidPhone, parsePhone, formatPhone } from "pk-validators";

isValidPhone("03001234567");
// { valid: true, data: { carrier: 'Jazz', type: 'mobile', local: '0300-1234567', e164: '+923001234567' } }

// Also accepts:
isValidPhone("+923001234567"); // +92 prefix
isValidPhone("00923001234567"); // 0092 prefix
isValidPhone("0300-123-4567"); // dashes

// Landlines are rejected by default
isValidPhone("05112345678");
// { valid: false, error: 'Landline numbers are not validated by default...' }

// Enable landlines explicitly
isValidPhone("05112345678", { allowLandline: true });
// { valid: true, data: { type: 'landline', ... } }

// Format
formatPhone("03001234567", "e164"); // '+923001234567'
formatPhone("03001234567", "local"); // '0300-1234567'
```

Carrier detection supports Jazz, Zong, Telenor, Ufone, Warid, and SCO.

---

### NTN

```ts
import { isValidNtn, formatNtn } from "pk-validators";

isValidNtn("1234567-8"); // { valid: true }
isValidNtn("1234567"); // { valid: true } — 7-digit legacy format

formatNtn("12345678"); // '1234567-8'
```

---

### IBAN

```ts
import { isValidIban, parseIban, getBankName } from "pk-validators";

isValidIban("PK36MEZN0001010123456702");
// { valid: true, data: { bankCode: 'MEZN', bankName: 'Meezan Bank', ... } }

isValidIban("GB29NWBK60161331926819");
// { valid: false, error: 'Pakistani IBANs must start with "PK"' }

// Get formatted IBAN
const iban = parseIban("PK36MEZN0001010123456702");
iban.formatted; // 'PK36 MEZN 0001 0101 2345 6702'
iban.bankName; // 'Meezan Bank'

// Quick bank lookup
getBankName("MEZN"); // 'Meezan Bank'
getBankName("HABB"); // 'Habib Bank Limited (HBL)'
getBankName("XXXX"); // null
```

Validates using ISO 13616 mod-97 checksum algorithm.

---

### Postal codes

```ts
import {
  isValidPostal,
  getCity,
  getProvince,
  parsePostal,
} from "pk-validators";

isValidPostal("74000");
// { valid: true, data: { code: '74000', city: 'Karachi', province: 'Sindh' } }

getCity("74000"); // 'Karachi'
getProvince("74000"); // 'Sindh'

getCity("99999"); // null  (unknown code)
```

---

### Passport

```ts
import { isValidPassport, parsePassport } from "pk-validators";

isValidPassport("AB1234567");
// { valid: true, data: { number: 'AB1234567', series: 'AB', serial: '1234567', type: 'ordinary' } }

isValidPassport("DA1234567");
// { valid: true, data: { type: 'diplomatic' } }

isValidPassport("SA1234567");
// { valid: true, data: { type: 'official' } }

// Parse — throws if invalid
const passport = parsePassport("AB1234567");
passport.series; // 'AB'
passport.serial; // '1234567'
passport.type; // 'ordinary'
```

Format: 2 uppercase letters + 7 digits (e.g. `AB1234567`). Detects passport type from series prefix.

---

## Zod adapter

```ts
import { pkCnic, pkPhone, pkNtn, pkIban, pkPostal } from "pk-validators/zod";
import { z } from "zod";

const kycSchema = z.object({
  fullName: z.string().min(3),
  cnic: pkCnic(),
  phone: pkPhone(), // mobile only by default
  ntn: pkNtn().optional(),
  iban: pkIban().optional(),
  postal: pkPostal(),
});

// Validation error messages come directly from pk-validators:
// "CNIC must be 13 digits (got 12)"
// "Invalid province code: 9. Valid codes are 1–8"
```

---

## Yup adapter

```ts
import { pkCnic, pkPhone } from "pk-validators/yup";
import * as yup from "yup";

const schema = yup.object({
  cnic: pkCnic().required(),
  phone: pkPhone({ allowLandline: false }).required(),
});
```

---

## Joi adapter

```ts
import { pkCnic, pkPhone, pkNtn, pkIban, pkPostal } from 'pk-validators/joi';
import Joi from 'joi';

const schema = Joi.object({
  cnic:  pkCnic().required(),
  phone: pkPhone().required(),
  ntn:   pkNtn().optional(),
  iban:  pkIban().optional(),
  postal: pkPostal().required(),
});

const { error, value } = schema.validate({ cnic: '35202-1234567-3', ... });
```

---

## Valibot adapter

```ts
import {
  pkCnic,
  pkPhone,
  pkNtn,
  pkIban,
  pkPostal,
} from "pk-validators/valibot";
import * as v from "valibot";

const schema = v.object({
  cnic: pkCnic(),
  phone: pkPhone(),
  ntn: v.optional(pkNtn()),
  iban: v.optional(pkIban()),
  postal: pkPostal(),
});

const result = v.safeParse(schema, data);
```

---

## Superstruct adapter

```ts
import {
  pkCnic,
  pkPhone,
  pkNtn,
  pkIban,
  pkPostal,
} from "pk-validators/superstruct";
import { object, assert, is } from "superstruct";

const KycSchema = object({
  cnic: pkCnic(),
  phone: pkPhone(),
  ntn: pkNtn(),
  iban: pkIban(),
  postal: pkPostal(),
});

// Throws on invalid
assert(data, KycSchema);

// Boolean check
is(data, KycSchema); // true | false
```

---

## class-validator adapter (NestJS)

```ts
import {
  IsPkCnic,
  IsPkPhone,
  IsPkNtn,
  IsPkIban,
  IsPkPostal,
} from "pk-validators/class-validator";
import { IsNotEmpty } from "class-validator";

class KycDto {
  @IsNotEmpty()
  @IsPkCnic()
  cnic: string;

  @IsPkPhone() // mobile only
  phone: string;

  @IsPkPhone({ allowLandline: true }) // with landline
  landline: string;

  @IsPkNtn()
  ntn: string;

  @IsPkIban()
  iban: string;

  @IsPkPostal()
  postal: string;
}
```

> **Note:** Requires `reflect-metadata` imported at your app entry point.

---

## ValidationResult shape

Every `isValid*` function returns:

```ts
interface ValidationResult<T> {
  valid: boolean;
  error?: string; // only present when valid === false
  data?: T; // only present when valid === true
}
```

The `parse*` and `format*` helpers throw an `Error` on invalid input — useful when you've already validated upstream.

---

## Tree-shaking

Each validator lives in its own file. If you only import `isValidCnic`, only CNIC code is bundled:

```ts
import { isValidCnic } from "pk-validators"; // ~0.5 KB
```

---

## Usage with React (Hook Form + Zod)

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { pkCnic, pkPhone } from "pk-validators/zod";

const schema = z.object({
  cnic: pkCnic(),
  phone: pkPhone(),
});

function KycForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register("cnic")} placeholder="42101-1234567-9" />
      {errors.cnic && <span>{errors.cnic.message}</span>}

      <input {...register("phone")} placeholder="03001234567" />
      {errors.phone && <span>{errors.phone.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Usage with NestJS (class-validator)

```ts
import {
  IsPkCnic,
  IsPkPhone,
  IsPkNtn,
  IsPkIban,
  IsPkPassport,
} from "pk-validators/class-validator";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsPkCnic({ message: "Please enter a valid 13-digit CNIC" })
  cnic: string;

  @IsNotEmpty()
  @IsPkPhone()
  phone: string;

  @IsOptional()
  @IsPkNtn()
  ntn?: string;

  @IsOptional()
  @IsPkIban()
  iban?: string;

  @IsOptional()
  @IsPkPassport()
  passport?: string;
}
```

Use with `ValidationPipe` in your controller — errors are returned automatically.

---

## License

MIT
