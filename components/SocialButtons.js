"use client";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";

export default function SocialButtons({ callbackURL = "/" }) {
  const go = async (provider) => {
    const { error } = await signIn.social({ provider, callbackURL });
    if (error) toast.error(error.message || `${provider} দিয়ে লগইন করা যায়নি`);
  };
  return (
    <div className="space-y-2">
      <button type="button" onClick={() => go("google")} className="btn btn-outline w-full">
        <span className="font-bold text-red-500">G</span> Google দিয়ে চালিয়ে যান
      </button>
      <button type="button" onClick={() => go("github")} className="btn btn-outline w-full">
        <span>🐙</span> GitHub দিয়ে চালিয়ে যান
      </button>
    </div>
  );
}
