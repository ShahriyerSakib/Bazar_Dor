
import { toNum } from "./format";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "./fallback";

// API endpoints — tried in order
const BASES = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

async function fetchJson(url: string, ms = 8000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);

  try {
    const res = await fetch(url, { signal: ctrl.signal });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function apiGet(path: string) {
  let lastError: unknown;

  for (const base of BASES) {
    try {
      return await fetchJson(base + path);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("API unavailable");
}

function pick(
  obj: any,
  keys: string[],
  defaultValue: any
): any {
  for (const key of keys) {
    if (
      obj &&
      obj[key] !== undefined &&
      obj[key] !== null &&
      obj[key] !== ""
    ) {
      return obj[key];
    }
  }

  return defaultValue;
}

// Supports arrays and common API response formats
function unwrapList(json: any, keys: string[]) {
  if (Array.isArray(json)) return json;

  for (const key of ["data", ...keys, "result", "items"]) {
    if (Array.isArray(json?.[key])) {
      return json[key];
    }
  }

  return [];
}

function unwrapOne(json: any, keys: string[]) {
  if (!json) return null;
  if (Array.isArray(json)) return json[0] || null;

  for (const key of ["data", ...keys, "result", "item"]) {
    if (json[key] && typeof json[key] === "object") {
      if (Array.isArray(json[key])) {
        return json[key][0] || null;
      }

      return json[key];
    }
  }

  return json;
}

// Normalize category data
export function normalizeCategory(c: any) {
  if (typeof c === "string") {
    return {
      slug: c,
      name: c,
      icon: "🛒",
    };
  }

  const slug = String(
    pick(c, ["slug", "id", "key", "category"], "")
  );

  return {
    slug,
    name: pick(
      c,
      ["name_bn", "nameBn", "bn", "name", "title", "label"],
      slug
    ),
    icon: pick(c, ["icon", "emoji", "image"], "🛒"),
  };
}

// Extract category slugs from a product
function categoryList(p: any): string[] {
  const raw = pick(
    p,
    ["categories", "category", "tags", "category_slug"],
    []
  );

  const arr = Array.isArray(raw) ? raw : [raw];

  return arr
    .map((c: any) =>
      typeof c === "object"
        ? pick(c, ["slug", "id", "name"], "")
        : c
    )
    .filter(Boolean)
    .map(String);
}

// Normalize individual market price data
function normalizeMarket(m: any) {
  const min = toNum(
    pick(m, ["min", "minPrice", "min_price"], 0)
  );

  const max = toNum(
    pick(m, ["max", "maxPrice", "max_price"], 0)
  );

  const directPrice = toNum(
    pick(
      m,
      ["today", "price", "todayPrice", "currentPrice", "amount", "value"],
      0
    )
  );

  // If price is missing, estimate from the available min/max range.
  const price =
    directPrice || (min && max ? (min + max) / 2 : min || max);

  return {
    name: pick(
      m,
      ["name", "market", "marketName", "bazar", "bazaar", "title"],
      "বাজার"
    ),
    price,
    min,
    max,
    change: toNum(
      pick(
        m,
        ["change", "changePercent", "percent", "percentChange", "diff"],
        0
      )
    ),
  };
}

// Normalize product data
export function normalizeProduct(p: any) {
  if (!p) return null;

  const markets = pick(
    p,
    ["markets", "marketPrices", "market_prices", "bazars", "bazaars", "prices"],
    []
  );

  const marketList = Array.isArray(markets)
    ? markets.map(normalizeMarket)
    : [];

  const cats = categoryList(p);

  // Important: API product price may be stored in "today".
  let price = toNum(
    pick(
      p,
      [
        "today",
        "price",
        "todayPrice",
        "currentPrice",
        "today_price",
        "avgPrice",
        "averagePrice",
        "average",
      ],
      0
    )
  );

  // Derive an average from market prices if the product price is missing.
  if (!price && marketList.length) {
    const validPrices = marketList
      .map((market: any) => market.price)
      .filter((value: number) => value > 0);

    if (validPrices.length) {
      price =
        validPrices.reduce(
          (sum: number, value: number) => sum + value,
          0
        ) / validPrices.length;
    }
  }

  let change = toNum(
    pick(
      p,
      [
        "change",
        "changePercent",
        "change_percent",
        "percentChange",
        "percent",
        "priceChange",
      ],
      0
    )
  );

  const trend = String(
    pick(p, ["trend", "direction", "status"], "")
  ).toLowerCase();

  if (trend === "down" && change > 0) {
    change = -change;
  }

  const id = pick(p, ["id", "_id", "productId"], "");

  return {
    id,
    slug: String(pick(p, ["slug"], id)),
    name: pick(
      p,
      ["name_bn", "nameBn", "name", "title"],
      "পণ্য"
    ),
    emoji: pick(p, ["emoji", "icon", "image"], "🛒"),
    unit: pick(p, ["unit", "unitLabel", "per"], "প্রতি কেজি"),
    description: pick(
      p,
      ["description", "summary", "subtitle", "desc"],
      ""
    ),
    category: cats[0] || "",
    categories: cats,
    price,
    change,
    min:
      toNum(
        pick(p, ["min", "minPrice", "min_price", "minimum"], 0)
      ) || null,
    max:
      toNum(
        pick(p, ["max", "maxPrice", "max_price", "maximum"], 0)
      ) || null,
    avg:
      toNum(
        pick(
          p,
          ["avg", "avgPrice", "average", "averagePrice", "average_price"],
          0
        )
      ) || null,
    markets: marketList,
  };
}

// Get all products, optionally filtered by category
export async function getProducts(category?: string) {
  const query = category
    ? `?category=${encodeURIComponent(category)}`
    : "";

  try {
    const json = await apiGet(`/products${query}`);
    const products = unwrapList(json, ["products"])
      .map(normalizeProduct)
      .filter(Boolean);

    if (products.length) {
      return products;
    }
  } catch {
    // Use fallback data if the API is unavailable.
  }

  const fallbackProducts = FALLBACK_PRODUCTS
    .map(normalizeProduct)
    .filter(Boolean);

  return category
    ? fallbackProducts.filter((p: any) =>
        p.categories.includes(category)
      )
    : fallbackProducts;
}

// Get all categories
export async function getCategories() {
  try {
    const json = await apiGet("/categories");

    const categories = unwrapList(json, ["categories"])
      .map(normalizeCategory)
      .filter((category: any) => category.slug);

    if (categories.length) {
      return categories;
    }
  } catch {
    // Use fallback categories if the API is unavailable.
  }

  return FALLBACK_CATEGORIES;
}

// Get a single product by slug or ID
export async function getProduct(slug: string) {
  try {
    const json = await apiGet(
      `/products/${encodeURIComponent(slug)}`
    );

    const product = unwrapOne(json, ["product"]);

    if (
      product &&
      (product.name || product.name_bn || product.nameBn || product.title)
    ) {
      return normalizeProduct(product);
    }
  } catch {
    // Try finding the product in the full product list.
  }

  const allProducts = await getProducts();

  return (
    allProducts.find(
      (product: any) =>
        product.slug === slug || String(product.id) === slug
    ) || null
  );
}

// Calculate minimum, maximum, and average prices
export function priceSummary(p: any) {
  const markets = Array.isArray(p?.markets) ? p.markets : [];

  const prices = markets
    .map((market: any) => toNum(market.price))
    .filter((price: number) => price > 0);

  const min = p.min ?? (
    prices.length ? Math.min(...prices) : p.price
  );

  const max = p.max ?? (
    prices.length ? Math.max(...prices) : p.price
  );

  const avg = p.avg ?? (
    prices.length
      ? prices.reduce((sum: number, price: number) => sum + price, 0) /
        prices.length
      : p.price
  );

  return { min, max, avg };
}
