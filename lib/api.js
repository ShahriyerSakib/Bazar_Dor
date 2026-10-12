import { toNum } from "./format";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "./fallback";

// Tried in order; first one that responds wins.
const BASES = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

async function fetchJson(url, ms = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

async function apiGet(path) {
  let lastErr;
  for (const base of BASES) {
    try {
      return await fetchJson(base + path);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("API unavailable");
}

const pick = (o, keys, d) => {
  for (const k of keys) if (o && o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k];
  return d;
};

// Unwrap {data: [...]} / {products: [...]} / [...] shapes.
function unwrapList(json, keys) {
  if (Array.isArray(json)) return json;
  for (const k of ["data", ...keys, "result", "items"]) {
    if (Array.isArray(json?.[k])) return json[k];
  }
  return [];
}
function unwrapOne(json, keys) {
  if (!json) return null;
  if (Array.isArray(json)) return json[0] || null;
  for (const k of ["data", ...keys, "result", "item"]) {
    if (json[k] && typeof json[k] === "object" && !Array.isArray(json[k])) return json[k];
    if (Array.isArray(json[k])) return json[k][0] || null;
  }
  return json;
}

export function normalizeCategory(c) {
  if (typeof c === "string") return { slug: c, name: c, icon: "🛒" };
  const slug = String(pick(c, ["slug", "id", "key", "category"], ""));
  return {
    slug,
    name: pick(c, ["name_bn", "nameBn", "bn", "name", "title", "label"], slug),
    icon: pick(c, ["icon", "emoji", "image"], "🛒"),
  };
}

function categoryList(p) {
  const raw = pick(p, ["categories", "category", "tags", "category_slug"], []);
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr
    .map((c) => (typeof c === "object" ? pick(c, ["slug", "id", "name"], "") : c))
    .filter(Boolean)
    .map(String);
}

function normalizeMarket(m) {
  return {
    name: pick(m, ["name", "market", "marketName", "bazar", "bazaar", "title"], "বাজার"),
    price: toNum(pick(m, ["price", "todayPrice", "currentPrice", "amount", "value"], 0)),
    change: toNum(pick(m, ["change", "changePercent", "percent", "percentChange", "diff"], 0)),
  };
}

export function normalizeProduct(p) {
  if (!p) return null;
  const markets = pick(p, ["markets", "marketPrices", "market_prices", "bazars", "bazaars", "prices"], []);
  const marketList = Array.isArray(markets) ? markets.map(normalizeMarket) : [];
  const cats = categoryList(p);

  let price = toNum(pick(p, ["price", "todayPrice", "currentPrice", "today_price", "avgPrice", "averagePrice", "average"], 0));
  if (!price && marketList.length) price = marketList.reduce((s, m) => s + m.price, 0) / marketList.length;

  let change = toNum(pick(p, ["change", "changePercent", "change_percent", "percentChange", "percent", "priceChange"], 0));
  const trend = String(pick(p, ["trend", "direction", "status"], "")).toLowerCase();
  if (trend === "down" && change > 0) change = -change;

  const id = pick(p, ["id", "_id", "productId"], "");
  return {
    id,
    slug: String(pick(p, ["slug"], id)),
    name: pick(p, ["name_bn", "nameBn", "name", "title"], "পণ্য"),
    emoji: pick(p, ["emoji", "icon", "image"], "🛒"),
    unit: pick(p, ["unit", "unitLabel", "per"], "প্রতি কেজি"),
    description: pick(p, ["description", "summary", "subtitle", "desc"], ""),
    category: cats[0] || "",
    categories: cats,
    price,
    change,
    min: toNum(pick(p, ["min", "minPrice", "min_price", "minimum"], 0)) || null,
    max: toNum(pick(p, ["max", "maxPrice", "max_price", "maximum"], 0)) || null,
    avg: toNum(pick(p, ["avg", "avgPrice", "average", "averagePrice", "average_price"], 0)) || null,
    markets: marketList,
  };
}

export async function getProducts(category) {
  const q = category ? `?category=${encodeURIComponent(category)}` : "";
  try {
    const json = await apiGet(`/products${q}`);
    return unwrapList(json, ["products"]).map(normalizeProduct);
  } catch {
    const list = FALLBACK_PRODUCTS.map(normalizeProduct);
    return category ? list.filter((p) => p.categories.includes(category)) : list;
  }
}

export async function getCategories() {
  try {
    const json = await apiGet("/categories");
    const list = unwrapList(json, ["categories"]).map(normalizeCategory).filter((c) => c.slug);
    if (list.length) return list;
  } catch {}
  return FALLBACK_CATEGORIES;
}

export async function getProduct(slug) {
  try {
    const json = await apiGet(`/products/${encodeURIComponent(slug)}`);
    const one = unwrapOne(json, ["product"]);
    if (one && (one.name || one.name_bn || one.title)) return normalizeProduct(one);
  } catch {}
  // Fall back to the list (match by slug / id).
  const all = await getProducts();
  return all.find((p) => p.slug === slug || String(p.id) === slug) || null;
}

// Derive min / max / avg from market rows (or from the product itself).
export function priceSummary(p) {
  const prices = p.markets.map((m) => m.price).filter(Boolean);
  const min = p.min ?? (prices.length ? Math.min(...prices) : p.price);
  const max = p.max ?? (prices.length ? Math.max(...prices) : p.price);
  const avg = p.avg ?? (prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : p.price);
  return { min, max, avg };
}
