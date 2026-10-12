"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";
import SocialButtons from "@/components/SocialButtons";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toasted = useRef(false);

  useEffect(() => {
    if (params.get("reason") === "protected" && !toasted.current) {
      toasted.current = true;
      toast.error("এই পাতাটি দেখতে আগে সাইন ইন করুন");
    }
    if (params.get("registered") && !toasted.current) {
      toasted.current = true;
      toast.success("রেজিস্ট্রেশন সফল! এবার সাইন ইন করুন");
    }
  }, [params]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email")?.toString().trim();
    const password = form.get("password")?.toString();
    if (!email || !password) {
      setError("ইমেইল ও পাসওয়ার্ড দিন");
      toast.error("ইমেইল ও পাসওয়ার্ড দিন");
      return;
    }
    setError("");
    setLoading(true);
    const { error } = await signIn.email({ email, password });
    setLoading(false);
    if (error) {
      const msg = error.message || "ইমেইল বা পাসওয়ার্ড ভুল";
      setError(msg);
      toast.error(msg);
      return;
    }
    toast.success("সফলভাবে সাইন ইন হয়েছে");
    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card border border-base-300 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-1 text-2xl font-bold text-neutral">সাইন ইন করুন</h1>
        <p className="mb-6 text-sm text-gray-500">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="form-control">
            <span className="label-text mb-1 font-medium">ইমেইল</span>
            <input name="email" type="email" placeholder="you@example.com" className="input input-bordered" required />
          </label>
          <label className="form-control">
            <span className="label-text mb-1 font-medium">পাসওয়ার্ড</span>
            <input name="password" type="password" placeholder="••••••" className="input input-bordered" required />
          </label>
          {error && <p className="text-sm text-error" role="alert">{error}</p>}
          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? <span className="loading loading-spinner" /> : "সাইন ইন"}
          </button>
        </form>

        <div className="divider text-xs text-gray-400">অথবা</div>
        <SocialButtons callbackURL={redirect} />

        <p className="mt-6 text-center text-sm">
          অ্যাকাউন্ট নেই? <Link href="/signup" className="font-semibold text-primary hover:underline">সাইন আপ করুন</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-12"><div className="skeleton h-96 w-full" /></div>}>
      <SignInForm />
    </Suspense>
  );
}
