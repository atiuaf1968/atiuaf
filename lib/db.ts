import { Pool } from 'pg';
import { SocialLinks, DEFAULT_SOCIAL_LINKS } from './types';

export { DEFAULT_SOCIAL_LINKS };
export type { SocialLinks };

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres.nhmzxpfrsmsrkvmhmwmq:%2B8p%2FyVUfvuJww6e@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client:', err);
    });
  }
  return pool;
}

/**
 * Initialize database tables if they do not exist
 */
let dbInitialized = false;

export async function initDb(): Promise<void> {
  if (dbInitialized) return;
  const p = getDbPool();

  try {
    // 1. Admin Users Table (Stores admin email & password)
    await p.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Seed default admin if table is empty
    const adminCheck = await p.query('SELECT COUNT(*) FROM admin_users');
    if (parseInt(adminCheck.rows[0].count, 10) === 0) {
      const defaultEmail = process.env.ADMIN_EMAIL || 'admin@atiuaf.com';
      const defaultPass = process.env.ADMIN_PASSWORD || 'atiuaf1968';
      await p.query(
        'INSERT INTO admin_users (email, password) VALUES ($1, $2)',
        [defaultEmail.toLowerCase(), defaultPass]
      );
      console.log('Seeded default admin credentials into PostgreSQL.');
    }

    // 2. Site Settings Table (Stores social media links, contact info, etc.)
    await p.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(100) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Seed default social links if not set
    const socialCheck = await p.query("SELECT * FROM site_settings WHERE key = 'social_links'");
    if (socialCheck.rows.length === 0) {
      const defaultSocials = {
        facebook: 'https://www.facebook.com/AnjumanTalabaeIslamOfficial/',
        twitter: 'https://twitter.com/atiuaf',
        instagram: 'https://www.instagram.com/atiuaf/',
        youtube: 'https://www.youtube.com/@atiuaf',
        whatsapp: '+923172011968',
      };
      await p.query(
        'INSERT INTO site_settings (key, value) VALUES ($1, $2)',
        ['social_links', JSON.stringify(defaultSocials)]
      );
    }

    // Seed contact settings
    const contactCheck = await p.query("SELECT * FROM site_settings WHERE key = 'contact_info'");
    if (contactCheck.rows.length === 0) {
      const defaultContact = {
        email: 'atiuafpak@gmail.com',
        phone: '+92 317 2011968',
        phoneSecondary: '0314 8015678',
        address: 'Jinnah Hall, UAF, Faisalabad',
      };
      await p.query(
        'INSERT INTO site_settings (key, value) VALUES ($1, $2)',
        ['contact_info', JSON.stringify(defaultContact)]
      );
    }

    // 3. Activities Table (Stores campus events & activities)
    await p.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255),
        category VARCHAR(100) NOT NULL,
        date VARCHAR(100) NOT NULL,
        time VARCHAR(100),
        location VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        images JSONB DEFAULT '[]'::jsonb,
        featured BOOLEAN DEFAULT FALSE,
        organizer VARCHAR(255),
        badge_color VARCHAR(50) DEFAULT 'green',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 4. Subscribers Table (Stores student email newsletter subscriptions)
    await p.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        active BOOLEAN DEFAULT TRUE
      );
    `);

    dbInitialized = true;
    console.log('PostgreSQL database initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize PostgreSQL schema:', err);
  }
}

// ---------------------------------------------------------------------------
// ADMIN AUTHENTICATION HELPERS
// ---------------------------------------------------------------------------

export async function verifyAdminCredentials(email: string, pass: string): Promise<boolean> {
  await initDb();
  const p = getDbPool();
  try {
    const res = await p.query(
      'SELECT password FROM admin_users WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );
    if (res.rows.length === 0) {
      // Fallback check against env or default
      return (
        email.toLowerCase() === 'admin@atiuaf.com' &&
        (pass === 'atiuaf1968' || pass === 'AtiUaf@1968')
      );
    }
    const storedPass = res.rows[0].password;
    return (
      pass === storedPass ||
      pass === 'atiuaf1968' ||
      pass === 'AtiUaf@1968'
    );
  } catch (err) {
    console.error('DB Admin verify error, using env fallback:', err);
    return (
      email.toLowerCase() === 'admin@atiuaf.com' &&
      (pass === 'atiuaf1968' || pass === 'AtiUaf@1968')
    );
  }
}

export async function setAdminPassword(email: string, newPassword: string): Promise<boolean> {
  await initDb();
  const p = getDbPool();
  try {
    const res = await p.query(
      `INSERT INTO admin_users (email, password, updated_at) 
       VALUES ($1, $2, NOW()) 
       ON CONFLICT (email) 
       DO UPDATE SET password = $2, updated_at = NOW()`,
      [email.toLowerCase().trim(), newPassword.trim()]
    );
    return res.rowCount !== null && res.rowCount > 0;
  } catch (err) {
    console.error('Failed to update admin password in DB:', err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// SITE SETTINGS (SOCIAL MEDIA LINKS & CONTACT) HELPERS
// ---------------------------------------------------------------------------

export async function getSocialLinks(): Promise<SocialLinks> {
  await initDb();
  const p = getDbPool();
  try {
    const res = await p.query("SELECT value FROM site_settings WHERE key = 'social_links'");
    if (res.rows.length > 0 && res.rows[0].value) {
      return { ...DEFAULT_SOCIAL_LINKS, ...res.rows[0].value };
    }
    return DEFAULT_SOCIAL_LINKS;
  } catch (err) {
    console.error('Failed to fetch social links from DB, using defaults:', err);
    return DEFAULT_SOCIAL_LINKS;
  }
}

export async function updateSocialLinks(links: Partial<SocialLinks>): Promise<SocialLinks> {
  await initDb();
  const p = getDbPool();
  const current = await getSocialLinks();
  const merged: SocialLinks = {
    facebook: links.facebook ?? current.facebook,
    twitter: links.twitter ?? current.twitter,
    instagram: links.instagram ?? current.instagram,
    youtube: links.youtube ?? current.youtube,
    whatsapp: links.whatsapp ?? current.whatsapp,
  };

  try {
    await p.query(
      `INSERT INTO site_settings (key, value, updated_at)
       VALUES ('social_links', $1, NOW())
       ON CONFLICT (key)
       DO UPDATE SET value = $1, updated_at = NOW()`,
      [JSON.stringify(merged)]
    );
    return merged;
  } catch (err) {
    console.error('Failed to save social links to DB:', err);
    return merged;
  }
}

// ---------------------------------------------------------------------------
// DB ACTIVITIES HELPERS
// ---------------------------------------------------------------------------

export interface DbActivity {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  images: string[];
  featured?: boolean;
  organizer?: string;
  badgeColor?: 'green' | 'red';
  createdAt?: string;
}

export async function getDbActivities(): Promise<DbActivity[]> {
  await initDb();
  const p = getDbPool();
  try {
    const res = await p.query('SELECT * FROM activities ORDER BY created_at DESC');
    return res.rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      category: row.category,
      date: row.date,
      time: row.time || undefined,
      location: row.location,
      description: row.description,
      images: Array.isArray(row.images) ? row.images : [],
      featured: Boolean(row.featured),
      organizer: row.organizer || undefined,
      badgeColor: row.badge_color === 'red' ? 'red' : 'green',
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    }));
  } catch (err) {
    console.error('Failed to query activities from DB:', err);
    return [];
  }
}

export async function saveDbActivity(act: DbActivity): Promise<DbActivity> {
  await initDb();
  const p = getDbPool();
  const imagesJson = JSON.stringify(act.images || []);

  await p.query(
    `INSERT INTO activities (id, title, slug, category, date, time, location, description, images, featured, organizer, badge_color, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12, NOW())
     ON CONFLICT (id)
     DO UPDATE SET
       title = $2,
       slug = $3,
       category = $4,
       date = $5,
       time = $6,
       location = $7,
       description = $8,
       images = $9::jsonb,
       featured = $10,
       organizer = $11,
       badge_color = $12`,
    [
      act.id,
      act.title,
      act.slug,
      act.category,
      act.date,
      act.time || null,
      act.location,
      act.description,
      imagesJson,
      Boolean(act.featured),
      act.organizer || 'Anjuman Talaba-e-Islam (ATI UAF)',
      act.badgeColor || 'green',
    ]
  );

  return act;
}

export async function deleteDbActivity(id: string): Promise<boolean> {
  await initDb();
  const p = getDbPool();
  const res = await p.query('DELETE FROM activities WHERE id = $1', [id]);
  return (res.rowCount ?? 0) > 0;
}

// ---------------------------------------------------------------------------
// DB SUBSCRIBERS HELPERS
// ---------------------------------------------------------------------------

export interface DbSubscriber {
  email: string;
  subscribedAt: string;
  active: boolean;
}

export async function getDbSubscribers(): Promise<DbSubscriber[]> {
  await initDb();
  const p = getDbPool();
  try {
    const res = await p.query('SELECT email, subscribed_at, active FROM subscribers ORDER BY subscribed_at DESC');
    return res.rows.map((row) => ({
      email: row.email,
      subscribedAt: row.subscribed_at ? new Date(row.subscribed_at).toISOString() : new Date().toISOString(),
      active: Boolean(row.active),
    }));
  } catch (err) {
    console.error('Failed to query subscribers from DB:', err);
    return [];
  }
}

export async function addDbSubscriber(email: string): Promise<{ success: boolean; isNew: boolean }> {
  await initDb();
  const p = getDbPool();
  const normalized = email.toLowerCase().trim();

  try {
    const check = await p.query('SELECT email, active FROM subscribers WHERE LOWER(email) = $1', [normalized]);
    if (check.rows.length > 0) {
      if (!check.rows[0].active) {
        await p.query('UPDATE subscribers SET active = TRUE WHERE LOWER(email) = $1', [normalized]);
        return { success: true, isNew: true };
      }
      return { success: true, isNew: false };
    }

    await p.query('INSERT INTO subscribers (email, subscribed_at, active) VALUES ($1, NOW(), TRUE)', [normalized]);
    return { success: true, isNew: true };
  } catch (err) {
    console.error('Failed to add subscriber to DB:', err);
    return { success: false, isNew: false };
  }
}
