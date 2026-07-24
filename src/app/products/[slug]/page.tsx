import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { Product360Viewer } from "@/components/product/Product360Viewer";
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
    { label: "Case", value: product.case_material },
    { label: "Diameter", value: product.case_diameter },
    { label: "Water Resistance", value: product.water_resistance },
    { label: "Power Reserve", value: product.power_reserve },
  ];

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <FadeInSection direction="left">
            <div className="space-y-8">
              <Product360Viewer className="rounded-sm" />
              {/* Specs sit right under the watch, Amazon-style, for easy reading */}
              <ProductSpecs product={product} />

              {/* Feature tags, directly beneath the specifications */}
              <div className="flex flex-wrap gap-2 px-6">
                {product.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-white/10 px-3 py-1 text-[10px] tracking-wider uppercase text-cream/50"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

          </FadeInSection>


          <FadeInSection direction="right" delay={0.15}>
            <div className="space-y-8 lg:pl-6">
              <div>
                <p className="mb-3 text-xs font-medium tracking-[0.3em] uppercase text-gold">
                  {product.collection}
                </p>
                <h1 className="text-4xl font-light leading-tight text-cream md:text-6xl">
                  {product.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {product.isNew && (
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] font-medium tracking-[0.2em] uppercase text-gold">
                    New
                  </span>
                )}
                {product.isLimited && (
                  <span className="rounded-full border border-gold/40 px-3 py-1 text-[10px] font-medium tracking-[0.2em] uppercase text-gold/80">
                    Limited{product.limitedEdition ? ` · ${product.limitedEdition} pieces` : ""}
                  </span>
                )}
              </div>

              <p className="max-w-md text-sm leading-relaxed text-cream/60">
                {product.shortDescription}
              </p>

              <div className="grid grid-cols-2 gap-x-8 gap-y-5 border-t border-white/5 pt-8">
                {highlights.map((item) => (
                  <div key={item.label}>
                    <p className="mb-1 text-[10px] tracking-[0.2em] uppercase text-cream/40">
                      {item.label}
                    </p>
                    <p className="text-sm text-cream/80">{item.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-3xl font-light text-gold">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Book an appointment */}
              <Link href={`/products/${product.slug}/appointment`}>
                <Button variant="primary" size="md">
                  Book an Appointment
                </Button>
              </Link>


            </div>
          </FadeInSection>
        </div>
      </div>
    </div>


  );

}
