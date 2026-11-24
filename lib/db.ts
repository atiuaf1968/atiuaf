import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import {
  SocialLinks,
  DEFAULT_SOCIAL_LINKS,
  ContactSubmission,
  VolunteerApplication,
} from './types';

export { DEFAULT_SOCIAL_LINKS };
export type { SocialLinks, ContactSubmission, VolunteerApplication };

const connectionString =
  process.env.DATABASE_URL ||
  (process.env.PGHOST
    ? `postgresql://${encodeURIComponent(process.env.PGUSER || '')}:${encodeURIComponent(process.env.PGPASSWORD || '')}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'postgres'}`
    : '');

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL (or PGHOST, PGUSER, PGPASSWORD) environment variable is not defined. Please configure it in your environment settings.'
    );
  }

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
    // 1. Admin Users Table (Stores admin email & bcrypt hashed password)
    await p.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Ensure default admin user exists with hashed password
    const adminCheck = await p.query(
      'SELECT id, password FROM admin_users WHERE LOWER(email) = LOWER($1)',
      ['admin@atiuaf.com']
    );

    if (adminCheck.rows.length === 0) {
      const defaultPass = process.env.ADMIN_PASSWORD;
      if (defaultPass) {
        const hashedPassword = bcrypt.hashSync(defaultPass, 10);
        await p.query(
          'INSERT INTO admin_users (email, password) VALUES ($1, $2)',
          [process.env.ADMIN_EMAIL || 'admin@atiuaf.com', hashedPassword]
        );
        console.log('Seeded default admin with bcrypt hashed password into PostgreSQL.');
      }
    } else {
      // Check if existing password is plain text; if so, upgrade to bcrypt hash
      const existingPass = adminCheck.rows[0].password;
      if (!existingPass.startsWith('$2a$') && !existingPass.startsWith('$2b$')) {
        const upgradedHash = bcrypt.hashSync(existingPass, 10);
        await p.query(
          'UPDATE admin_users SET password = $1, updated_at = NOW() WHERE id = $2',
          [upgradedHash, adminCheck.rows[0].id]
        );
        console.log('Upgraded existing admin password to bcrypt hash in PostgreSQL.');
      }
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

    // 5. Contact Inquiries Table (Stores user contact messages)
    await p.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        subject VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Received',
        notes TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 6. Volunteer Applications Table (Stores user membership / volunteer form submissions)
    await p.query(`
      CREATE TABLE IF NOT EXISTS volunteer_applications (
        id VARCHAR(255) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        cnic VARCHAR(50),
        hostel VARCHAR(255),
        degree VARCHAR(255),
        semester VARCHAR(50),
        address TEXT,
        status VARCHAR(50) DEFAULT 'Under Review',
        notes TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Import existing volunteers if table is empty
    const volCheck = await p.query('SELECT COUNT(*) FROM volunteer_applications');
    if (parseInt(volCheck.rows[0].count, 10) === 0) {
      try {
        const volFile = path.join(process.cwd(), '.data/voluntary_memberships.json');
        if (fs.existsSync(volFile)) {
          const vList = JSON.parse(fs.readFileSync(volFile, 'utf-8'));
          for (const v of vList) {
            await p.query(
              `INSERT INTO volunteer_applications (id, full_name, email, phone, cnic, hostel, degree, semester, address, status, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
               ON CONFLICT (id) DO NOTHING`,
              [
                v.applicationId || v.id,
                v.fullName || v.name,
                v.email,
                v.phone || '',
                v.cnic || '',
                v.hostel || '',
                v.degree || '',
                v.semester || '',
                v.address || '',
                v.status || 'Under Review',
                v.submittedAt || v.createdAt || new Date().toISOString(),
              ]
            );
          }
          console.log(`Imported ${vList.length} existing voluntary members into PostgreSQL.`);
        }
      } catch (e) {
        console.error('Error importing existing volunteers:', e);
      }
    }

    // Import existing contact submissions if table is empty
    const contactCount = await p.query('SELECT COUNT(*) FROM contact_submissions');
    if (parseInt(contactCount.rows[0].count, 10) === 0) {
      try {
        const cFile = path.join(process.cwd(), '.data/contact_submissions.json');
        if (fs.existsSync(cFile)) {
          const cList = JSON.parse(fs.readFileSync(cFile, 'utf-8'));
          for (const c of cList) {
            await p.query(
              `INSERT INTO contact_submissions (id, name, email, phone, subject, category, message, status, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
               ON CONFLICT (id) DO NOTHING`,
              [
                c.referenceId || c.id,
                c.name,
                c.email,
                c.phone || '',
                c.subject,
                c.category || 'General Inquiry',
                c.message,
                c.status || 'Received',
                c.createdAt || new Date().toISOString(),
              ]
            );
          }
          console.log(`Imported ${cList.length} existing contact submissions into PostgreSQL.`);
        }
      } catch (e) {
        console.error('Error importing existing contacts:', e);
      }
    }

    dbInitialized = true;
    console.log('PostgreSQL schema verified and up to date.');
  } catch (err) {
    console.error('Failed to initialize PostgreSQL schema:', err);
  }
}

// ---------------------------------------------------------------------------
// ADMIN AUTHENTICATION HELPERS (BCRYPT HASHING)
// ---------------------------------------------------------------------------

export async function verifyAdminCredentials(email: string, pass: string): Promise<boolean> {
  await initDb();
  const p = getDbPool();
  try {
    const res = await p.query(
      'SELECT id, password FROM admin_users WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    if (res.rows.length === 0) {
      // Fallback check against env if no users in DB yet
      const envAdminEmail = process.env.ADMIN_EMAIL || 'admin@atiuaf.com';
      const envAdminPass = process.env.ADMIN_PASSWORD;
      return Boolean(
        envAdminPass &&
        email.toLowerCase() === envAdminEmail.toLowerCase() &&
        pass === envAdminPass
      );
    }

    const storedPass = res.rows[0].password;

    // If stored password is a bcrypt hash
    if (storedPass.startsWith('$2a$') || storedPass.startsWith('$2b$')) {
      return bcrypt.compareSync(pass, storedPass);
    }

    // If legacy plain text matches, automatically upgrade to bcrypt hash
    const envAdminPass = process.env.ADMIN_PASSWORD;
    if (pass === storedPass || (envAdminPass && pass === envAdminPass)) {
      const newHash = bcrypt.hashSync(pass, 10);
      await p.query('UPDATE admin_users SET password = $1 WHERE id = $2', [newHash, res.rows[0].id]);
      return true;
    }

    return false;
  } catch (err) {
    console.error('DB Admin verify error, using env fallback:', err);
    const envAdminEmail = process.env.ADMIN_EMAIL || 'admin@atiuaf.com';
    const envAdminPass = process.env.ADMIN_PASSWORD;
    return Boolean(
      envAdminPass &&
      email.toLowerCase() === envAdminEmail.toLowerCase() &&
      pass === envAdminPass
    );
  }
}

export async function setAdminPassword(email: string, newPassword: string): Promise<boolean> {
  await initDb();
  const p = getDbPool();
  try {
    // Hash new password using bcrypt with cost factor 10
    const hashedPassword = bcrypt.hashSync(newPassword.trim(), 10);

    const res = await p.query(
      `INSERT INTO admin_users (email, password, updated_at) 
       VALUES ($1, $2, NOW()) 
       ON CONFLICT (email) 
       DO UPDATE SET password = $2, updated_at = NOW()`,
      [email.toLowerCase().trim(), hashedPassword]
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

// ---------------------------------------------------------------------------
// USER DATA PERSISTENCE & ADMIN EDITING (CONTACT & VOLUNTEERS)
// ---------------------------------------------------------------------------

export async function saveContactSubmission(sub: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category?: string;
  message: string;
  status?: string;
  notes?: string;
}): Promise<ContactSubmission> {
  await initDb();
  const p = getDbPool();

  const res = await p.query(
    `INSERT INTO contact_submissions (id, name, email, phone, subject, category, message, status, notes, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
     ON CONFLICT (id)
     DO UPDATE SET
       name = $2,
       email = $3,
       phone = $4,
       subject = $5,
       category = $6,
       message = $7,
       status = $8,
       notes = $9,
       updated_at = NOW()
     RETURNING *`,
    [
      sub.id,
      sub.name,
      sub.email,
      sub.phone || '',
      sub.subject,
      sub.category || 'General Inquiry',
      sub.message,
      sub.status || 'Received',
      sub.notes || '',
    ]
  );

  const row = res.rows[0];
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    category: row.category,
    message: row.message,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  await initDb();
  const p = getDbPool();
  try {
    const res = await p.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
    return res.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      subject: row.subject,
      category: row.category,
      message: row.message,
      status: row.status,
      notes: row.notes,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
    }));
  } catch (err) {
    console.error('Failed to get contact submissions from DB:', err);
    return [];
  }
}

export async function updateContactSubmission(
  id: string,
  updates: Partial<ContactSubmission>
): Promise<boolean> {
  await initDb();
  const p = getDbPool();

  const current = await p.query('SELECT * FROM contact_submissions WHERE id = $1', [id]);
  if (current.rows.length === 0) return false;
  const row = current.rows[0];

  const name = updates.name ?? row.name;
  const email = updates.email ?? row.email;
  const phone = updates.phone ?? row.phone;
  const subject = updates.subject ?? row.subject;
  const category = updates.category ?? row.category;
  const message = updates.message ?? row.message;
  const status = updates.status ?? row.status;
  const notes = updates.notes ?? row.notes;

  const res = await p.query(
    `UPDATE contact_submissions 
     SET name = $2, email = $3, phone = $4, subject = $5, category = $6, message = $7, status = $8, notes = $9, updated_at = NOW()
     WHERE id = $1`,
    [id, name, email, phone, subject, category, message, status, notes]
  );
  return (res.rowCount ?? 0) > 0;
}

export async function deleteContactSubmission(id: string): Promise<boolean> {
  await initDb();
  const p = getDbPool();
  const res = await p.query('DELETE FROM contact_submissions WHERE id = $1', [id]);
  return (res.rowCount ?? 0) > 0;
}

// ---------------------------------------------------------------------------
// VOLUNTEER APPLICATIONS
// ---------------------------------------------------------------------------

export async function saveVolunteerApplication(app: {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  cnic?: string;
  hostel?: string;
  degree?: string;
  semester?: string;
  address?: string;
  status?: string;
  notes?: string;
}): Promise<VolunteerApplication> {
  await initDb();
  const p = getDbPool();

  const res = await p.query(
    `INSERT INTO volunteer_applications (id, full_name, email, phone, cnic, hostel, degree, semester, address, status, notes, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
     ON CONFLICT (id)
     DO UPDATE SET
       full_name = $2,
       email = $3,
       phone = $4,
       cnic = $5,
       hostel = $6,
       degree = $7,
       semester = $8,
       address = $9,
       status = $10,
       notes = $11,
       updated_at = NOW()
     RETURNING *`,
    [
      app.id,
      app.fullName,
      app.email,
      app.phone,
      app.cnic || '',
      app.hostel || '',
      app.degree || '',
      app.semester || '',
      app.address || '',
      app.status || 'Under Review',
      app.notes || '',
    ]
  );

  const row = res.rows[0];
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    cnic: row.cnic,
    hostel: row.hostel,
    degree: row.degree,
    semester: row.semester,
    address: row.address,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getVolunteerApplications(): Promise<VolunteerApplication[]> {
  await initDb();
  const p = getDbPool();
  try {
    const res = await p.query('SELECT * FROM volunteer_applications ORDER BY created_at DESC');
    return res.rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      cnic: row.cnic,
      hostel: row.hostel,
      degree: row.degree,
      semester: row.semester,
      address: row.address,
      status: row.status,
      notes: row.notes,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
    }));
  } catch (err) {
    console.error('Failed to get volunteer applications from DB:', err);
    return [];
  }
}

export async function updateVolunteerApplication(
  id: string,
  updates: Partial<VolunteerApplication>
): Promise<boolean> {
  await initDb();
  const p = getDbPool();

  const current = await p.query('SELECT * FROM volunteer_applications WHERE id = $1', [id]);
  if (current.rows.length === 0) return false;
  const row = current.rows[0];

  const fullName = updates.fullName ?? row.full_name;
  const email = updates.email ?? row.email;
  const phone = updates.phone ?? row.phone;
  const cnic = updates.cnic ?? row.cnic;
  const hostel = updates.hostel ?? row.hostel;
  const degree = updates.degree ?? row.degree;
  const semester = updates.semester ?? row.semester;
  const address = updates.address ?? row.address;
  const status = updates.status ?? row.status;
  const notes = updates.notes ?? row.notes;

  const res = await p.query(
    `UPDATE volunteer_applications 
     SET full_name = $2, email = $3, phone = $4, cnic = $5, hostel = $6, degree = $7, semester = $8, address = $9, status = $10, notes = $11, updated_at = NOW()
     WHERE id = $1`,
    [id, fullName, email, phone, cnic, hostel, degree, semester, address, status, notes]
  );
  return (res.rowCount ?? 0) > 0;
}

export async function deleteVolunteerApplication(id: string): Promise<boolean> {
  await initDb();
  const p = getDbPool();
  const res = await p.query('DELETE FROM volunteer_applications WHERE id = $1', [id]);
  return (res.rowCount ?? 0) > 0;
}
