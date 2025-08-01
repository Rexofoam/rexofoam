import { NextRequest, NextResponse } from 'next/server';
import { makeApiRequest, ENDPOINTS } from '@/config/maplestory-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ocid = searchParams.get('ocid');
    const skillGrade = searchParams.get('character_skill_grade');
    const dataType = searchParams.get('data_type'); // 'skills' or 'hyper-stat'

    if (!ocid) {
      return NextResponse.json({ error: 'OCID is required' }, { status: 400 });
    }

    if (dataType === 'hyper-stat') {
      // Fetch hyper stat data
      const hyperStatData = await makeApiRequest(ENDPOINTS.CHARACTER_HYPER_STAT, {
        ocid,
      });
      return NextResponse.json(hyperStatData);
    } else {
      // Fetch skills data (existing functionality)
      if (!skillGrade || !['hyperpassive', 'hyperactive'].includes(skillGrade)) {
        return NextResponse.json({ 
          error: 'character_skill_grade must be either "hyperpassive" or "hyperactive"' 
        }, { status: 400 });
      }

      const skillsData = await makeApiRequest(ENDPOINTS.CHARACTER_SKILL, {
        ocid,
        character_skill_grade: skillGrade,
      });
      return NextResponse.json(skillsData);
    }
  } catch (error) {
    console.error('Error fetching hyper data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hyper data' },
      { status: 500 }
    );
  }
}
