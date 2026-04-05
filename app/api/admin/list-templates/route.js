import { connectMongoDB as dbConnect } from '@/lib/mongodb';
import ListTemplate from '@/models/listTemplate';
import { NextResponse } from 'next/server';

// GET - Fetch all templates
export async function GET(req) {
  try {
    await dbConnect();
    const templates = await ListTemplate.find().sort({ createdAt: -1 });
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create new template
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const template = new ListTemplate(body);
    await template.save();

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT - Update template
export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id } = body;

    const template = await ListTemplate.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE - Delete template
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const template = await ListTemplate.findByIdAndDelete(id);

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
