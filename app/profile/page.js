"use client";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending || !session) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="skeleton h-72 w-full" />
      </div>
    );
  }
  const { user } = session;

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card items-center gap-3 border border-base-300 bg-white p-8 text-center shadow-sm">
        <div className="avatar placeholder">
          <div className="w-24 rounded-full bg-primary text-3xl text-primary-content">
            {user.image ? <img src={user.image} alt={user.name} /> : <span>{user.name?.[0]?.toUpperCase()}</span>}
          </div>
        </div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-500">{user.email}</p>
        <Link href="/profile/update" className="btn btn-primary mt-2">তথ্য আপডেট করুন</Link>
      </div>
    </div>
  );
}
