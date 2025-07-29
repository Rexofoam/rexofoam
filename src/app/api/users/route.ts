import { NextRequest, NextResponse } from 'next/server';

// Mock data for testing
const mockUsers = [
  { id: 1, username: 'Player1', level: 250, job: 'Hero' },
  { id: 2, username: 'MageUser', level: 180, job: 'Archmage' },
  { id: 3, username: 'BowMaster99', level: 220, job: 'Bowmaster' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  try {
    if (username) {
      // Search for specific user
      const user = mockUsers.find(u => 
        u.username.toLowerCase().includes(username.toLowerCase())
      );
      
      if (user) {
        return NextResponse.json({ 
          success: true, 
          data: user 
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          message: 'User not found' 
        }, { status: 404 });
      }
    } else {
      // Return all users
      return NextResponse.json({ 
        success: true, 
        data: mockUsers 
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
    const { username } = body;

    if (!username) {
      return NextResponse.json({ 
        success: false, 
        message: 'Username is required' 
      }, { status: 400 });
    }

    // Mock creating a new user
    const newUser = {
      id: mockUsers.length + 1,
      username,
      level: 1,
      job: 'Beginner'
    };

    mockUsers.push(newUser);

    return NextResponse.json({ 
      success: true, 
      data: newUser,
      message: 'User created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Invalid request body' 
    }, { status: 400 });
  }
}
