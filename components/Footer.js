export default function Footer() {
  return (
    <footer className="mt-16 bg-neutral text-neutral-content">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm md:flex-row md:items-center md:justify-between">
        <p className="font-medium">বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
        <p className="text-gray-400 md:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}
