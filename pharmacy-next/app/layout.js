import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
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
  title: "Hope Pharmacy - Pakistan's Premium Pharmacy",
  description: "Your trusted online pharmacy for genuine medicines in Lahore and across Pakistan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
          <Toaster position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}
