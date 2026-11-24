import { NextRequest, NextResponse } from 'next/server';
import {
  getContactSubmissions,
  updateContactSubmission,
  deleteContactSubmission,
  getVolunteerApplications,
  updateVolunteerApplication,
  deleteVolunteerApplication,
} from '@/lib/db';

function isAuthenticated(req: NextRequest): boolean {
  const cookie = req.cookies.get('ati_admin_token');
  return cookie?.value === 'admin_authenticated_session_1968';
}

// GET: Returns list of voluntary members and contact submissions from PostgreSQL
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const [volunteers, contacts] = await Promise.all([
      getVolunteerApplications(),
      getContactSubmissions(),
    ]);

    return NextResponse.json({
      success: true,
      volunteers,
      contacts,
      counts: {
        totalVolunteers: volunteers.length,
        totalContacts: contacts.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch user submissions.' },
      { status: 500 }
    );
  }
}

// PUT: Updates user submission data (volunteer or contact) in PostgreSQL
export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, id, updates } = body;

    if (!id || !updates || typeof updates !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Submission ID and updates are required.' },
        { status: 400 }
      );
    }

    if (type === 'volunteer') {
      const updated = await updateVolunteerApplication(id, updates);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Volunteer application not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Volunteer data updated successfully.' });
    } else if (type === 'contact') {
      const updated = await updateContactSubmission(id, updates);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Contact inquiry not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Contact inquiry data updated successfully.' });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid submission type.' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update submission data.' },
      { status: 500 }
    );
  }
}

// DELETE: Removes a user submission from PostgreSQL
export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!id || !type) {
      return NextResponse.json(
        { success: false, error: 'Both submission type and ID are required.' },
        { status: 400 }
      );
    }

    if (type === 'volunteer') {
      const deleted = await deleteVolunteerApplication(id);
      return NextResponse.json({ success: deleted });
    } else if (type === 'contact') {
      const deleted = await deleteContactSubmission(id);
      return NextResponse.json({ success: deleted });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid submission type.' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete submission.' },
      { status: 500 }
    );
  }
}
