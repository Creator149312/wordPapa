import dbConnect from '@/lib/mongodb';
import JourneyProgress from '@/models/journeyProgress';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { userId, updates } = await req.json();
  if (!userId || !updates) return NextResponse.json({ error: 'userId and updates required' }, { status: 400 });

  await dbConnect();
  const progress = await JourneyProgress.findOneAndUpdate(
    { userId },
    { $set: updates },
    { new: true }
  );
  if (!progress) return NextResponse.json({ error: 'Progress not found' }, { status: 404 });
  return NextResponse.json(progress, { status: 200 });
}
