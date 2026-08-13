import { NextResponse } from 'next/server';

const OLLAMA_TAGS_URL = 'http://127.0.0.1:11434/api/tags';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = async () => {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(OLLAMA_TAGS_URL, {
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`Ollama returned ${response.status}`);

    const data = (await response.json()) as {
      models?: Array<{ modified_at?: string; name: string; size?: number }>;
    };

    return NextResponse.json({
      latency: Date.now() - startedAt,
      models: data.models || [],
      ok: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '无法连接 Ollama',
        latency: Date.now() - startedAt,
        models: [],
        ok: false,
      },
      { status: 503 },
    );
  } finally {
    clearTimeout(timeout);
  }
};
