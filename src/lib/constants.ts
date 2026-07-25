export const BRAND = {
  name: "Audemars Piguet",
  tagline: "Master of Complications Since 1875",
  description:
    "Swiss luxury watch manufacturer founded in 1875 in Le Brassus, Switzerland. Renowned for crafting some of the world's most exquisite timepieces, including the iconic Royal Oak.",
  founded: 1875,
  founder: "Jules Louis Audemars & Edward Auguste Piguet",
  headquarters: "Le Brassus, Switzerland",
} as const;

export const COLORS = {
  black: "#0a0a0a",
  darkNavy: "#1a1a2e",
  gold: "#c9a96e",
  olive: "#4a7c59",
  cream: "#f5f0e8",
  darkGray: "#1e1e1e",
  mediumGray: "#2a2a2a",
  lightGray: "#3a3a3a",
} as const;

export const ROUTES = {
  home: "/",
  collections: "/collections",
  products: "/products",
  heritage: "/heritage",
  timeline: "/heritage/timeline",
  contact: "/#contact",
} as const;

export const HOME_SECTIONS = [
  { id: "home", href: "/#home", label: "HOME" },
  { id: "collections", href: "/#collections", label: "COLLECTIONS" },
  { id: "new-arrivals", href: "/#new-arrivals", label: "NEW ARRIVALS" },
  { id: "timeline", href: "/#timeline", label: "TIMELINE" },
  { id: "contact", href: "/#contact", label: "CONTACT" },
] as const;


