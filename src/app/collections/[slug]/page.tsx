import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StaggerGrid } from "@/components/animations/StaggerGrid";
import { ProductCard } from "@/components/product/ProductCard";
import { collections } from "@/data/collections";
import { products } from "@/data/products";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return { title: "Not Found" };

  return {
    title: `${collection.name} | Audemars Piguet`,
    description: collection.description,
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();

  const collectionProducts = products.filter((p) =>
    collection.products.includes(p.id)
  );

  return (
    <div className="pt-24">
      <section className="relative overflow-hidden py-32 bg-black">
        {collection.heroImage && (
          <Image
            src={collection.heroImage}
            alt={collection.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
        
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <FadeInSection>
            <p className="mb-4 text-xs font-medium tracking-[0.3em] uppercase text-gold">
              Since {collection.yearIntroduced}
            </p>
            <h1 className="mb-6 text-5xl font-light text-cream md:text-7xl">
              {collection.name}
            </h1>
            <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-cream/70">
              {collection.description}
            </p>
            <p className="text-sm italic text-gold/80">&ldquo;{collection.tagline}&rdquo;</p>
          </FadeInSection>
        </div>
      </section>

      <section className="bg-black py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle title="Timepieces" subtitle={`${collectionProducts.length} models`} />
          <StaggerGrid className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {collectionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </StaggerGrid>
        </div>
      </section>
    </div>
  );
}
