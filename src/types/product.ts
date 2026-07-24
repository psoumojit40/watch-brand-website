export interface Product {
  id: string;
  name: string;
  collection: string;
  slug: string;
  price: number;
  currency: string;
  description: string;
  shortDescription: string;
  images: string[];
  specifications: Specification[];
  movement: string;
  case_material: string;
  case_diameter: string;
  water_resistance: string;
  power_reserve: string;
  features: string[];
  isNew: boolean;
  isLimited: boolean;
  limitedEdition?: number;
}

export interface Specification {
  label: string;
  value: string;
}
