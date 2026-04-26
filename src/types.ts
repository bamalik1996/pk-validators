export type Province =
  | 'KPK'
  | 'FATA'
  | 'Punjab'
  | 'Sindh'
  | 'Balochistan'
  | 'Islamabad'
  | 'Gilgit-Baltistan'
  | 'AJK';

export type PhoneCarrier =
  | 'Jazz'
  | 'Telenor'
  | 'Ufone'
  | 'Zong'
  | 'Warid'
  | 'SCO'
  | 'Unknown';

export type PhoneType = 'mobile' | 'landline';

export interface ValidationResult<T = undefined> {
  valid: boolean;
  error?: string;
  data?: T;
}

export interface ParsedCnic {
  province: Province;
  districtCode: string;
  registrationNumber: string;
  gender: 'male' | 'female';
  raw: string;
  formatted: string;
}

export interface ParsedPhone {
  carrier: PhoneCarrier;
  type: PhoneType;
  local: string;
  e164: string;
  digits: string;
}

export interface ParsedNtn {
  ntn: string;
  formatted: string;
  raw: string;
}

export interface ParsedIban {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  formatted: string;
  raw: string;
}

export interface ParsedPostal {
  code: string;
  city: string;
  province: Province;
}
