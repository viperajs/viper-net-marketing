import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata = {
  metadataBase: new URL("https://viper-net.com"),
  title: "Viper Net · Websites built to strike",
  description:
    "Viper Net designs, builds and launches websites and online stores for real businesses. Live in weeks, not months.",
  openGraph: {
    title: "Viper Net · Websites built to strike",
    description: "Design, build and launch. Live in weeks, not months.",
    type: "website",
    locale: "en_US",
    siteName: "Viper Net",
    url: "/",
    images: [{ url: "/hero/hero-poster.jpg", width: 1928, height: 1076, alt: "A thread of green light falling through the dark" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Viper Net · Websites built to strike",
    description: "Design, build and launch. Live in weeks, not months.",
    images: ["/hero/hero-poster.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  themeColor: "#090711",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}


