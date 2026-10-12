"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateUser, useSession } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("নাম লিখুন");
    setLoading(true);
    const { error } = await updateUser({ name: name.trim() });
    setLoading(false);
    if (error) return toast.error(error.message || "আপডেট করা যায়নি");
    toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
    router.push("/profile");
    router.refresh();
  };

  if (isPending) {
    return <div className="mx-auto max-w-md px-4 py-12"><div className="skeleton h-56 w-full" /></div>;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card border border-base-300 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-6 text-2xl font-bold">তথ্য আপডেট করুন</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="form-control">
            <span className="label-text mb-1 font-medium">নাম</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered" required />
          </label>
          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? <span className="loading loading-spinner" /> : "তথ্য আপডেট করুন"}
          </button>
          <Link href="/profile" className="btn btn-ghost w-full">বাতিল</Link>
        </form>
      </div>
    </div>
  );
}
