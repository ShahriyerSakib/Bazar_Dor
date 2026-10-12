const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export const toBn = (v) => String(v).replace(/[0-9]/g, (d) => BN[d]);

// Parse numbers that may contain Bengali digits / commas / currency text.
export function toNum(v) {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (v === undefined || v === null) return 0;
  const s = String(v)
    .replace(/[০-৯]/g, (d) => BN.indexOf(d))
    .replace(/,/g, "")
    .replace(/[^0-9.\-]/g, "");
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

export function fmtNumber(n, digits = 0) {
  const num = toNum(n);
  const str = num.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return toBn(str);
}

export const fmtPrice = (n) => `${fmtNumber(n)} টাকা`;

export function fmtChange(change) {
  const c = toNum(change);
  if (c > 0) return `▲ ${toBn(Math.abs(c).toFixed(1))}%`;
  if (c < 0) return `▼ ${toBn(Math.abs(c).toFixed(1))}%`;
  return `—${toBn("0.0")}%`;
}

export function banglaDate(date = new Date()) {
  try {
    return date.toLocaleDateString("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
