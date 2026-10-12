"use client";
import Hero from "@/components/Hero";
import { GridSkeleton, ProductGrid } from "@/components/ProductGrid";
import { useData } from "@/lib/DataContext";
import { toNum } from "@/lib/format";

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-neutral">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export default function HomePage() {
  const { products, loading } = useData();

  const risers = [...products].filter((p) => toNum(p.change) > 0).sort((a, b) => toNum(b.change) - toNum(a.change)).slice(0, 6);
  const fallers = [...products].filter((p) => toNum(p.change) < 0).sort((a, b) => toNum(a.change) - toNum(b.change)).slice(0, 6);

  return (
    <>
      <Hero />
      <div className="mx-auto max-w-6xl space-y-14 px-4 pt-12">
        <Section id="দাম-বেড়েছে" title="আজ দাম বেড়েছে ▲" subtitle="গতকালের তুলনায় যেসব পণ্যের দাম সবচেয়ে বেশি বেড়েছে">
          {loading ? <GridSkeleton count={6} /> : <ProductGrid products={risers} />}
        </Section>

        <Section id="দাম-কমেছে" title="আজ দাম কমেছে ▼" subtitle="গতকালের তুলনায় যেসব পণ্যের দাম সবচেয়ে বেশি কমেছে">
          {loading ? <GridSkeleton count={6} /> : <ProductGrid products={fallers} />}
        </Section>

        <Section id="সব-পণ্য" title="সব পণ্য" subtitle="নিত্যপ্রয়োজনীয় সব পণ্যের আজকের বাজার দর">
          {loading ? <GridSkeleton count={8} /> : <ProductGrid products={products} />}
        </Section>
      </div>
    </>
  );
}
