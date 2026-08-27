import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import TrackOrderFloating from "@/components/layout/TrackOrderFloating";
import ReferButton from "@/components/layout/ReferButton";
import MobileNav from "@/components/layout/MobileNav";

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-background">
                {children}
            </main>
            <Footer />
            <WhatsAppButton />
            <ReferButton />
            <TrackOrderFloating />
            <MobileNav />
        </div>
    );
}
