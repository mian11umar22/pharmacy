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
  // Next.js will automatically find icon.png in the app directory
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

// =============================================
// DEVELOPER CONTROL: Change to true to lock website, false to unlock
const WEBSITE_LOCKED = false;
// =============================================

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
        {WEBSITE_LOCKED ? (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontFamily: 'sans-serif',
            textAlign: 'center',
            padding: '2rem',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Website Access Locked</h1>
            <p style={{ color: '#aaa', marginBottom: '2rem', maxWidth: '500px' }}>
              This website is currently inactive. Please contact the developer to activate it.
            </p>
            <div style={{
              background: '#111',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '1.5rem 2rem',
              maxWidth: '400px',
              width: '100%',
            }}>
              <p style={{ color: '#aaa', marginBottom: '1rem', fontSize: '0.9rem' }}>Contact Developer</p>
              <p style={{ marginBottom: '0.5rem' }}>📱 WhatsApp: <strong>0309-4399601</strong></p>
              <p style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '1rem' }}>
                After payment, your website will be activated.
              </p>
            </div>
          </div>
        ) : (
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster position="bottom-right" />
            </CartProvider>
          </AuthProvider>
        )}
      </body>
    </html>
  );
}
