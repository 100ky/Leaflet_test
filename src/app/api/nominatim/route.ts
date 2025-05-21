import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'SAKO Brno spalovna';

  try {
    // Definováno User-Agent aby Nominatim API neblokoval požadavky
    const headers = {
      'User-Agent': 'LeafletMapApp/1.0'
    };
    
    // Zavoláme Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error(`Nominatim API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    console.error('Error fetching from Nominatim:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
