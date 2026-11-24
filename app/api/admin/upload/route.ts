import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    // Check admin authentication
    const token = req.cookies.get('ati_admin_token')?.value;
    if (token !== 'admin_authenticated_session_1968') {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided for upload.' },
        { status: 400 }
      );
    }

    if (files.length > 5) {
      return NextResponse.json(
        { success: false, error: 'Maximum 5 images allowed per activity.' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (!blobToken) {
      return NextResponse.json(
        { success: false, error: 'BLOB_READ_WRITE_TOKEN environment variable is not configured.' },
        { status: 500 }
      );
    }

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: `File ${file.name} exceeds 10MB limit.` },
          { status: 400 }
        );
      }

      // Safe filename
      const ext = path.extname(file.name) || '.jpg';
      const safeName = `activities/${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

      try {
        // Upload to Vercel Blob
        const blob = await put(safeName, file, {
          access: 'public',
          token: blobToken,
        });
        uploadedUrls.push(blob.url);
      } catch (blobErr: any) {
        console.warn('Vercel Blob upload failed, fallback to local file system:', blobErr?.message);
        // Fallback: write locally to public/images/activities/
        const uploadDir = path.join(process.cwd(), 'public/images/activities');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const localFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(path.join(uploadDir, localFileName), buffer);
        uploadedUrls.push(`/images/activities/${localFileName}`);
      }
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to upload images.' },
      { status: 500 }
    );
  }
}
