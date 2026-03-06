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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Pharmacy",
              "name": "Hope Pharmacy",
              "image": "https://www.hopepharmacypk.com/images/logo.png",
              "@id": "https://www.hopepharmacypk.com",
              "url": "https://www.hopepharmacypk.com",
              "telephone": "0305-4964343",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Abid road Islam nagar main Walton",
                "addressLocality": "Lahore",
                "addressRegion": "Punjab",
                "postalCode": "54000",
                "addressCountry": "PK"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 31.4805,
                "longitude": 74.3718
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "00:00",
                "closes": "23:59"
              }
            })
          }}
        />
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
