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

The system is a **voice-first smart task management platform** designed to allow users to create and manage tasks using natural voice commands without needing to open the application manually.

The core idea is:

```
Speak once → Task structured automatically → Reminder scheduled
```

The system integrates with mobile devices and voice assistants while maintaining a scalable backend architecture.

The architecture follows an **event-driven design** with asynchronous processing to ensure responsiveness and scalability.

High-level workflow:

```
User Voice
   ↓
Voice Capture (Mobile / Assistant)
   ↓
Speech-to-Text
   ↓
Voice Command API
   ↓
Queue Processing
   ↓
Rule-Based NLP Parser
   ↓
Task Engine
   ↓
Database
   ↓
Notification Scheduler
   ↓
User Reminder
```

The system is composed of several independent layers that communicate through APIs and message queues.

---

# Core Layers

## Mobile App Layer

The mobile application acts as the **primary user interface and device integration layer**.

Responsibilities:

* Capture voice commands from the microphone
* Authenticate users
* Display tasks and reminders
* Allow manual task creation and editing
* Sync with backend APIs
* Store authentication tokens securely
* Trigger local notifications

Key components:

```
Voice capture
Task dashboard
Authentication UI
Notification display
Offline sync support
```

Technologies typically used:

```
React Native or Flutter
Secure storage for tokens
Push notification integration
```

The mobile app sends structured requests to the backend via REST APIs.

---

## Voice Interaction Layer

This layer is responsible for converting **natural speech into structured commands**.

Responsibilities:

```
Speech capture
Speech-to-text conversion
Intent detection
Command parsing
```

Steps:

1. User speaks a command.
2. Speech is converted to text using device or assistant STT engines.
3. The text is sent to the backend voice processing endpoint.

Example voice input:

```
"Remind me to call mom tomorrow at 6pm"
```

Converted to text:

```
remind me to call mom tomorrow at 6pm
```

The backend then processes the text using a **rule-based NLP parser** that extracts:

```
title
date
time
priority
reminder
```

This design avoids early dependency on external AI APIs.

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
Siri captures intent
↓
App Intent triggered
↓
Mobile app sends API request
```

### Google Assistant Integration

Uses:

```
App Actions
Android intents
```

Flow:

```
User speaks command
↓
Assistant resolves intent
↓
App action triggered
↓
Mobile app sends API request
```

Both assistants ultimately trigger the same backend endpoint:

```
POST /v1/voice-input
```

---

## Backend Layer

The backend is responsible for **all business logic, task processing, and integrations**.

Technology stack:

```
Fastify (Node.js)
TypeScript
Prisma ORM
BullMQ
Redis
```

Responsibilities:

```
User authentication
Task management
Voice command processing
Queue management
Data validation
Security enforcement
Assistant integration APIs
```

Key modules:

```
Auth Module
Task Engine
Voice Processing Module
Queue System
Worker Services
```

Main endpoints:

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

Voice commands are processed asynchronously using a queue to ensure the API remains fast.

---

## Database Layer

The system uses **PostgreSQL** as the primary database.

Data is accessed using **Prisma ORM**.

Core entities:

```
User
Task
VoiceInput
```

### User

Stores user identity and authentication data.

Fields:

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
createdAt
updatedAt
deletedAt
```

Sources:

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

## Notification Layer

This layer is responsible for delivering reminders to users.

Two types of notifications are supported:

### Local Notifications

Handled by the mobile application.

Flow:

```
Task created
↓
Reminder timestamp stored
↓
Mobile schedules notification
↓
Notification triggered locally
```

Advantages:

```
Low latency
No server cost
Works offline
```

---

### Future Push Notifications

For cloud reminders:

```
Backend scheduler
↓
Push notification service
↓
Mobile device notification
```

Possible providers:

```
Firebase Cloud Messaging
Apple Push Notification Service
```

---

# Data Flow

Below is the full lifecycle of a voice command.

### Step 1 — User Speech

```
User says:
"Remind me to buy milk tomorrow at 8am"
```

---

### Step 2 — Speech Recognition

Speech is converted to text:

```
buy milk tomorrow at 8am
```

---

### Step 3 — Voice Input API

Mobile app or assistant calls:

```
POST /v1/voice-input
```

Payload:

```
{
"text": "buy milk tomorrow at 8am"
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

The backend pushes a job to Redis queue:

```
voice-processing queue
```

---

### Step 6 — Worker Processing

A worker service consumes the job.

Worker performs:

```
parse voice text
extract date/time
generate task title
```

---

### Step 7 — Task Creation

Worker creates a task:

```
Task table
source = voice
```

Example structured result:

```
title: buy milk
reminderAt: tomorrow 08:00
priority: medium
```

---

### Step 8 — Voice Input Updated

Voice input status becomes:

```
processed
```

---

### Step 9 — Notification Scheduled

Reminder time is stored and notification scheduled on device.

---

# Security Strategy

Security is enforced at multiple layers.

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

Header format:

```
Authorization: Bearer TOKEN
```

---

### Authorization

All protected APIs verify:

```
JWT validity
User ownership of tasks
```

Example protection:

```
/v1/tasks
/v1/voice-input
```

---

### Privacy

Privacy protections include:

```
No raw audio stored
Only text commands saved
User data isolated by userId
Secure token storage
```

---

### Microphone Access

Handled by the mobile OS:

```
User permission required
OS-level security enforced
```

---

# Scalability Strategy

The architecture is designed to scale horizontally.

### Stateless Backend

Fastify servers are stateless and can be scaled using:

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
retry support
horizontal worker scaling
```

Workers can be scaled independently:

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

Future architecture:

```
Global CDN
Regional API clusters
Geo-replicated databases
```

This ensures low latency for global users.

---

### Event-Driven Architecture

Using queues enables:

```
fault tolerance
retry logic
load smoothing
background processing
```

This allows the system to handle **large volumes of voice commands without blocking the API**.

---

The resulting system architecture supports:

```
voice-first interaction
assistant integration
real-time task management
scalable backend processing
secure user data handling
```
