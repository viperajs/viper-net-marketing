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
  title: "Viper Net - Web Design, SEO Optimization & Online Stores",
  description: "Professional digital solutions for your business. Web design, SEO optimization, and online stores. Modern, fast, and secure websites.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Viper Net - Professional Digital Solutions",
    description: "Modern websites, SEO optimization, and online stores for your business.",
    type: "website",
    locale: "en_US",
    siteName: "Viper Net",
  },
  twitter: {
    card: "summary_large_image",
    title: "Viper Net - Professional Digital Solutions",
    description: "Modern websites, SEO optimization, and online stores for your business.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#130113",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bg">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}


