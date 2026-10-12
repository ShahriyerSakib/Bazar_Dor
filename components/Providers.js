"use client";
import { Toaster } from "react-hot-toast";
import { DataProvider } from "@/lib/DataContext";

export default function Providers({ children }) {
  return (
    <DataProvider>
      {children}
      <Toaster position="top-center" />
    </DataProvider>
  );
}
