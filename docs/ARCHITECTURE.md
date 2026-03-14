-----------------------------------------------------------------------------------------------------------------------

Act as a Senior System Architect.

Based on this conversation, generate the system architecture documentation for this project.

The output should be suitable for:

docs/ARCHITECTURE.md

Structure the document exactly as follows.

# System Architecture

## Overview
High level explanation of how the system works.

## Core Layers

### Mobile App Layer
Explain the role of the mobile application.

### Voice Interaction Layer
Explain speech capture, speech-to-text, and intent parsing.

### Assistant Integration Layer
Explain how Siri and Google Assistant interact with the app.

### Backend Layer
Explain the backend server responsibilities.

### Database Layer
Explain how tasks and user data are stored.

### Notification Layer
Explain how reminders and notifications work.

## Data Flow
Describe step-by-step how voice input becomes a stored task.

## Security Strategy
Explain authentication, privacy, and microphone access considerations.

## Scalability Strategy
Explain how the architecture can scale globally.

Output only the markdown content for ARCHITECTURE.md.

----------------------------------------------------------------------------------------------------------------------------------


# System Architecture

## Overview

The system is a **voice-first smart task management platform** designed to allow users to create, manage, and complete tasks through natural voice interaction. Instead of requiring users to manually open an application and enter tasks, the system captures voice commands, converts them into structured data, and schedules intelligent reminders.

The architecture follows a **modular, event-driven design** where voice commands are processed asynchronously to ensure responsiveness and scalability.

High-level workflow:

```
User Voice
   ↓
Speech Capture (Mobile / Assistant)
   ↓
Speech-to-Text
   ↓
Voice Input API
   ↓
Queue Processing
   ↓
Python NLP Parsing
   ↓
Task Engine
   ↓
Database
   ↓
Reminder Scheduler
   ↓
Notification Engine
   ↓
User Interaction
```

The architecture separates responsibilities into multiple layers, enabling independent scaling and clean system boundaries.

---

# Core Layers

## Mobile App Layer

The mobile application serves as the **primary user interface and device integration layer**.

Responsibilities include:

* Capturing voice input from the device microphone
* Sending transcribed voice commands to the backend
* Displaying tasks and reminders
* Allowing manual task creation and editing
* Receiving and displaying push notifications
* Handling user authentication
* Managing user preferences (language, timezone)

Key features:

```
Voice capture
Task dashboard
Authentication UI
Reminder notifications
Quick-response buttons (Yes / Not yet / Snooze)
Offline synchronization
```

Typical technologies:

```
React Native or Flutter
Secure storage for tokens
Push notification services
```

The mobile app communicates with the backend through secure REST APIs.

---

## Voice Interaction Layer

This layer is responsible for converting **spoken language into structured task data**.

Steps involved:

1. The user speaks a command.
2. The device converts speech to text using system-level speech recognition.
3. The text command is sent to the backend voice endpoint.
4. A natural language processing engine extracts the task structure.

Example voice command:

```
"Remind me to buy milk tomorrow at 8am"
```

Converted to text:

```
buy milk tomorrow at 8am
```

The NLP system extracts:

```
intent
task title
due date
reminder time
```

Example parsed result:

```
intent: create_task
title: buy milk
dueDate: 2026-03-15T08:00:00Z
reminderAt: 2026-03-15T08:00:00Z
```

This structured data is then used by the backend to create or update tasks.

---

## Assistant Integration Layer

This layer integrates the system with external voice assistants.

Supported assistants:

```
Apple Siri
Google Assistant
```

### Siri Integration

Uses:

```
App Intents
Siri Shortcuts
```

Flow:

```
User speaks to Siri
↓
Siri identifies intent
↓
App intent triggers
↓
Mobile app sends API request
```

Example:

```
"Hey Siri, remind me to buy milk at 5pm"
```

### Google Assistant Integration

Uses:

```
App Actions
Android Intents
```

Flow:

```
User voice command
↓
Google Assistant resolves intent
↓
App action triggered
↓
Mobile app sends API request
```

Both assistants ultimately trigger the backend endpoint:

```
POST /v1/voice-input
```

---

## Backend Layer

The backend is responsible for **all business logic, processing pipelines, and integrations**.

Technology stack:

```
Node.js
Fastify
TypeScript
BullMQ
Redis
```

Responsibilities include:

```
User authentication
Task management
Voice command processing
Queue management
Reminder scheduling
Notification triggering
Assistant integration APIs
```

Key backend modules:

```
Auth Module
Task Engine
Voice Processing Module
Queue System
Worker Services
Reminder Scheduler
Reminder Engine
```

Main API endpoints:

```
POST /auth/otp/request
POST /auth/otp/verify

POST /v1/tasks
GET /v1/tasks
PUT /v1/tasks/:id
DELETE /v1/tasks/:id
PATCH /v1/tasks/:id/complete

POST /v1/voice-input
```

Voice commands are processed asynchronously using a queue to keep the API responsive.

---

## Database Layer

The system uses **PostgreSQL** as the primary database with **Prisma ORM** for data access.

Core entities:

```
User
Task
VoiceInput
Reminder
```

### User

Stores user identity and authentication details.

Fields include:

```
id
email
phone
createdAt
```

Relationships:

```
User → Tasks
User → VoiceInputs
```

---

### Task

Stores structured task data.

Fields:

```
id
userId
title
description
priority
status
dueDate
reminderAt
source
completedAt
createdAt
updatedAt
deletedAt
```

Sources may include:

```
manual
voice
assistant
api
```

---

### VoiceInput

Stores raw voice commands before processing.

Fields:

```
id
userId
text
language
timezone
status
createdAt
```

Statuses:

```
pending
processed
failed
```

---

### Reminder

Stores scheduled reminder events.

Fields:

```
id
taskId
type
scheduledAt
sentAt
status
```

Reminder types:

```
prepare
main
followup
```

---

## Notification Layer

This layer delivers reminders and enables conversational task interaction.

Reminder flow:

```
Task created
↓
Reminder scheduler generates reminder records
↓
Reminder worker scans due reminders
↓
Notification sent to user
↓
User interaction captured
```

Reminder types:

```
Preparation reminder
Main reminder
Follow-up confirmation
```

Example interaction:

```
4:50 → Milk time in 10 minutes
5:00 → Time to buy milk
5:05 → Did you manage to buy the milk?
```

Notifications may be delivered via:

```
Mobile push notifications
Local notifications
Assistant voice responses
```

Future integrations:

```
Firebase Cloud Messaging
Apple Push Notification Service
```

---

## Data Flow

Below is the full lifecycle of a voice command.

### Step 1 — User Speech

```
User says:
"Buy milk in 2 minutes"
```

---

### Step 2 — Speech Recognition

Device converts speech into text:

```
buy milk in 2 minutes
```

---

### Step 3 — Voice Input API

The mobile app calls:

```
POST /v1/voice-input
```

Payload example:

```
{
"text": "buy milk in 2 minutes",
"timezone": "Asia/Kolkata"
}
```

---

### Step 4 — Store Raw Input

The backend stores the raw command:

```
VoiceInput table
status = pending
```

---

### Step 5 — Queue Job Created

A job is pushed into Redis:

```
voice-processing queue
```

---

### Step 6 — Worker Processing

The worker consumes the job and calls the Python NLP service.

```
POST /parse
```

The NLP engine extracts task data.

---

### Step 7 — Task Creation

Worker creates a task record:

```
Task table
source = voice
```

---

### Step 8 — Reminder Scheduling

Reminder scheduler creates:

```
prepare reminder
main reminder
follow-up reminder
```

These records are stored in the `Reminder` table.

---

### Step 9 — Reminder Execution

Reminder worker scans due reminders and triggers notifications.

---

### Step 10 — User Interaction

User responds:

```
Yes
Not yet
Snooze
```

The system updates the task accordingly.

---

# Security Strategy

Security is implemented across multiple layers.

### Authentication

Users authenticate using:

```
OTP login
JWT tokens
```

Token flow:

```
OTP verification
↓
JWT issued
↓
Stored on device
↓
Sent with every API request
```

Authorization header:

```
Authorization: Bearer TOKEN
```

---

### Authorization

Protected APIs verify:

```
JWT validity
User ownership of resources
```

Examples:

```
/v1/tasks
/v1/voice-input
```

---

### Privacy

Privacy protections include:

```
No raw audio stored
Only text commands stored
User data isolated by userId
Secure token storage
```

---

### Microphone Access

Handled at the operating system level.

```
User permission required
OS-level privacy controls
```

The app only receives text commands generated by speech recognition.

---

# Scalability Strategy

The architecture is designed for horizontal scalability.

### Stateless Backend

Fastify servers are stateless and can scale via:

```
multiple server instances
load balancers
```

---

### Queue-Based Processing

Voice processing uses **BullMQ + Redis**.

Advantages:

```
asynchronous processing
job retries
load smoothing
independent worker scaling
```

Workers can scale independently:

```
Worker 1
Worker 2
Worker 3
```

---

### Database Scaling

PostgreSQL supports:

```
read replicas
connection pooling
partitioning
```

---

### Global Expansion

Future architecture may include:

```
CDN for global assets
regional API clusters
geo-replicated databases
```

---

### Event-Driven Architecture

The system uses event-driven processing:

```
voice events
task events
reminder events
```

This ensures high throughput and resilience while handling large numbers of voice commands globally.

---

The resulting architecture supports:

```
voice-first task interaction
conversational reminders
assistant integrations
scalable asynchronous processing
secure user data handling
```
