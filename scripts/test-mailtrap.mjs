import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Load .env.local manually if running standalone via Node.js
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

const host = process.env.MAILTRAP_SMTP_HOST || 'live.smtp.mailtrap.io';
const port = parseInt(process.env.MAILTRAP_SMTP_PORT || '587', 10);
const user = process.env.MAILTRAP_SMTP_USER || 'api';
const pass = process.env.MAILTRAP_SMTP_PASS || '';
const from = process.env.MAIL_FROM || 'Anjuman Talaba-e-Islam <hello@atiuaf.com>';
const to = process.env.MAIL_TO || 'atiuafpak@gmail.com';

console.log('--- Mailtrap SMTP Test ---');
console.log(`Host: ${host}:${port}`);
console.log(`User: ${user}`);
console.log(`From: ${from}`);
console.log(`To:   ${to}`);

if (!pass) {
  console.error('\n⚠️  ERROR: MAILTRAP_SMTP_PASS is not set in .env.local!');
  process.exit(1);
}

const transport = nodemailer.createTransport({
  host,
  port,
  auth: {
    user,
    pass
  }
});

transport.sendMail({
  from,
  to,
  subject: "Hello from Mailtrap - ATI UAF",
  text: "This is a test e-mail message."
}, (error, info) => {
  if (error) {
    console.error("❌ Send error:", error);
    return;
  }
  console.log("Message sent: %s", info.messageId);
  console.log("\n✅ Sent successfully! Check your logs at: https://mailtrap.io/sending/email_logs");
});
