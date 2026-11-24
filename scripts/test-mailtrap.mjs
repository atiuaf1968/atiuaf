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
const pass = process.env.MAILTRAP_SMTP_PASS || '<YOUR_API_TOKEN>';
const from = process.env.MAIL_FROM || 'Private Person <hello@atiuaf.com>';
const to = process.env.MAIL_TO || 'A Test User <atiuaf1968@gmail.com>';

console.log('--- Mailtrap SMTP Test ---');
console.log(`Host: ${host}:${port}`);
console.log(`User: ${user}`);
console.log(`From: ${from}`);
console.log(`To:   ${to}`);

if (pass === '<YOUR_API_TOKEN>' || !pass) {
  console.error('\n⚠️  ERROR: MAILTRAP_SMTP_PASS is not set!');
  console.error('Please edit .env.local and replace <YOUR_API_TOKEN> with your Mailtrap API token.');
  console.error('Find your token at: https://mailtrap.io/api-smtp/sending-setup\n');
  process.exit(1);
}

var transport = nodemailer.createTransport({
  host: host,
  port: port,
  auth: {
    user: user,
    pass: pass
  }
});

transport.sendMail({
  from: from,
  to: to,
  subject: "Hello from Mailtrap",
  text: "This is a test e-mail message."
}, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log("Message sent: %s", info.messageId);
  console.log("\n✅ Sent successfully! Check your logs at: https://mailtrap.io/sending/email_logs");
});
