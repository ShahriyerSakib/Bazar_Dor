"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getCategories, getProducts } from "@/lib/api";
import { toNum } from "@/lib/format";
import { GridSkeleton, ProductGrid } from "@/components/ProductGrid";
import NotFoundView from "@/components/NotFoundView";

const SORTS = [
  { value: "default", label: "ডিফল্ট" },
  { value: "asc", label: "দাম: কম থেকে বেশি" },
  { value: "desc", label: "দাম: বেশি থেকে কম" },
];

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("default");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([getProducts(slug), getCategories()]).then(([prods, cats]) => {
      if (!alive) return;
      setProducts(prods);
      setCategory(cats.find((c) => c.slug === slug) || null);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === "asc") list.sort((a, b) => toNum(a.price) - toNum(b.price));
    if (sort === "desc") list.sort((a, b) => toNum(b.price) - toNum(a.price));
    return list;
  }, [products, sort]);

  if (!loading && !products.length && !category) {
    return <NotFoundView message="এই ক্যাটেগরিটি পাওয়া যায়নি।" />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-neutral">
          {loading ? <div className="skeleton h-9 w-40" /> : (
            <>
              <span>{category?.icon || "🛒"}</span>
              <span>{category?.name || slug}</span>
            </>
          )}
        </h1>

        <label className="flex items-center gap-2 text-sm">
          <span className="font-medium">সাজান:</span>
          <select
            className="select select-bordered select-sm bg-white sm:select-md"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <GridSkeleton count={8} />
      ) : sorted.length ? (
        <ProductGrid products={sorted} />
      ) : (
        <NotFoundView message="এই ক্যাটেগরিতে এখনো কোনো পণ্য নেই।" />
      )}
    </div>
  );
}
