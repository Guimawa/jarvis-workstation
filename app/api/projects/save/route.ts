export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { slug, snapshot } = await req.json();
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });
    const ROOT = process.env.WORKSPACE_DIR || path.join(process.cwd(), 'workspace');
    const dir = path.join(ROOT, slug, 'snapshots');
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, `${Date.now()}.json`);
    await fs.writeFile(file, JSON.stringify(snapshot, null, 2));
    return NextResponse.json({ ok: true, file });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}