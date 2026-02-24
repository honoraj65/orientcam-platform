import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ detail: 'Non authentifié' }, { status: 401 });
    }

    // Get the raw body as ArrayBuffer and forward as-is
    const body = await request.arrayBuffer();
    const contentType = request.headers.get('content-type') || '';

    const response = await fetch(`${API_URL}/api/v1/student/profile/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': contentType,
      },
      body: body,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { detail: 'Erreur serveur lors de l\'upload' },
      { status: 500 }
    );
  }
}
