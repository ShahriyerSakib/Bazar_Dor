"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useData } from "@/lib/DataContext";
import { banglaDate } from "@/lib/format";
import { signOut, useSession } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { categories, loading } = useData();
  const { data: session, isPending } = useSession();
  const [date, setDate] = useState("");

  useEffect(() => setDate(banglaDate()), []);

  const handleSignOut = async () => {
    await signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছে");
    router.push("/");
    router.refresh();
  };

  const linkCls = (active) =>
    `whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
      active ? "bg-primary text-primary-content shadow" : "text-neutral hover:bg-base-300"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="leading-tight">
          <div className="text-xl font-bold text-primary sm:text-2xl">🛒 বাজার দর</div>
          <div className="min-h-4 text-xs text-gray-500">{date}</div>
        </Link>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="skeleton h-8 w-24 rounded-full" />
          ) : session ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-sm gap-2 normal-case">
                <span className="avatar placeholder">
                  <span className="w-7 rounded-full bg-primary text-primary-content">
                    {session.user.image ? (
                      <img src={session.user.image} alt="" />
                    ) : (
                      <span className="text-xs">{session.user.name?.[0]?.toUpperCase() || "U"}</span>
                    )}
                  </span>
                </span>
                <span className="hidden max-w-28 truncate sm:inline">{session.user.name}</span>
              </label>
              <ul tabIndex={0} className="menu dropdown-content z-50 mt-2 w-48 rounded-box bg-white p-2 shadow-lg">
                <li><Link href="/profile">আমার প্রোফাইল</Link></li>
                <li><button onClick={handleSignOut}>সাইন আউট</button></li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/signin" className="btn btn-outline btn-primary btn-sm sm:btn-md">সাইন ইন</Link>
              <Link href="/signup" className="btn btn-primary btn-sm sm:btn-md">সাইন আপ</Link>
            </>
          )}
        </div>
      </div>

      <nav className="border-t border-base-300 bg-base-200">
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2 sm:justify-center">
          <Link href="/" className={linkCls(pathname === "/")}>🏠 সব পণ্য</Link>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-8 w-20 rounded-full" />)
            : categories.map((c) => (
                <Link key={c.slug} href={`/category/${c.slug}`} className={linkCls(pathname === `/category/${c.slug}`)}>
                  {c.icon} {c.name}
                </Link>
              ))}
        </div>
      </nav>
    </header>
  );
}
