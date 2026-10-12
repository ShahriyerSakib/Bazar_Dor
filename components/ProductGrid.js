import ProductCard from "./ProductCard";

export const gridCls = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export function ProductGrid({ products }) {
  return (
    <div className={gridCls}>
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 8 }) {
  return (
    <div className={gridCls}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card border border-base-300 bg-white p-5">
          <div className="skeleton mb-3 h-10 w-10 rounded-full" />
          <div className="skeleton mb-2 h-5 w-3/4" />
          <div className="skeleton mb-4 h-4 w-1/3" />
          <div className="flex justify-between">
            <div className="skeleton h-8 w-24" />
            <div className="skeleton h-6 w-14 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
