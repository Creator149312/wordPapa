import dbConnect from '@/lib/mongodb';
import JourneyProgress from '@/models/journeyProgress';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { guestData, userId } = await req.json();
  if (!guestData || !userId) return NextResponse.json({ error: 'guestData and userId required' }, { status: 400 });

  await dbConnect();
  // Overwrite or merge guestData into user's journey progress
  let progress = await JourneyProgress.findOneAndUpdate(
    { userId },
    { $set: guestData },
    { new: true, upsert: true }
  );
  return NextResponse.json({ journey: progress }, { status: 200 });
}
