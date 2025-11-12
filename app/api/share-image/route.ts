import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get('mode') || 'classic';
  const title = searchParams.get('title') || 'Nerdle';
  const subtitle = searchParams.get('subtitle') || 'Daily Math Equation Puzzle';

  // For now, return a simple JSON response
  // TODO: Implement proper image generation with a library that works well with Edge Runtime
  return NextResponse.json({
    message: 'Share image API - Coming Soon!',
    params: {
      mode,
      title,
      subtitle,
    },
    note: 'Full image generation will be implemented in a future update',
  });
}