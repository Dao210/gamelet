// Legacy Garden API placeholder. Grassland is the active persisted plant experience.

export async function GET() {
  return Response.json({ error: 'Garden feed is not implemented. Use /api/grassland/plants.' }, { status: 501 });
}
