import { NextRequest, NextResponse } from 'next/server';
import {
  getActivitiesAsync,
  saveActivity,
  deleteActivity,
  getSubscribersAsync,
  ActivityItem,
} from '@/lib/activities';
import { sendNewActivityNotificationToSubscribers } from '@/lib/mail';

function isAuthenticated(req: NextRequest): boolean {
  const cookie = req.cookies.get('ati_admin_token');
  return cookie?.value === 'admin_authenticated_session_1968';
}

// GET: Returns list of activities and subscribers from DB for the admin panel
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Please log in.' },
      { status: 401 }
    );
  }

  const activities = await getActivitiesAsync();
  const subscribers = await getSubscribersAsync();

  return NextResponse.json({
    success: true,
    activities,
    subscribers,
    stats: {
      totalActivities: activities.length,
      totalSubscribers: subscribers.length,
      activeSubscribers: subscribers.filter((s) => s.active).length,
    },
  });
}

// POST: Creates or updates a campus activity in PostgreSQL & broadcasts to subscribers
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Please log in.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const {
      id,
      title,
      category,
      date,
      time,
      location,
      description,
      images,
      featured,
      organizer,
      badgeColor,
      notifySubscribers = true,
    } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Activity title / name is required.' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
      return NextResponse.json(
        { success: false, error: 'Activity description is required.' },
        { status: 400 }
      );
    }

    // Ensure images array has at most 5 images
    const sanitizedImages: string[] = Array.isArray(images)
      ? images.filter((img) => typeof img === 'string' && img.trim().length > 0).slice(0, 5)
      : [];

    const activityId = id || `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const activityItem: ActivityItem = {
      id: activityId,
      title: title.trim(),
      slug: slug || activityId,
      category: (category || 'Campus Life & Activities').trim(),
      date: (date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })).trim(),
      time: time ? time.trim() : undefined,
      location: (location || 'University of Agriculture, Faisalabad (UAF)').trim(),
      description: description.trim(),
      images: sanitizedImages,
      createdAt: new Date().toISOString(),
      featured: Boolean(featured),
      organizer: organizer ? organizer.trim() : 'Anjuman Talaba-e-Islam (ATI UAF)',
      badgeColor: badgeColor === 'red' ? 'red' : 'green',
    };

    await saveActivity(activityItem);

    // Broadcast email notification to subscribers if requested
    let broadcastResult = { totalSubscribers: 0, sentCount: 0 };
    if (notifySubscribers) {
      try {
        broadcastResult = await sendNewActivityNotificationToSubscribers({
          title: activityItem.title,
          category: activityItem.category,
          date: activityItem.date,
          time: activityItem.time,
          location: activityItem.location,
          description: activityItem.description,
          images: activityItem.images,
        });
      } catch (broadcastErr) {
        console.error('Failed to broadcast activity to subscribers:', broadcastErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Campus activity published successfully to database.',
      activity: activityItem,
      broadcast: broadcastResult,
    });
  } catch (error: any) {
    console.error('Error saving activity:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save campus activity.' },
      { status: 500 }
    );
  }
}

// DELETE: Deletes an activity from PostgreSQL by id
export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Please log in.' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Activity ID is required for deletion.' },
        { status: 400 }
      );
    }

    const deleted = await deleteActivity(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Activity not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Activity deleted successfully from database.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete activity.' },
      { status: 500 }
    );
  }
}
