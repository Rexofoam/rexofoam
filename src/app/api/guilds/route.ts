import { NextRequest, NextResponse } from 'next/server';

// Mock guild data
const mockGuilds = [
  { 
    id: 1, 
    name: 'DragonSlayers', 
    level: 25, 
    members: 150, 
    leader: 'GuildMaster01' 
  },
  { 
    id: 2, 
    name: 'MapleWarriors', 
    level: 30, 
    members: 200, 
    leader: 'WarChief' 
  },
  { 
    id: 3, 
    name: 'PhoenixRising', 
    level: 22, 
    members: 120, 
    leader: 'PhoenixLeader' 
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const guildName = searchParams.get('name');

  try {
    if (guildName) {
      // Search for specific guild
      const guild = mockGuilds.find(g => 
        g.name.toLowerCase().includes(guildName.toLowerCase())
      );
      
      if (guild) {
        return NextResponse.json({ 
          success: true, 
          data: guild 
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          message: 'Guild not found' 
        }, { status: 404 });
      }
    } else {
      // Return all guilds
      return NextResponse.json({ 
        success: true, 
        data: mockGuilds 
      });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, leader } = body;

    if (!name || !leader) {
      return NextResponse.json({ 
        success: false, 
        message: 'Guild name and leader are required' 
      }, { status: 400 });
    }

    // Mock creating a new guild
    const newGuild = {
      id: mockGuilds.length + 1,
      name,
      level: 1,
      members: 1,
      leader
    };

    mockGuilds.push(newGuild);

    return NextResponse.json({ 
      success: true, 
      data: newGuild,
      message: 'Guild created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Invalid request body' 
    }, { status: 400 });
  }
}
