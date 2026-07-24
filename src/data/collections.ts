import { Collection } from "@/types/collection";

export const collections: Collection[] = [
  {
    id: "royal-oak",
    name: "Royal Oak",
    slug: "royal-oak",
    tagline: "The Icon That Defied Convention",
    description:
      "Launched in 1972, the Royal Oak was the world's first luxury sports watch in steel. Its iconic octagonal bezel, integrated bracelet, and 'Tapisserie' dial challenged every horological convention and created an entirely new category.",
    heroImage: "/images/collections/royal-oak-hero.jpg",
    backgroundColor: "#1c180f",
    accentColor: "#c9a96e",

    yearIntroduced: 1972,
    products: ["royal-oak-jumbo", "royal-oak-chronograph", "royal-oak-perpetual"],
  },
  {
    id: "royal-oak-offshore",
    name: "Royal Oak Offshore",
    slug: "royal-oak-offshore",
    tagline: "Bold. Brutal. Unapologetic.",
    description:
      "Born in 1993, the Royal Oak Offshore pushed the boundaries of design with its larger case, exposed pushers, and rubber strap. A favorite of athletes and adventurers who demand performance without compromise.",
    heroImage: "/images/collections/offshore-hero.jpg",
    backgroundColor: "#1a1a2e",
    accentColor: "#4a7c59",
    yearIntroduced: 1993,
    products: ["offshore-diver", "offshore-chrono"],
  },
  {
    id: "code-1159",
    name: "Code 11.59",
    slug: "code-1159",
    tagline: "A New Architecture of Time",
    description:
      "The Code 11.59 collection represents a bold new design language with its complex multi-layered case, curved sapphire crystal, and skeletonized movements. A contemporary masterpiece for the modern connoisseur.",
    heroImage: "/images/collections/code-1159-hero.jpg",
    backgroundColor: "#1a1a1a",
    accentColor: "#d4a853",
    yearIntroduced: 2019,
    products: ["code-1159-selfwinding", "code-1159-skeleton"],
  },
];
