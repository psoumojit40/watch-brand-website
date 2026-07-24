import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "royal-oak-jumbo",
    name: "Royal Oak Jumbo Extra-Thin",
    collection: "Royal Oak",
    slug: "royal-oak-jumbo",
    price: 3657500,
    currency: "INR",

    description:
      "The Royal Oak Jumbo Extra-Thin in platinum. A masterpiece of ultra-thin watchmaking, housing the ultra-thin Calibre 7121 movement. The 39mm case with the iconic 'Tapisserie' dial pattern defines timeless elegance.",
    shortDescription:
      "Ultra-thin platinum icon with Calibre 7121 movement and signature Tapisserie dial.",
    images: [
      "/images/products/ro-jumbo-1.jpg",
      "/images/products/ro-jumbo-2.jpg",
      "/images/products/ro-jumbo-3.jpg",
    ],
    specifications: [
      { label: "Reference", value: "16202PT.OO.1240PT.01" },
      { label: "Case", value: "Platinum, 39mm" },
      { label: "Thickness", value: "8.1mm" },
      { label: "Dial", value: "Bleu Nuit, Tapisserie pattern" },
    ],
    movement: "Calibre 7121 (Automatic, Extra-Thin)",
    case_material: "Platinum 950",
    case_diameter: "39mm",
    water_resistance: "50m",
    power_reserve: "55 hours",
    features: ["Ultra-thin", "Platinum case", "Tapisserie dial", "Integrated bracelet"],
    isNew: true,
    isLimited: false,
  },
  {
    id: "royal-oak-chronograph",
    name: "Royal Oak Chronograph",
    collection: "Royal Oak",
    slug: "royal-oak-chronograph",
    price: 2802500,
    currency: "INR",

    description:
      "The Royal Oak Chronograph in stainless steel combines the iconic octagonal design with a high-performance column-wheel chronograph movement. A sporty yet refined companion for everyday elegance.",
    shortDescription:
      "Stainless steel chronograph with column-wheel Calibre 4401 movement.",
    images: [
      "/images/products/ro-chrono-1.jpg",
      "/images/products/ro-chrono-2.jpg",
    ],
    specifications: [
      { label: "Reference", value: "26240ST.OO.1320ST.01" },
      { label: "Case", value: "Stainless Steel, 41mm" },
      { label: "Thickness", value: "12.4mm" },
      { label: "Dial", value: "Blue Tapisserie with counters" },
    ],
    movement: "Calibre 4401 (Automatic, Column-wheel Chronograph)",
    case_material: "Stainless Steel",
    case_diameter: "41mm",
    water_resistance: "50m",
    power_reserve: "70 hours",
    features: ["Chronograph", "Column-wheel", "Flyback function", "Sapphire caseback"],
    isNew: false,
    isLimited: false,
  },
  {
    id: "royal-oak-perpetual",
    name: "Royal Oak Perpetual Calendar",
    collection: "Royal Oak",
    slug: "royal-oak-perpetual",
    price: 8502500,
    currency: "INR",

    description:
      "The Royal Oak Perpetual Calendar in white gold. A grand complication that displays day, date, month, moon phase, and leap year in perfect harmony. A testament to Audemars Piguet's mastery of complications.",
    shortDescription:
      "White gold grand complication with perpetual calendar and moon phase.",
    images: [
      "/images/products/ro-perpetual-1.jpg",
      "/images/products/ro-perpetual-2.jpg",
    ],
    specifications: [
      { label: "Reference", value: "26574WG.OO.1220WG.01" },
      { label: "Case", value: "White Gold, 41mm" },
      { label: "Thickness", value: "9.5mm" },
      { label: "Dial", value: "Silvered, Perpetual Calendar" },
    ],
    movement: "Calibre 5134 (Automatic, Perpetual Calendar)",
    case_material: "White Gold 750",
    case_diameter: "41mm",
    water_resistance: "20m",
    power_reserve: "40 hours",
    features: ["Perpetual calendar", "Moon phase", "Leap year indicator", "Weekday/week/month"],
    isNew: false,
    isLimited: true,
    limitedEdition: 100,
  },
  {
    id: "offshore-diver",
    name: "Royal Oak Offshore Diver",
    collection: "Royal Oak Offshore",
    slug: "offshore-diver",
    price: 2327500,
    currency: "INR",

    description:
      "The Royal Oak Offshore Diver in stainless steel. A robust diving instrument with internal rotating bezel, 300m water resistance, and the unmistakable Offshore attitude. Adventure-ready luxury.",
    shortDescription:
      "Professional diver with 300m water resistance, internal bezel, and Offshore DNA.",
    images: [
      "/images/products/offshore-diver-1.jpg",
      "/images/products/offshore-diver-2.jpg",
    ],
    specifications: [
      { label: "Reference", value: "15707ST.OO.A077CA.01" },
      { label: "Case", value: "Stainless Steel, 42mm" },
      { label: "Thickness", value: "14.1mm" },
      { label: "Dial", value: "Méga Tapisserie, Black" },
    ],
    movement: "Calibre 4308 (Automatic, Diver)",
    case_material: "Stainless Steel",
    case_diameter: "42mm",
    water_resistance: "300m",
    power_reserve: "60 hours",
    features: ["Diver certified", "Internal rotating bezel", "Screw-down crown", "Rubber strap"],
    isNew: false,
    isLimited: false,
  },
  {
    id: "offshore-chrono",
    name: "Royal Oak Offshore Chronograph",
    collection: "Royal Oak Offshore",
    slug: "offshore-chrono",
    price: 3087500,
    currency: "INR",

    description:
      "The Royal Oak Offshore Chronograph in forged carbon. Ultra-lightweight, incredibly bold, and unmistakably modern. The fusion of high-tech materials with traditional watchmaking creates a true contemporary icon.",
    shortDescription:
      "Forged carbon chronograph — the boldest expression of Offshore design.",
    images: [
      "/images/products/offshore-chrono-1.jpg",
      "/images/products/offshore-chrono-2.jpg",
    ],
    specifications: [
      { label: "Reference", value: "26221CE.OO.A002CA.01" },
      { label: "Case", value: "Forged Carbon, 44mm" },
      { label: "Thickness", value: "15.1mm" },
      { label: "Dial", value: "Méga Tapisserie, Grey" },
    ],
    movement: "Calibre 4404 (Automatic, Flyback Chronograph)",
    case_material: "Forged Carbon",
    case_diameter: "44mm",
    water_resistance: "100m",
    power_reserve: "70 hours",
    features: ["Flyback chronograph", "Forged carbon case", "Ceramic pushers", "Rubber strap"],
    isNew: true,
    isLimited: false,
  },
  {
    id: "code-1159-selfwinding",
    name: "Code 11.59 Selfwinding",
    collection: "Code 11.59",
    slug: "code-1159-selfwinding",
    price: 2707500,
    currency: "INR",

    description:
      "The Code 11.59 Selfwinding in 18k pink gold. A revolutionary case architecture with a double-curved sapphire crystal and openworked dial reveals the intricate Calibre 4302 movement. Modern elegance redefined.",
    shortDescription:
      "Pink gold selfwinding with double-curved crystal and openworked dial.",
    images: [
      "/images/products/code-1159-1.jpg",
      "/images/products/code-1159-2.jpg",
    ],
    specifications: [
      { label: "Reference", value: "15210OR.OO.A348CR.01" },
      { label: "Case", value: "Pink Gold 18k, 41mm" },
      { label: "Thickness", value: "10.7mm" },
      { label: "Dial", value: "Openworked, Pink Gold" },
    ],
    movement: "Calibre 4302 (Automatic)",
    case_material: "Pink Gold 18k",
    case_diameter: "41mm",
    water_resistance: "30m",
    power_reserve: "70 hours",
    features: ["Openworked dial", "Double-curved crystal", "Skeletonized rotor", "Alligator strap"],
    isNew: false,
    isLimited: false,
  },
  {
    id: "code-1159-skeleton",
    name: "Code 11.59 Skeleton",
    collection: "Code 11.59",
    slug: "code-1159-skeleton",
    price: 6507500,
    currency: "INR",

    description:
      "The Code 11.59 Skeleton in platinum. A breathtaking display of architectural skeletonization. The Calibre 4303 movement is meticulously hollowed and decorated, revealing every gear, spring, and bridge through the sapphire crystal.",
    shortDescription:
      "Platinum skeleton with fully openworked Calibre 4303 movement.",
    images: [
      "/images/products/code-1159-skeleton-1.jpg",
      "/images/products/code-1159-skeleton-2.jpg",
    ],
    specifications: [
      { label: "Reference", value: "15210PT.OO.1240PT.01" },
      { label: "Case", value: "Platinum 950, 41mm" },
      { label: "Thickness", value: "10.7mm" },
      { label: "Dial", value: "Sapphire, Skeleton" },
    ],
    movement: "Calibre 4303 (Automatic, Skeleton)",
    case_material: "Platinum 950",
    case_diameter: "41mm",
    water_resistance: "30m",
    power_reserve: "70 hours",
    features: ["Full skeleton", "Sapphire dial", "Platinum case", "Hand-finished anglage"],
    isNew: true,
    isLimited: true,
    limitedEdition: 50,
  },
];
