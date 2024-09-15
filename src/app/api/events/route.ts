
import { NextResponse } from 'next/server';

import { events } from '../../../lib/events';

export async function GET() {
  try {
    console.log('Fetching events...');
    console.log('Events:', JSON.stringify(events, null, 2));
    
    if (!events || events.length === 0) {
      console.log('No events found');
      return NextResponse.json({ message: 'No events found' }, { status: 404 });
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error in GET /api/events:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
