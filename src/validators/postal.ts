import type { ValidationResult, ParsedPostal, Province } from '../types';

interface PostalEntry {
  city: string;
  province: Province;
}

/**
 * Pakistan postal codes — 5 digit format
 * Source: Pakistan Post
 */
const POSTAL_MAP: Record<string, PostalEntry> = {
  // Islamabad Capital Territory
  '44000': { city: 'Islamabad', province: 'Islamabad' },
  '44010': { city: 'Islamabad (F-6)', province: 'Islamabad' },
  '44020': { city: 'Islamabad (F-7)', province: 'Islamabad' },
  '44030': { city: 'Islamabad (F-8)', province: 'Islamabad' },
  '44040': { city: 'Islamabad (G-6)', province: 'Islamabad' },
  '44050': { city: 'Islamabad (G-7)', province: 'Islamabad' },
  '44060': { city: 'Islamabad (G-8)', province: 'Islamabad' },

  // Punjab
  '54000': { city: 'Lahore', province: 'Punjab' },
  '54500': { city: 'Lahore (DHA)', province: 'Punjab' },
  '54600': { city: 'Lahore (Gulberg)', province: 'Punjab' },
  '54700': { city: 'Lahore (Model Town)', province: 'Punjab' },
  '54800': { city: 'Lahore (Johar Town)', province: 'Punjab' },
  '38000': { city: 'Faisalabad', province: 'Punjab' },
  '38800': { city: 'Faisalabad (Peoples Colony)', province: 'Punjab' },
  '51000': { city: 'Rawalpindi', province: 'Punjab' },
  '46000': { city: 'Gujranwala', province: 'Punjab' },
  '50700': { city: 'Multan', province: 'Punjab' },
  '60000': { city: 'Bahawalpur', province: 'Punjab' },
  '52000': { city: 'Sialkot', province: 'Punjab' },
  '40100': { city: 'Gujrat', province: 'Punjab' },
  '55300': { city: 'Sheikhupura', province: 'Punjab' },
  '44900': { city: 'Attock', province: 'Punjab' },
  '59300': { city: 'Rahim Yar Khan', province: 'Punjab' },
  '57400': { city: 'Sargodha', province: 'Punjab' },
  '49600': { city: 'Jhang', province: 'Punjab' },
  '40000': { city: 'Hafizabad', province: 'Punjab' },
  '58000': { city: 'Sahiwal', province: 'Punjab' },
  '56000': { city: 'Kasur', province: 'Punjab' },
  '36000': { city: 'Chiniot', province: 'Punjab' },

  // Sindh
  '74000': { city: 'Karachi', province: 'Sindh' },
  '74200': { city: 'Karachi (Clifton)', province: 'Sindh' },
  '74400': { city: 'Karachi (DHA)', province: 'Sindh' },
  '74600': { city: 'Karachi (Gulshan)', province: 'Sindh' },
  '74800': { city: 'Karachi (PECHS)', province: 'Sindh' },
  '75000': { city: 'Karachi (Korangi)', province: 'Sindh' },
  '75500': { city: 'Karachi (Malir)', province: 'Sindh' },
  '76000': { city: 'Karachi (Orangi)', province: 'Sindh' },
  '76200': { city: 'Karachi (Landhi)', province: 'Sindh' },
  '71000': { city: 'Hyderabad', province: 'Sindh' },
  '68300': { city: 'Sukkur', province: 'Sindh' },
  '76400': { city: 'Larkana', province: 'Sindh' },
  '78000': { city: 'Mirpur Khas', province: 'Sindh' },
  '69000': { city: 'Nawabshah', province: 'Sindh' },

  // KPK
  '25000': { city: 'Peshawar', province: 'KPK' },
  '25120': { city: 'Peshawar (University Town)', province: 'KPK' },
  '22010': { city: 'Abbottabad', province: 'KPK' },
  '23200': { city: 'Mardan', province: 'KPK' },
  '24000': { city: 'Nowshera', province: 'KPK' },
  '22600': { city: 'Mansehra', province: 'KPK' },
  '23000': { city: 'Charsadda', province: 'KPK' },
  '26000': { city: 'Kohat', province: 'KPK' },
  '27000': { city: 'Karak', province: 'KPK' },

  // Balochistan
  '87300': { city: 'Quetta', province: 'Balochistan' },
  '87100': { city: 'Quetta (Satellite Town)', province: 'Balochistan' },
  '86300': { city: 'Turbat', province: 'Balochistan' },
  '84000': { city: 'Khuzdar', province: 'Balochistan' },
  '90000': { city: 'Gwadar', province: 'Balochistan' },
  '83600': { city: 'Chaman', province: 'Balochistan' },

  // Gilgit-Baltistan
  '15100': { city: 'Gilgit', province: 'Gilgit-Baltistan' },
  '16100': { city: 'Skardu', province: 'Gilgit-Baltistan' },

  // AJK
  '13100': { city: 'Muzaffarabad', province: 'AJK' },
  '13200': { city: 'Mirpur (AJK)', province: 'AJK' },
};

export function isValidPostal(value: string): ValidationResult<ParsedPostal> {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: 'Postal code must be a non-empty string' };
  }

  const code = value.trim();

  if (!/^\d{5}$/.test(code)) {
    return { valid: false, error: 'Pakistani postal code must be exactly 5 digits' };
  }

  const entry = POSTAL_MAP[code];
  if (!entry) {
    return {
      valid: false,
      error: `Postal code ${code} not found in Pakistan Post database`,
    };
  }

  return {
    valid: true,
    data: {
      code,
      city: entry.city,
      province: entry.province,
    },
  };
}

export function getCity(postalCode: string): string | null {
  const result = isValidPostal(postalCode);
  return result.valid && result.data ? result.data.city : null;
}

export function getProvince(postalCode: string): Province | null {
  const result = isValidPostal(postalCode);
  return result.valid && result.data ? result.data.province : null;
}

export function parsePostal(value: string): ParsedPostal {
  const result = isValidPostal(value);
  if (!result.valid || !result.data) {
    throw new Error(`Cannot parse invalid postal code: ${result.error}`);
  }
  return result.data;
}
