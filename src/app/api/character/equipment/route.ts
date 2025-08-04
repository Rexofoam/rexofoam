import { NextRequest, NextResponse } from 'next/server';
import { makeApiRequest, ENDPOINTS } from '@/config/maplestory-api';

/**
 * API Route: GET /api/character/equipment
 * Fetches character item equipment data from MapleStory SEA API
 * 
 * Query Parameters:
 * - ocid: Character OCID (required)
 * 
 * Example: /api/character/equipment?ocid=abc123
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

    // Fetch equipment data from MapleStory SEA API
    const equipmentData = await makeApiRequest(ENDPOINTS.CHARACTER_ITEM_EQUIPMENT, {
      ocid: ocid,
    });

    // Return the equipment data
    return NextResponse.json(equipmentData, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300', // Cache for 5 minutes
      },
    });

  } catch (error) {
    console.error('Equipment API Error:', error);
    
    // Return appropriate error response
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch equipment data' },
      { status: 500 }
    );
  }
}
