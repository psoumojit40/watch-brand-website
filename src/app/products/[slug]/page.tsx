import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { ProductMediaViewer } from "@/components/product/ProductMediaViewer";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { Button } from "@/components/ui/Button";
import { products } from "@/data/products";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: "Not Found" };

  return {
    title: `${product.name} | Audemars Piguet`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const highlights = [
    { label: "Movement", value: product.movement },
    { label: "Case Material", value: product.case_material },
    { label: "Case Diameter", value: product.case_diameter },
    { label: "Water Resistance", value: product.water_resistance },
    { label: "Power Reserve", value: product.power_reserve },
  ];

  return (
    <div className="pt-24 min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Left Column: Interactive Media & Specs */}
          <FadeInSection direction="left">
            <div className="space-y-8">
              <ProductMediaViewer product={product} />

              {/* Specifications Table */}
              <ProductSpecs product={product} />

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {product.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1 text-[10px] tracking-widest uppercase text-cream/60"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </FadeInSection>

          {/* Right Column: Title, Overview, Price & Appointment */}
          <FadeInSection direction="right" delay={0.15}>
            <div className="space-y-8 lg:pl-6">
              <div>
                <p className="mb-3 text-xs font-medium tracking-[0.3em] uppercase text-gold">
                  {product.collection}
                </p>
                <h1 className="text-4xl font-light leading-tight text-cream md:text-5xl lg:text-6xl">
                  {product.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {product.isNew && (
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] font-medium tracking-[0.2em] uppercase text-gold border border-gold/30">
                    New Release
                  </span>
                )}
                {product.isLimited && (
                  <span className="rounded-full border border-gold/40 px-3 py-1 text-[10px] font-medium tracking-[0.2em] uppercase text-gold/80">
                    Limited Edition{product.limitedEdition ? ` · ${product.limitedEdition} pieces` : ""}
                  </span>
                )}
              </div>

              <p className="text-sm leading-relaxed text-cream/70 max-w-lg">
                {product.description}
              </p>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-5 border-y border-white/10 py-8">
                {highlights.map((item) => (
                  <div key={item.label}>
                    <p className="mb-1 text-[10px] tracking-[0.2em] uppercase text-cream/40">
                      {item.label}
                    </p>
                    <p className="text-sm text-cream/90 font-medium">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Pricing & Appointment CTA */}
              <div className="space-y-4 pt-2">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-cream/40 mb-1">
                    Price (Incl. Taxes)
                  </span>
                  <p className="text-3xl font-light text-gold">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link href={`/products/${product.slug}/appointment`}>
                    <Button variant="primary" size="lg">
                      Book a Private Appointment
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </div>
  );
}
