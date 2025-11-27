'use client';

import { FormEvent, useEffect, useState, DragEvent } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

type WorkerResponseMeta = {
    type?: string;
};

export default function ProcessPage() {
    const supabase = createSupabaseBrowserClient();
    const router = useRouter();
    const pathname = usePathname();

    const [authLoading, setAuthLoading] = useState(true);

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [resultText, setResultText] = useState('');
    const [meta, setMeta] = useState<WorkerResponseMeta | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        setAuthLoading(true);

        (async () => {
            const { data, error } = await supabase.auth.getUser();

            if (cancelled) return;

            if (error || !data.user) {
                const redirect = encodeURIComponent(pathname || '/process');
                router.push(`/auth?redirect=${redirect}`);
            }

            setAuthLoading(false);
        })();

        return () => {
            cancelled = true;
        };
    }, [supabase, router, pathname]);

    function handleFileSelect(selected: File | null) {
        setFile(selected);
        setError(null);
        setResultText('');
        setMeta(null);
    }

    function onDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    }

    function onDragOver(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setResultText('');
        setMeta(null);

        if (!file) {
            setError('Please select a file first.');
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/process', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                setError(data.error || 'Processing failed');
                return;
            }

            setResultText(data.text || '');
            setMeta(data.meta || null);
        } catch (err) {
            console.error(err);
            setError('Unexpected error. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function formatFileSize(bytes: number) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(resultText);
        } catch (e) {
            console.error('Failed to copy', e);
        }
    }

    // While we’re checking auth, show a small loading state
    if (authLoading) {
        return (
            <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
                <p className="text-sm text-slate-400">Checking your session…</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-6 px-4">
            <div className="w-full max-w-3xl space-y-4">
                {/* Main content (same as before, just shifted down slightly) */}
                <div className="space-y-6">
                    {/* Header */}
                    <section className="space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Clean transcripts from VTT & PDF
                        </h1>
                        <p className="text-sm text-slate-400 max-w-xl">
                            Upload a VTT, SRT, TXT, or PDF file. The file is sent to your
                            private n8n worker, cleaned up, and the extracted text appears
                            below. Only signed-in users can access this page.
                        </p>
                    </section>

                    {/* Upload card */}
                    <section className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6 space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Drag & drop area */}
                            <div
                                onDrop={onDrop}
                                onDragOver={onDragOver}
                                className={[
                                    'border-2 border-dashed rounded-lg px-4 py-8 flex flex-col items-center justify-center gap-2',
                                    'transition-colors cursor-pointer',
                                    file ? 'border-emerald-500/60 bg-slate-900' : 'border-slate-700 bg-slate-950',
                                ].join(' ')}
                                onClick={() => {
                                    const input = document.getElementById('file-input');
                                    if (input) (input as HTMLInputElement).click();
                                }}
                            >
                                <p className="text-sm font-medium">
                                    {file ? 'File ready to process' : 'Drag & drop a file here'}
                                </p>
                                <p className="text-xs text-slate-400">
                                    or click to browse – accepted: .vtt, .srt, .txt, .pdf
                                </p>

                                <input
                                    id="file-input"
                                    type="file"
                                    accept=".vtt,.srt,.txt,.pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0] || null;
                                        handleFileSelect(f);
                                    }}
                                />
                            </div>

                            {/* File details */}
                            {file && (
                                <div className="flex items-center justify-between text-xs text-slate-300 border border-slate-800 rounded-lg px-3 py-2 bg-slate-950">
                                    <div className="flex flex-col">
                    <span className="font-medium truncate max-w-[220px]">
                      {file.name}
                    </span>
                                        <span className="text-slate-500">
                      {file.type || 'Unknown type'} · {formatFileSize(file.size)}
                    </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleFileSelect(null)}
                                        className="text-slate-400 hover:text-red-400 text-xs underline-offset-2 hover:underline"
                                    >
                                        Clear
                                    </button>
                                </div>
                            )}

                            {/* Submit + status */}
                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={loading || !file}
                                    className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-emerald-400 transition-colors"
                                >
                                    {loading ? 'Processing…' : 'Process file'}
                                </button>

                                {loading && (
                                    <span className="text-xs text-slate-400">
                    Sending file to worker and waiting for response…
                  </span>
                                )}

                                {!loading && meta && (
                                    <span className="text-xs text-emerald-400">
                    Done · {meta.type?.toUpperCase() || 'UNKNOWN'}
                  </span>
                                )}
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
                                    <span className="font-semibold mr-1">Error:</span>
                                    {error}
                                </div>
                            )}
                        </form>
                    </section>

                    {/* Result card */}
                    <section className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6 space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-slate-100">
                                Result
                            </h2>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    disabled={!resultText}
                                    className="px-2 py-1 rounded-md border border-slate-700 hover:border-slate-500 disabled:opacity-40 disabled:hover:border-slate-700"
                                >
                                    Copy
                                </button>
                                <span className="text-slate-600">
                  {resultText ? `${resultText.length} characters` : 'No result yet'}
                </span>
                            </div>
                        </div>

                        <textarea
                            className="w-full h-80 text-sm border border-slate-800 bg-slate-950 rounded-lg p-3 font-mono text-slate-100 resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                            value={resultText}
                            onChange={(e) => setResultText(e.target.value)}
                            placeholder="Processed text will appear here after you upload a file and click “Process file”."
                        />
                    </section>
                </div>
            </div>
        </main>
    );
}
