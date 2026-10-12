"use client";
import { useData } from "@/lib/DataContext";
import { fmtChange, fmtNumber, toNum } from "@/lib/format";

export default function Ticker() {
  const { products, loading } = useData();

  if (loading) return <div className="skeleton h-9 w-full rounded-none" />;
  if (!products.length) return null;

  const items = products.map((p) => {
    const c = toNum(p.change);
    const color = c > 0 ? "text-green-300" : c < 0 ? "text-red-300" : "text-gray-300";
    return (
      <span key={p.slug} className="mx-5 inline-flex items-center gap-1.5 whitespace-nowrap text-sm">
        <span>{p.emoji}</span>
        <span className="font-medium">{p.name}</span>
        <span>{fmtNumber(p.price)} টাকা/{String(p.unit).replace("প্রতি ", "")}</span>
        <span className={color}>{fmtChange(c)}</span>
      </span>
    );
  });

  return (
    <div className="ticker-wrap overflow-hidden bg-neutral py-2 text-white" aria-label="দামের তালিকা">
      <div className="ticker-track">
        <div className="flex">{items}</div>
        <div className="flex" aria-hidden="true">{items}</div>
      </div>
    </div>
  );
}
