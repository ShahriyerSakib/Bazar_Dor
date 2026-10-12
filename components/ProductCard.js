import Link from "next/link";
import { fmtChange, fmtPrice, toNum } from "@/lib/format";

export function ChangeBadge({ change }) {
  const c = toNum(change);
  const cls = c > 0 ? "badge-success" : c < 0 ? "badge-error" : "badge-ghost";
  return <span className={`badge ${cls} badge-outline gap-1 font-semibold`}>{fmtChange(c)}</span>;
}

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="card border border-base-300 bg-white transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="card-body gap-2 p-5">
        <div className="text-4xl">{product.emoji}</div>
        <h3 className="card-title text-lg">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.unit}</p>
        <div className="mt-2 flex items-end justify-between gap-2">
          <div>
            <p className="text-xs text-gray-500">আজকের দাম</p>
            <p className="text-lg font-bold text-primary">{fmtPrice(product.price)}</p>
          </div>
          <ChangeBadge change={product.change} />
        </div>
      </div>
    </Link>
  );
}
