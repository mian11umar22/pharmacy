export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="flex-grow">
                {children}
            </main>
        </div>
    )
}
