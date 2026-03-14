----------------------------------------------------------------------------------------------------------------------------------

Act as a Senior Technical Lead.

Based on this conversation, determine the exact next development tasks required.

Create a markdown document for:

docs/NEXT_STEPS.md

Structure:

# Next Development Steps

## Current Objective
(short explanation of what we are building right now)

## Immediate Tasks
(list specific tasks that must be done next)

## Required Files
(list files that will likely be created or modified)

## Dependencies Required
(list any libraries or services needed)

## Implementation Notes
(list important considerations)

## Testing Plan
(list how the feature should be tested)

## Expected Outcome
(what should work after completing these tasks)

Output only markdown content.

----------------------------------------------------------------------------------------------------------------------------------

# Next Development Steps

## Current Objective

Stabilize the **time extraction pipeline from voice commands** so that the Python NLP service correctly parses natural language time expressions and populates the `dueDate` and `reminderAt` fields in the `Task` model. This is required for the **Reminder Engine** to schedule and trigger intelligent reminders.

---

## Immediate Tasks

1. **Verify Python NLP Parsing**

   * Test the `/parse` endpoint with various natural language inputs.
   * Ensure responses include:

     * `intent`
     * `title`
     * `dueDate`
     * `reminderAt`

2. **Fix Time Parsing in Python NLP**

   * Ensure `dateparser` correctly interprets relative time expressions (e.g., “in 2 minutes”, “tomorrow at 8am”).
   * Ensure timezone handling converts local user time to UTC.

3. **Validate Worker → NLP Integration**

   * Confirm the worker sends requests to the Python NLP service.
   * Log and inspect parsed NLP results before task creation.

4. **Update Worker Task Creation Logic**

   * Ensure parsed `dueDate` and `reminderAt` values are properly converted to JavaScript `Date` objects before saving.

5. **Verify Reminder Scheduling**

   * After task creation, ensure `ReminderScheduler.scheduleTaskReminders()` is executed when `reminderAt` is present.

6. **Confirm Reminder Records Creation**

   * Verify that `prepare`, `main`, and `followup` reminders are inserted into the `Reminder` table.

7. **Test Reminder Worker**

   * Ensure the reminder worker detects due reminders and triggers the reminder engine.

8. **Validate Reminder Status Updates**

   * Confirm that reminders move from `pending` → `sent` when triggered.

---

## Required Files

Files likely to be modified or verified:

Backend Worker

* `src/worker/voiceProcessor.ts`
* `src/worker/worker.ts`

Reminder Engine

* `src/modules/reminders/scheduler.ts`
* `src/modules/reminders/engine.ts`
* `src/modules/reminders/repository.ts`
* `src/worker/reminderWorker.ts`

Voice Module

* `src/modules/voice/controller.ts`
* `src/modules/voice/service.ts`
* `src/modules/voice/routes.ts`

Python NLP Service

* `python-nlp/app.py`
* `python-nlp/parser.py`

Database

* `prisma/schema.prisma`

---

## Dependencies Required

Node.js Dependencies

* `axios` (for calling Python NLP service)
* `bullmq` (queue processing)
* `ioredis`
* `zod`
* `zod-to-json-schema`

Python Dependencies

* `fastapi`
* `uvicorn`
* `dateparser`
* `pytz`

Infrastructure

* PostgreSQL
* Redis

---

## Implementation Notes

* The backend must store **all timestamps in UTC**.
* User timezone must be provided by the client and passed to the NLP service.
* The NLP engine should return ISO8601 timestamps.
* The worker must convert NLP timestamps to JavaScript `Date` objects before storing.
* Reminder scheduling depends on `task.reminderAt`.
* Reminder engine should only schedule reminders if `reminderAt` is not null.
* Logging should be added temporarily for debugging NLP responses.

Example debug log:

```ts
console.log("Parsed NLP result:", parsed)
```

This helps confirm correct parsing.

---

## Testing Plan

1. Start all services:

   * Backend API
   * Worker
   * Reminder worker
   * Python NLP server

2. Send a test voice command:

```json
POST /v1/voice-input
{
"text": "buy milk in 2 minutes",
"timezone": "Asia/Kolkata"
}
```

3. Verify:

Task table

* `title` parsed correctly
* `reminderAt` populated
* `dueDate` populated

Reminder table

* Three reminders created:

  * `prepare`
  * `main`
  * `followup`

Worker logs

* NLP parsing log
* task creation confirmation

Reminder worker logs

* Reminder notifications printed

Reminder status

* `pending` → `sent`

---

## Expected Outcome

After completing these tasks:

* Voice commands correctly extract time expressions.
* Tasks contain valid `dueDate` and `reminderAt`.
* Reminder scheduler automatically creates reminder records.
* Reminder worker detects and triggers scheduled reminders.
* The system delivers conversational reminders following the **human-coach interaction model**.

The full pipeline will function as:

Voice Command
→ NLP Parsing
→ Task Creation
→ Reminder Scheduling
→ Reminder Engine
→ User Interaction Loop
