import { auth0 } from "@/lib/auth0"
import Link from "next/link"

export async function SiteHeader() {
    const session = await auth0.getSession()
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="w-full flex h-16 items-center justify-between px-8">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-xl font-bold text-primary hover:text-primary/90">
                        Changi Admin
                    </Link>
                    <Link 
                        href="/filter" 
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        Bonus Task
                    </Link>
                </div>
                <div className="flex items-center gap-6">
                    {!session ? (
                        <>
                            <a 
                                href="/auth/login?screen_hint=signup" 
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Sign up
                            </a>
                            <a 
                                href="/auth/login" 
                                className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
                            >
                                Log in
                            </a>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">{session.user.name}</span>
                            <a 
                                href="/auth/logout" 
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Logout
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}