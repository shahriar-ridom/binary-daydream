import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Rubik } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-nunito-sans",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Shahriar Assets",
    default: "Shahriar Assets | Architect Your Digital Legacy",
  },
  description:
    "Premium digital arsenal for high-performance creators. High-fidelity assets, instant access, commercial rights.",
  authors: [{ name: "Shahriar", url: "https://shahriardev.me" }],
  creator: "Shahriar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://assets.shahriardev.me",
    title: "Shahriar Assets",
    description: "Architect Your Digital Legacy.",
    siteName: "Shahriar Assets",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${nunitoSans.variable} ${rubik.variable} antialiased bg-[#050505] text-white selection:bg-purple-500 selection:text-white`}
      >
        <main className="relative flex min-h-screen flex-col">
          {children}
          <Toaster theme="dark" position="bottom-right" />
        </main>
      </body>
    </html>
  );
}
