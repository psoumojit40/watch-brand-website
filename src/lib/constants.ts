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

// Homepage in-page sections used for the navbar scroll-spy. `id` is the
// element id on the section, `href` is the anchor the nav link points to.
export const HOME_SECTIONS = [
  { id: "home", href: "/#home", label: "Home" },
  { id: "collections", href: "/#collections", label: "Collections" },
  { id: "new-arrivals", href: "/#new-arrivals", label: "New Arrivals" },
  { id: "timeline", href: "/#timeline", label: "Timeline" },
  { id: "contact", href: "/#contact", label: "Contact" },
] as const;


