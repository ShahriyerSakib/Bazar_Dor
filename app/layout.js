import "./globals.css";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

export const metadata = {
  title: "বাজার দর | BazarDor",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে — চাল, ডাল, তেল, সবজি, মাছ ও মাংসের আজকের বাজার দর।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" data-theme="bazar">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-base-200">
        <Providers>
          <Navbar />
          <Ticker />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
