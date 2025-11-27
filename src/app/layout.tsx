import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import AuthStatus from '@/components/AuthStatus';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'VTT / PDF Cleaner',
    description: 'Tal’s internal SaaS shell for cleaning VTT and PDF files via an n8n worker.',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-slate-950 text-slate-50`}>
        <div className="min-h-screen flex flex-col">
            {/* Global header / navbar */}
            <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
                <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-emerald-500/90 flex items-center justify-center text-xs font-bold text-slate-950">
                  VT
                </span>
                        <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-none">
                    VTT / PDF Cleaner
                  </span>
                            <span className="text-[11px] text-slate-400 leading-tight">
                    Internal SaaS shell · n8n worker
                  </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="text-slate-300 hover:text-emerald-300 transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="/process"
                                className="text-slate-300 hover:text-emerald-300 transition-colors"
                            >
                                Process
                            </Link>
                        </div>

                        <AuthStatus />
                    </div>
                </nav>
            </header>

            {/* Page content */}
            <div className="flex-1">
                {children}
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-800 bg-slate-950 text-[11px] text-slate-500">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <span>Built by Tal · local dev shell</span>
                    <span className="text-slate-600">
                Next.js · Supabase · n8n worker
              </span>
                </div>
            </footer>
        </div>
        </body>
        </html>
    );
}
