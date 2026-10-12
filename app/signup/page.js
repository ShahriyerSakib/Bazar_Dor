"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signUp } from "@/lib/auth-client";
import SocialButtons from "@/components/SocialButtons";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name")?.toString().trim();
    const email = form.get("email")?.toString().trim();
    const password = form.get("password")?.toString() || "";

    if (!name || !email || !password) {
      setError("সব ঘর পূরণ করুন");
      toast.error("সব ঘর পূরণ করুন");
      return;
    }
    if (password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }
    setError("");
    setLoading(true);
    const { error } = await signUp.email({ name, email, password });
    setLoading(false);
    if (error) {
      const msg = error.message || "রেজিস্ট্রেশন করা যায়নি";
      setError(msg);
      toast.error(msg);
      return;
    }
    toast.success("রেজিস্ট্রেশন সফল! এবার সাইন ইন করুন");
    router.push("/signin?registered=1");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card border border-base-300 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-1 text-2xl font-bold text-neutral">নতুন অ্যাকাউন্ট খুলুন</h1>
        <p className="mb-6 text-sm text-gray-500">কয়েক সেকেন্ডেই রেজিস্ট্রেশন সম্পন্ন করুন</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="form-control">
            <span className="label-text mb-1 font-medium">নাম</span>
            <input name="name" type="text" placeholder="আপনার নাম" className="input input-bordered" required />
          </label>
          <label className="form-control">
            <span className="label-text mb-1 font-medium">ইমেইল</span>
            <input name="email" type="email" placeholder="you@example.com" className="input input-bordered" required />
          </label>
          <label className="form-control">
            <span className="label-text mb-1 font-medium">পাসওয়ার্ড</span>
            <input name="password" type="password" placeholder="কমপক্ষে ৬ অক্ষর" className="input input-bordered" required />
          </label>
          {error && <p className="text-sm text-error" role="alert">{error}</p>}
          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? <span className="loading loading-spinner" /> : "রেজিস্টার"}
          </button>
        </form>

        <div className="divider text-xs text-gray-400">অথবা</div>
        <SocialButtons callbackURL="/" />

        <p className="mt-6 text-center text-sm">
          আগে থেকেই অ্যাকাউন্ট আছে? <Link href="/signin" className="font-semibold text-primary hover:underline">সাইন ইন করুন</Link>
        </p>
      </div>
    </div>
  );
}
