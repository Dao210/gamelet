// Legacy Garden API placeholder. Grassland is the active persisted plant experience.

export async function GET() {
  return Response.json({ error: 'Garden API is not implemented. Use /api/grassland/plants.' }, { status: 501 });
}

export async function POST() {
  return Response.json({ error: 'Garden creation is not implemented. Use /api/grassland/plants.' }, { status: 501 });
}
