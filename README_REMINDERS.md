# Interview Reminder Feature Documentation

## Overview
The Interview Reminder feature automatically sends email reminders to users before their scheduled interviews. It integrates Inngest (background jobs) with Resend (email service) to provide timely, beautiful email notifications.

## Features

### 1. **Automatic Scheduled Reminders**
- Runs hourly to check for interviews scheduled within the next 24 hours
- Sends one reminder per interview (prevents duplicate emails)
- Logs all sent reminders in the database

### 2. **Manual Reminder Sending**
- Users can send reminders manually from the Tracker page
- Available for entries with status "Interview" and a scheduled interview date
- "Send Reminder" button appears in the card menu

### 3. **Beautiful Email Templates**
- Professional HTML emails with branding
- Shows company, role, round, and interview date
- Includes preparation tips and a CTA to view tracker
- Responsive design for mobile and desktop

## How It Works

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Tracker Page (UI)                                          │
│  - User can manually send reminders                         │
│  - "Send Reminder" button on Interview cards               │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────┐
│  Server Action: sendReminderEmail()                         │
│  - Validates entry and user                                │
│  - Calls /api/send-interview-reminder                      │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────┐
│  API Route: /api/send-interview-reminder                   │
│  - Handles both manual and automated requests              │
│  - Queries Supabase for entry details                      │
│  - Sends email via Resend                                 │
│  - Logs the reminder in reminder_logs table               │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────┐
│  Inngest Function: sendInterviewReminder                   │
│  - Triggered hourly via cron: "0 * * * *"                 │
│  - Finds upcoming interviews (next 24 hours)              │
│  - Checks for duplicate reminders                         │
│  - Sends email via API route or directly via Resend       │
│  - Logs reminder in database                              │
└──────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Database Setup

Run the migration to create the `reminder_logs` table:

```sql
-- Execute the migration file:
-- migrations/create_reminder_logs.sql

-- This creates:
-- - reminder_logs table
-- - Indexes for performance
-- - RLS policies for security
```

Or via Supabase Dashboard:
1. Go to SQL Editor
2. Run the migration query
3. Verify the table appears in the schema

### 2. Environment Variables

Add these to your `.env.local`:

```env
# Resend (already configured)
RESEND_API_KEY=your_resend_api_key

# Inngest (already configured)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# App URL for email links
NEXT_PUBLIC_APP_URL=https://yourdomain.com  # or http://localhost:3000 for dev
```

### 3. Inngest Configuration

The Inngest function is already configured in `lib/inngest/functions.ts`:

```typescript
export const sendInterviewReminder = inngest.createFunction(
  { 
    id: "send-interview-reminder",
    triggers: [
      { event: "interview/reminder-needed" },  // Manual trigger
      { cron: "0 * * * *" }                   // Hourly at :00
    ]
  },
  // ... handler function
)
```

## Usage

### For End Users (Manual Reminder)

1. Go to **Tracker** page
2. Find an interview card with status "Interview" and scheduled date
3. Hover over the card and click the menu icon (⋮)
4. Select "Send Reminder"
5. Email will be sent immediately to the user's email address

### For Developers (Programmatic Sending)

```typescript
import { sendReminderEmail } from '@/lib/actions/tracker'

// Send reminder for a specific entry
const result = await sendReminderEmail({
  entryId: 'abc-123',
  company: 'Google',
  role: 'SDE Intern',
  interviewDate: '2024-06-15',
  round: 'Technical Round 1'
})

if (result.success) {
  console.log('Reminder sent successfully')
}
```

### For Triggering Manual Events (Inngest)

```typescript
import { inngest } from '@/lib/inngest/inngest'

// Trigger manual reminder check
await inngest.send({
  name: 'interview/reminder-needed',
  data: {} // Optional: specific user/entry to remind
})
```

## Email Template Features

The reminder email includes:

- **Header**: Gradient background with "Interview Reminder" message
- **Content Section**:
  - Company name
  - Job role
  - Interview round
  - Interview date (formatted nicely)
  - Preparation tips checklist
- **CTA Button**: Links to Tracker page
- **Footer**: Encouragement message and app branding

Email is fully responsive and renders beautifully on:
- Desktop clients (Gmail, Outlook, etc.)
- Mobile clients (iOS Mail, Gmail app, etc.)
- Web clients (Yahoo, AOL, etc.)

## Database Schema

### reminder_logs table

```sql
Column           | Type      | Description
─────────────────┼───────────┼──────────────────────────────────
id              | UUID      | Primary key
user_id         | UUID      | Reference to auth.users
entry_id        | UUID      | Reference to tracker_entries
email_sent_to   | VARCHAR   | Email address the reminder was sent to
created_at      | TIMESTAMP | When reminder was sent
updated_at      | TIMESTAMP | Last update time
```

**Indexes**:
- `idx_reminder_logs_user_id`: For user-specific queries
- `idx_reminder_logs_entry_id`: For entry-specific queries
- `idx_reminder_logs_created_at`: For date range queries

**RLS Policies**:
- Users can view their own reminder logs
- System (Inngest/API) can insert new logs

## Testing

### Test Manual Reminder
1. Create a test entry with status "Interview"
2. Set interview date to tomorrow
3. Click "Send Reminder" on the card
4. Check your email inbox

### Test Automatic Reminders
1. Create multiple entries with interviews in next 24 hours
2. Wait for the hourly cron trigger (0:00 UTC each hour)
3. Or manually trigger via:
   ```bash
   curl -X POST http://localhost:3000/api/inngest \
     -H "Content-Type: application/json" \
     -d '{"name":"interview/reminder-needed","data":{}}'
   ```

### Test Email Template
- The Resend dashboard shows sent emails with preview
- Check both desktop and mobile renderings

## Error Handling

The feature includes comprehensive error handling:

- **Missing entry**: Returns 404 error
- **Email send failure**: Logs error, doesn't create reminder log
- **Database errors**: Returns error response with details
- **Missing user email**: Uses fallback or skips reminder

All errors are logged to the console for debugging.

## Performance Considerations

1. **Hourly Cron**: Runs at :00 of each hour (minimal impact)
2. **Database Queries**: Uses indexes for fast lookups
3. **Duplicate Prevention**: Checks `reminder_logs` before sending
4. **Rate Limiting**: Resend has built-in rate limiting (1000/hour by default)

## Troubleshooting

### Reminders not sending
- Check `RESEND_API_KEY` is correct
- Verify Inngest function is deployed
- Check reminder_logs table exists
- Look at Resend dashboard for email delivery status

### Duplicate reminders
- The system prevents duplicates by checking `reminder_logs`
- If duplicates occur, check if hourly cron is triggering multiple times

### Email template not rendering
- Test in Resend dashboard email preview
- Check HTML for unescaped characters
- Verify all CSS is inline (email clients don't support style tags)

## Future Enhancements

- [ ] User-configurable reminder time (e.g., "remind me 24h before")
- [ ] Multiple reminders per interview (24h, 12h, 1h before)
- [ ] SMS reminders via Twilio
- [ ] Slack/Discord notifications
- [ ] Calendar invites (.ics files)
- [ ] Interview preparation video links in emails
- [ ] User notification preferences (opt-in/out)

## Files Modified/Created

1. **lib/inngest/functions.ts** - Added `sendInterviewReminder` function
2. **app/api/send-interview-reminder/route.ts** - Updated to handle manual & automatic sends
3. **lib/actions/tracker.ts** - Added `sendReminderEmail` server action
4. **app/(app)/tracker/page.tsx** - Added "Send Reminder" button to card menu
5. **migrations/create_reminder_logs.sql** - New database table
6. **README_REMINDERS.md** - This file

## Support

For issues or questions:
1. Check the Inngest dashboard for function logs
2. Check the Resend dashboard for email delivery status
3. Review database logs in Supabase
4. Check browser console for client-side errors
