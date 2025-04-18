import cron from 'node-cron';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env from config folder
dotenv.config({ path: path.join(__dirname, '../config/.env') });

// ✅ Set up transporter for Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.SMTP_MAIL,       // Gmail
    pass: process.env.SMTP_PASSWORD,   // App Password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// 🛠 Test the SMTP config
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP verification failed:', error);
  } else {
    console.log('✅ SMTP Server is ready to send emails 🚀');
  }
});

// 📅 Start All Scheduled Cron Jobs
export const startScheduledJobs = () => {
  console.log('⏰ Cron Jobs Initialized');

  // 🕘 Daily Reminder Email at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    try {
      const mailOptions = {
        from: `"Aurora Bot" <${process.env.SMTP_MAIL}>`,
        to: process.env.RECIPIENT_MAIL || 'recipient@example.com',
        subject: '📌 Daily Reminder from NexaFlow',
        html: `
          <h3>👋 Good Morning!</h3>
          <p>This is your daily reminder from <strong>NexaFlow</strong>.</p>
          <p>Check your latest workflows and insights.</p>
          <a href="${process.env.FRONTEND_URL}/dashboard">Go to Dashboard</a>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Daily reminder sent!');
    } catch (error) {
      console.error('❌ Error sending daily reminder:', error.message);
    }
  });

  // 🕣 Weekly Digest Email at 8:30 AM every Monday
  cron.schedule('30 8 * * 1', async () => {
    try {
      const mailOptions = {
        from: `"Aurora Bot" <${process.env.SMTP_MAIL}>`,
        to: process.env.RECIPIENT_MAIL || 'recipient@example.com',
        subject: '📈 Your Weekly Workflow Insights',
        html: `
          <h2>📊 Weekly Summary</h2>
          <ul>
            <li>New Workflows Created: <strong>5</strong></li>
            <li>Tasks Completed: <strong>12</strong></li>
            <li>AI Insights Generated: <strong>3</strong></li>
          </ul>
          <p><a href="${process.env.CLIENT_URL}/dashboard">View Report</a></p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Weekly digest sent!');
    } catch (error) {
      console.error('❌ Error sending weekly digest:', error.message);
    }
  });
};
