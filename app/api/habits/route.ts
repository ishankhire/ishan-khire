import { NextResponse } from 'next/server';
import { getHabitsData } from '@/lib/habits';

export async function GET() {
  try {
    const habits = getHabitsData();
    return NextResponse.json({ habits });
  } catch (error) {
    console.error('Failed to load habits data:', error);
    return NextResponse.json(
      { error: 'Failed to load habits data' },
      { status: 500 }
    );
  }
}

// Future: Add POST/PUT for updating habits via UI
