import fs from 'fs';
import path from 'path';
import {
  getDbActivities,
  saveDbActivity,
  deleteDbActivity,
  getDbSubscribers,
  addDbSubscriber,
  DbActivity,
  DbSubscriber,
} from './db';
import { ActivityItem, SubscriberItem } from './types';

export type { ActivityItem, SubscriberItem };

const dataDir = (() => {
  try {
    const dir = path.join(process.cwd(), '.data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  } catch {
    return path.join('/tmp', '.data');
  }
})();

function ensureDataDir() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  } catch {
    // Gracefully ignore filesystem errors in read-only environments (e.g. Vercel)
  }
}

// ---------------------------------------------------------------------------
// SUBSCRIBERS (DB + Local File Fallback)
// ---------------------------------------------------------------------------

const subscribersFile = path.join(dataDir, 'subscribers.json');

function getLocalSubscribers(): SubscriberItem[] {
  ensureDataDir();
  if (!fs.existsSync(subscribersFile)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(subscribersFile, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function getSubscribersAsync(): Promise<SubscriberItem[]> {
  try {
    const dbSubs = await getDbSubscribers();
    if (dbSubs && dbSubs.length > 0) {
      return dbSubs;
    }
  } catch (err) {
    console.error('Error fetching subscribers from DB:', err);
  }
  return getLocalSubscribers();
}

export function getSubscribers(): SubscriberItem[] {
  return getLocalSubscribers();
}

export async function addSubscriber(email: string): Promise<{ success: boolean; isNew: boolean }> {
  ensureDataDir();
  const normalized = email.trim().toLowerCase();

  // 1. Save to DB
  let dbResult = { success: true, isNew: true };
  try {
    dbResult = await addDbSubscriber(normalized);
  } catch (err) {
    console.error('Failed to save subscriber to DB:', err);
  }

  // 2. Local fallback sync
  try {
    const subscribers = getLocalSubscribers();
    const existing = subscribers.find((s) => s.email.toLowerCase() === normalized);

    if (existing) {
      if (!existing.active) {
        existing.active = true;
        fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
      }
    } else {
      subscribers.push({
        email: normalized,
        subscribedAt: new Date().toISOString(),
        active: true,
      });
      fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
    }
  } catch (err) {
    console.error('Failed to sync subscriber locally:', err);
  }

  return dbResult;
}

// ---------------------------------------------------------------------------
// ACTIVITIES (DB + Local File Fallback)
// ---------------------------------------------------------------------------

const activitiesFile = path.join(dataDir, 'activities.json');

function getLocalActivities(): ActivityItem[] {
  ensureDataDir();
  if (!fs.existsSync(activitiesFile)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(activitiesFile, 'utf-8');
    const items = JSON.parse(raw);
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export async function getActivitiesAsync(): Promise<ActivityItem[]> {
  try {
    const dbActs = await getDbActivities();
    if (Array.isArray(dbActs) && dbActs.length > 0) {
      return dbActs;
    }
  } catch (err) {
    console.error('Failed to get activities from DB:', err);
  }

  try {
    return getLocalActivities();
  } catch {
    return [];
  }
}

export function getActivities(): ActivityItem[] {
  return getLocalActivities();
}

export async function saveActivity(item: ActivityItem): Promise<ActivityItem> {
  ensureDataDir();

  // 1. Save to DB
  try {
    await saveDbActivity(item);
  } catch (err) {
    console.error('Failed to save activity to DB:', err);
  }

  // 2. Save locally
  try {
    const activities = getLocalActivities();
    const index = activities.findIndex((a) => a.id === item.id);

    if (index !== -1) {
      activities[index] = item;
    } else {
      activities.unshift(item); // Newest first
    }

    fs.writeFileSync(activitiesFile, JSON.stringify(activities, null, 2));
  } catch (err) {
    console.error('Failed to sync activity locally:', err);
  }

  return item;
}

export async function deleteActivity(id: string): Promise<boolean> {
  ensureDataDir();

  // 1. Delete from DB
  let dbSuccess = false;
  try {
    dbSuccess = await deleteDbActivity(id);
  } catch (err) {
    console.error('Failed to delete activity from DB:', err);
  }

  // 2. Delete locally
  try {
    const activities = getLocalActivities();
    const filtered = activities.filter((a) => a.id !== id);
    if (filtered.length !== activities.length) {
      fs.writeFileSync(activitiesFile, JSON.stringify(filtered, null, 2));
      return true;
    }
  } catch (err) {
    console.error('Failed to delete activity locally:', err);
  }

  return dbSuccess;
}
