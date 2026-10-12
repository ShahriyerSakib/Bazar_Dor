import Link from "next/link";

export default function NotFoundView({ message = "দুঃখিত, আপনার খোঁজা পাতাটি পাওয়া যায়নি।" }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
      <div className="text-6xl">🛒</div>
      <h1 className="text-5xl font-bold text-primary">৪০৪</h1>
      <p className="text-gray-600">{message}</p>
      <Link href="/" className="btn btn-primary">হোম পেজে ফিরে যান</Link>
    </div>
  );
}
