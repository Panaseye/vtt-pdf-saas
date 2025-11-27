'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AuthStatus() {
    const supabase = createSupabaseBrowserClient();
    const router = useRouter();
    const pathname = usePathname();

    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadUser() {
            setLoading(true);
            const { data, error } = await supabase.auth.getUser();

            if (cancelled) return;

            if (error || !data.user) {
                setUserEmail(null);
            } else {
                setUserEmail(data.user.email ?? null);
            }

            setLoading(false);
        }

        loadUser();

        return () => {
            cancelled = true;
        };
    }, [supabase]);

    async function handleSignOut() {
        await supabase.auth.signOut();
        setUserEmail(null);
        router.push('/auth');
    }

    if (loading) {
        return (
            <span className="text-[11px] text-slate-500">
        Checking session…
      </span>
        );
    }

    if (!userEmail) {
        const redirect = encodeURIComponent(pathname || '/');
        return (
            <Link
                href={`/auth?redirect=${redirect}`}
                className="px-2 py-1 rounded-md border border-slate-700 hover:border-emerald-400 text-xs text-slate-200"
            >
                Sign in
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-2 text-[11px] text-slate-300">
      <span className="hidden sm:inline">
        Signed in as <span className="font-medium text-slate-50">{userEmail}</span>
      </span>
            <button
                type="button"
                onClick={handleSignOut}
                className="px-2 py-1 rounded-md border border-slate-700 hover:border-slate-500 text-xs text-slate-200"
            >
                Sign out
            </button>
        </div>
    );
}
