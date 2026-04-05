import dbConnect from '@/lib/mongodb';
import JourneyProgress from '@/models/journeyProgress';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  await dbConnect();
  // Find by user email (assuming you have a User model with email)
  const user = await (await import('@/models/user')).default.findOne({ email });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  let progress = await JourneyProgress.findOne({ userId: user._id });
  if (!progress) {
    progress = await JourneyProgress.create({ userId: user._id, progress: [] });
  }
  return NextResponse.json(progress, { status: 200 });
}
