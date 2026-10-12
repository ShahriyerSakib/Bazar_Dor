export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-green-50 to-amber-50">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
        <div className="space-y-4 text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">আজকের বাজার দর</p>
          <h1 className="text-3xl font-bold leading-tight text-neutral sm:text-4xl lg:text-5xl">
            নিত্যপ্রয়োজনীয় পণ্যের দাম, এক নজরে
          </h1>
          <p className="text-gray-600">
            চাল, ডাল, তেল, সবজি, মাছ ও মাংসের সর্বশেষ দাম জানুন এবং বিভিন্ন বাজারের দাম তুলনা করে বুদ্ধিমানের মতো কেনাকাটা করুন।
          </p>
          <a href="#সব-পণ্য" className="btn btn-primary btn-sm sm:btn-md">সব পণ্য দেখুন ↓</a>
        </div>
        <div className="flex justify-center">
          <img src="/bazar-hero.png" alt="বাজারের ঝুড়ি" className="w-full max-w-sm" />
        </div>
      </div>
    </section>
  );
}
