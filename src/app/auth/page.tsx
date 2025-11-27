'use client';

import { FormEvent, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';



export default function AuthPage() {
    const supabase = createSupabaseBrowserClient();
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/process';
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!email || !password) {
            setError('Please enter email and password.');
            return;
        }

        try {
            setLoading(true);

            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) {
                    setError(error.message);
                } else {
                    setMessage('Check your email to confirm your account, then sign in.');
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) {
                    setError(error.message);
                } else {
                    router.push(redirect);
                }
            }
        } catch (err) {
            console.error(err);
            setError('Unexpected error, please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-lg">
                <header className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
                        Auth
                    </p>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {mode === 'signin' ? 'Sign in' : 'Create an account'}
                    </h1>
                    <p className="text-xs text-slate-400">
                        Use email and password for now. We can add OAuth providers later.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-xs text-slate-300">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs text-slate-300">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 text-sm font-medium disabled:opacity-60 hover:bg-emerald-400 transition-colors"
                    >
                        {loading
                            ? (mode === 'signin' ? 'Signing in…' : 'Creating account…')
                            : (mode === 'signin' ? 'Sign in' : 'Sign up')}
                    </button>
                </form>

                {error && (
                    <div className="text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
                        <span className="font-semibold mr-1">Error:</span>
                        {error}
                    </div>
                )}

                {message && (
                    <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900 rounded-lg px-3 py-2">
                        {message}
                    </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                    <button
                        type="button"
                        className="underline underline-offset-2 hover:text-slate-200"
                        onClick={() => {
                            setMode(mode === 'signin' ? 'signup' : 'signin');
                            setMessage(null);
                            setError(null);
                        }}
                    >
                        {mode === 'signin'
                            ? "Don't have an account? Sign up"
                            : 'Already have an account? Sign in'}
                    </button>

                    <Link
                        href="/"
                        className="text-slate-500 hover:text-slate-200 underline underline-offset-2"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </main>
    );
}
