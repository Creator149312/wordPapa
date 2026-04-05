import { connectMongoDB as dbConnect } from '@/lib/mongodb';
import ListTemplate from '@/models/listTemplate';
import { NextResponse } from 'next/server';
import apiConfig from '@utils/apiUrlConfig';

// POST - Bulk create lists from templates
export async function POST(req) {
  try {
    await dbConnect();
    const { templateIds } = await req.json();

    if (!templateIds || !Array.isArray(templateIds) || templateIds.length === 0) {
      return NextResponse.json(
        { error: 'Please provide an array of template IDs' },
        { status: 400 }
      );
    }

    const templates = await ListTemplate.find({ _id: { $in: templateIds } });
    const results = [];
    let successCount = 0;
    let failedCount = 0;

    for (const template of templates) {
      try {
        // Generate words using AI/API
        const generateResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/generateWords`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              topic: template.context,
              count: template.wordCount,
              level: template.level
            })
          }
        );

        let words = [];
        if (generateResponse.ok) {
          const generatedData = await generateResponse.json();
          words = generatedData.words || [];
        } else {
          console.warn(`Failed to generate words for template: ${template.title}`);
          // Fallback: return empty array, list will be created with no words
        }

        // Create list using bulk-create API
        const listResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/list/bulk-create`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: template.title,
              description: template.description || template.context,
              words: words,
              topic: template.category || template.context,
              difficulty: template.level,
              createdBy: 'admin'
            })
          }
        );

        if (listResponse.ok) {
          const listData = await listResponse.json();
          
          // Update template status
          await ListTemplate.findByIdAndUpdate(template._id, {
            status: 'created',
            createdListId: listData._id,
            generatedWords: words
          });

          results.push({
            templateId: template._id,
            title: template.title,
            status: 'success',
            wordsCount: words.length,
            listId: listData._id
          });
          successCount++;
        } else {
          throw new Error(`Failed to create list: ${listResponse.statusText}`);
        }
      } catch (error) {
        // Update template with error
        await ListTemplate.findByIdAndUpdate(template._id, {
          status: 'failed',
          error: error.message
        });

        results.push({
          templateId: template._id,
          title: template.title,
          status: 'failed',
          error: error.message
        });
        failedCount++;
      }
    }

    return NextResponse.json({
      message: `Bulk creation complete: ${successCount} succeeded, ${failedCount} failed`,
      successCount,
      failedCount,
      results
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
