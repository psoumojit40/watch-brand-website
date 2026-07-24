const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing records
  await prisma.specification.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.timelineEvent.deleteMany();

  // 1. Create Collections
  await prisma.collection.createMany({
    data: [
      {
        name: "Royal Oak",
        slug: "royal-oak",
        tagline: "The Icon That Defied Convention",
        description:
          "Launched in 1972, the Royal Oak was the world's first luxury sports watch in steel. Its iconic octagonal bezel, integrated bracelet, and Tapisserie dial challenged every horological convention.",
        yearIntroduced: 1972,
        backgroundColor: "#0a0a0a",
        accentColor: "#c9a96e",
      },
      {
        name: "Royal Oak Offshore",
        slug: "royal-oak-offshore",
        tagline: "Bold. Brutal. Unapologetic.",
        description:
          "Born in 1993, the Royal Oak Offshore pushed the boundaries of design with its larger case, exposed pushers, and rubber strap.",
        yearIntroduced: 1993,
        backgroundColor: "#1a1a2e",
        accentColor: "#4a7c59",
      },
      {
        name: "Code 11.59",
        slug: "code-1159",
        tagline: "A New Architecture of Time",
        description:
          "The Code 11.59 collection represents a bold new design language with its complex multi-layered case and curved sapphire crystal.",
        yearIntroduced: 2019,
        backgroundColor: "#1a1a1a",
        accentColor: "#d4a853",
      },
    ],
  });

  // 2. Create Products
  await prisma.product.create({
    data: {
      name: "Royal Oak Jumbo Extra-Thin",
      slug: "royal-oak-jumbo",
      collection: "Royal Oak",
      price: 38500,
      currency: "CHF",
      description: "The Royal Oak Jumbo Extra-Thin in platinum. A masterpiece of ultra-thin watchmaking.",
      shortDescription: "Ultra-thin luxury sports watch in platinum.",
      images: ["/images/products/royal-oak-jumbo.webp"],
      movement: "Calibre 7121 (Automatic, Extra-Thin)",
      caseMaterial: "Platinum 950",
      caseDiameter: "39mm",
      waterResistance: "50m",
      powerReserve: "55 hours",
      features: ["Ultra-thin", "Platinum case", "Tapisserie dial", "Integrated bracelet"],
      isNew: true,
      isLimited: false,
    },
  });

  await prisma.product.create({
    data: {
      name: "Royal Oak Chronograph",
      slug: "royal-oak-chronograph",
      collection: "Royal Oak",
      price: 29500,
      currency: "CHF",
      description: "Stainless steel chronograph with column-wheel Calibre 4401 movement.",
      shortDescription: "Selfwinding Chronograph with integrated movement.",
      images: ["/images/products/royal-oak-chronograph.webp"],
      movement: "Calibre 4401 (Automatic, Column-wheel Chronograph)",
      caseMaterial: "Stainless Steel",
      caseDiameter: "41mm",
      waterResistance: "50m",
      powerReserve: "70 hours",
      features: ["Chronograph", "Column-wheel", "Flyback function", "Sapphire caseback"],
      isNew: false,
      isLimited: false,
    },
  });

  await prisma.product.create({
    data: {
      name: "Royal Oak Offshore Diver",
      slug: "offshore-diver",
      collection: "Royal Oak Offshore",
      price: 24500,
      currency: "CHF",
      description: "Professional diver with 300m water resistance and Offshore DNA.",
      shortDescription: "High-performance diving watch in stainless steel.",
      images: ["/images/products/offshore-diver.webp"],
      movement: "Calibre 4308 (Automatic, Diver)",
      caseMaterial: "Stainless Steel",
      caseDiameter: "42mm",
      waterResistance: "300m",
      powerReserve: "60 hours",
      features: ["Diver certified", "Internal rotating bezel", "Rubber strap"],
      isNew: false,
      isLimited: false,
    },
  });

  await prisma.product.create({
    data: {
      name: "Code 11.59 Selfwinding",
      slug: "code-1159-selfwinding",
      collection: "Code 11.59",
      price: 28500,
      currency: "CHF",
      description: "Pink gold selfwinding with double-curved crystal and openworked dial.",
      shortDescription: "Architectural 18k pink gold timepiece.",
      images: ["/images/products/code-1159.webp"],
      movement: "Calibre 4302 (Automatic)",
      caseMaterial: "Pink Gold 18k",
      caseDiameter: "41mm",
      waterResistance: "30m",
      powerReserve: "70 hours",
      features: ["Openworked dial", "Double-curved crystal", "Alligator strap"],
      isNew: false,
      isLimited: false,
    },
  });

  // 3. Create Timeline Events
  await prisma.timelineEvent.createMany({
    data: [
      {
        year: 1875,
        title: "The Founding",
        description: "Jules Louis Audemars and Edward Auguste Piguet establish their workshop in Le Brassus.",
        category: "founding",
      },
      {
        year: 1889,
        title: "First Grande Complication",
        description: "First grande complication pocket watch with minute repeater, perpetual calendar, and chronograph.",
        category: "milestone",
      },
      {
        year: 1972,
        title: "Royal Oak Launched",
        description: "The world's first luxury sports watch in steel is unveiled at Basel Fair.",
        category: "icon",
      },
      {
        year: 2019,
        title: "Code 11.59 Collection",
        description: "A completely new design language debuts with the Code 11.59 collection.",
        category: "icon",
      },
    ],
  });

  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
