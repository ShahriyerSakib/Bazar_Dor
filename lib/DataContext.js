"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getCategories, getProducts } from "./api";

const Ctx = createContext({ products: [], categories: [], loading: true });

export function DataProvider({ children }) {
  const [state, setState] = useState({ products: [], categories: [], loading: true });

  useEffect(() => {
    let alive = true;
    Promise.all([getProducts(), getCategories()]).then(([products, categories]) => {
      if (alive) setState({ products, categories, loading: false });
    });
    return () => {
      alive = false;
    };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export const useData = () => useContext(Ctx);
