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
  title: "Viper Net - Уеб дизайн, SEO оптимизация и онлайн магазини",
  description: "Професионални дигитални решения за вашия бизнес. Уеб дизайн, SEO оптимизация и онлайн магазини. Модерни, бързи и сигурни уебсайтове.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Viper Net - Професионални дигитални решения",
    description: "Модерни уебсайтове, SEO оптимизация и онлайн магазини за вашия бизнес.",
    type: "website",
    locale: "bg_BG",
    siteName: "Viper Net",
  },
  twitter: {
    card: "summary_large_image",
    title: "Viper Net - Професионални дигитални решения",
    description: "Модерни уебсайтове, SEO оптимизация и онлайн магазини за вашия бизнес.",
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


