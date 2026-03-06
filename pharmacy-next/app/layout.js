import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://www.hopepharmacypk.com'),
  title: "Hope Pharmacy - Genuine Medicines & Healthcare",
  description: "Pakistan's Premium Pharmacy. Your trusted partner for genuine medicines, delivered to your doorstep in Lahore and nationwide.",
  verification: {
    google: "viHB6Gct2hgadbVfgUUivnj56jqSCP3gXQi0zS-qZHY",
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Hope Pharmacy - Genuine Medicines & Healthcare",
    description: "Pakistan's Premium Pharmacy. Your trusted partner for genuine medicines, delivered to your doorstep.",
    url: 'https://www.hopepharmacypk.com',
    siteName: 'Hope Pharmacy',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-secondary`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster position="bottom-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
