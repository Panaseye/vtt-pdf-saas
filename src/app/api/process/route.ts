import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; // ensure Node runtime (good for FormData & fetch)

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { ok: false, error: 'no_file_provided' },
                { status: 400 }
            );
        }

        const workerSecret = process.env.WORKER_SECRET;
        const workerUrl = process.env.WORKER_URL;

        if (!workerSecret || !workerUrl) {
            console.error('Missing WORKER_SECRET or WORKER_URL env vars');
            return NextResponse.json(
                { ok: false, error: 'server_misconfigured' },
                { status: 500 }
            );
        }

        // Build a new FormData to send to the worker
        const workerFormData = new FormData();
        workerFormData.append('file', file);

        const workerResponse = await fetch(workerUrl, {
            method: 'POST',
            headers: {
                'x-worker-secret': workerSecret,
            },
            body: workerFormData,
        });

        const data = await workerResponse.json().catch(() => null);

        if (!workerResponse.ok || !data) {
            return NextResponse.json(
                {
                    ok: false,
                    error: 'worker_error',
                    details: data || null,
                },
                { status: 502 }
            );
        }

        // At this point, data should be your unified { ok, text, meta } from n8n
        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error('Error in /api/process:', err);
        return NextResponse.json(
            { ok: false, error: 'unexpected_server_error' },
            { status: 500 }
        );
    }
}
