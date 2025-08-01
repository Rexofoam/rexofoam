import { NextRequest, NextResponse } from 'next/server';
import { makeApiRequest, ENDPOINTS } from '@/config/maplestory-api';

/**
 * API Route: GET /api/character/symbols
 * Fetches character symbol equipment data from MapleStory SEA API
 * 
 * Query Parameters:
 * - ocid: Character OCID (required)
 * 
 * Example: /api/character/symbols?ocid=abc123
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ocid = searchParams.get('ocid');

    // Validate required parameters
    if (!ocid) {
      return NextResponse.json(
        { error: 'Missing required parameter: ocid' },
        { status: 400 }
      );
    }

    // Fetch symbol data from MapleStory SEA API
    const symbolData = await makeApiRequest(ENDPOINTS.CHARACTER_SYMBOL_EQUIPMENT, {
      ocid: ocid,
    });

    // Return the symbol data
    return NextResponse.json(symbolData, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300', // Cache for 5 minutes
      },
    });

  } catch (error) {
    console.error('Symbol API Error:', error);
    
    // Return appropriate error response
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch symbol data' },
      { status: 500 }
    );
  }
}
