"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCategories, getProduct, priceSummary } from "@/lib/api";
import { fmtPrice, toNum } from "@/lib/format";
import { ChangeBadge } from "@/components/ProductCard";
import NotFoundView from "@/components/NotFoundView";

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="skeleton h-28 w-full" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => <div key={i} className="skeleton h-24" />)}
      </div>
      <div className="skeleton h-64 w-full" />
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(undefined); // undefined = loading, null = not found
  const [cats, setCats] = useState([]);

  useEffect(() => {
    let alive = true;
    setProduct(undefined);
    Promise.all([getProduct(slug), getCategories()]).then(([p, c]) => {
      if (!alive) return;
      setProduct(p);
      setCats(c);
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  if (product === undefined) return <DetailSkeleton />;
  if (product === null) return <NotFoundView message="এই পণ্যটি পাওয়া যায়নি।" />;

  const { min, max, avg } = priceSummary(product);
  const lowest = product.markets.length ? Math.min(...product.markets.map((m) => m.price)) : null;
  const catTags = product.categories.map((s) => cats.find((c) => c.slug === s) || { slug: s, name: s });

  const stats = [
    { label: "সর্বনিম্ন দাম", value: min, cls: "text-green-600" },
    { label: "সর্বোচ্চ দাম", value: max, cls: "text-red-600" },
    { label: "গড় দাম", value: avg, cls: "text-primary" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <Link href="/" className="text-sm text-primary hover:underline">← সব পণ্যে ফিরে যান</Link>

      <section className="card border border-base-300 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="text-6xl">{product.emoji}</div>
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-bold text-neutral">{product.name}</h1>
            {product.description && <p className="text-gray-600">{product.description}</p>}
            <div className="flex flex-wrap items-center gap-2">
              {catTags.map((c) => (
                <Link key={c.slug} href={`/category/${c.slug}`} className="badge badge-primary badge-outline">{c.name}</Link>
              ))}
              <span className="badge badge-ghost">{product.unit}</span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-gray-500">আজকের দাম</p>
            <p className="text-2xl font-bold text-primary">{fmtPrice(product.price)}</p>
            <ChangeBadge change={product.change} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card border border-base-300 bg-white p-5 text-center">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.cls}`}>{fmtPrice(s.value)}</p>
            <p className="text-xs text-gray-400">{product.unit}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-neutral">বাজারভিত্তিক আজকের দাম</h2>
        {product.markets.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {product.markets.map((m) => {
              const pct = max ? Math.max(8, Math.round((toNum(m.price) / max) * 100)) : 0;
              const isLowest = lowest !== null && m.price === lowest;
              return (
                <div key={m.name} className="card border border-base-300 bg-white p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">🏪 {m.name}</p>
                      {isLowest && <span className="badge badge-success badge-sm mt-1">সবচেয়ে কম দাম</span>}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{fmtPrice(m.price)}</p>
                      <ChangeBadge change={m.change} />
                    </div>
                  </div>
                  <progress className="progress progress-primary mt-3 h-2 w-full" value={pct} max="100" />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="rounded-box border border-base-300 bg-white p-6 text-center text-gray-500">
            এই পণ্যের জন্য বাজারভিত্তিক তথ্য এখনো পাওয়া যায়নি।
          </p>
        )}
      </section>
    </div>
  );
}
