-------------------Master Prompt----------------------------------------

Act as a Senior Software Architect and Technical Documentation Engineer.

Analyze this entire conversation and extract only the essential technical information required to continue development in a future session.

Ignore brainstorming discussions, repeated explanations, and unnecessary text.

Generate a clean documentation file for:

docs/PROJECT_CONTEXT.md

Structure the output exactly as follows.

# Project Context

## Project Name
(name of the project)

## App Concept
(short explanation of the idea)

## Core Philosophy
(main design philosophy and user experience goals)

## Target Users
(list the main user groups)

## Current Development Stage
(explain what stage the project is currently in)

## Key Features Planned
(list important features planned for the product)

## Key Features Already Implemented
(list features already implemented or designed)

## Technology Stack
Frontend:
Backend:
Database:
Voice Processing:
Assistant Integration:

## System Components
(list major modules like mobile app, backend API, voice parser, assistant integration, etc.)

## Multilingual Strategy
(explain how languages will be supported)

## Cost Optimization Strategy
(explain how the project avoids expensive services)

## Known Constraints
(list technical limitations such as iOS restrictions, background microphone limitations, etc.)

## Current Focus
(what feature is currently being worked on)

## Next Step
(the very next development step)

Output ONLY the markdown file content.
Do not include extra explanations.


-------------------Master Prompt----------------------------------------

# Project Context

## Project Name

Voice-First Smart To-Do Assistant

## App Concept

A voice-first productivity system that allows users to create and manage tasks by speaking naturally. The assistant captures spoken commands, converts them into structured tasks, and stores them in a task management backend. The system integrates with mobile assistants such as Siri and Google Assistant so users do not need to open the app.

## Core Philosophy

* Speak once → task structured automatically
* No need to open the app for task creation
* Voice-first productivity experience
* Clean, scalable architecture
* Feature-by-feature development
* Production-ready implementations (no placeholders or demo shortcuts)
* Cost-efficient infrastructure with minimal reliance on paid AI APIs

## Target Users

* Individual productivity users
* Busy professionals
* Students
* Mobile-first users who prefer voice commands
* Users already relying on Siri / Google Assistant

## Current Development Stage

Backend infrastructure and core task system are implemented.
Authentication and task APIs are working.
Voice input pipeline architecture is partially implemented (API + queue + worker).
Currently stabilizing the voice processing module and integrating the voice route with the backend.

## Key Features Planned

* Voice task creation via assistants
* Smart natural-language task parsing
* Reminders and notifications
* Multilingual voice commands
* Task prioritization
* Background voice capture through assistants
* AI-assisted task parsing (optional future enhancement)
* Task analytics and productivity insights
* Cross-device synchronization
* Admin/analytics dashboards
* Integration with mobile platforms (React Native or Flutter)

## Key Features Already Implemented

* Backend server using Fastify
* JWT authentication system
* OTP login (phone/email)
* Task CRUD API
* Task completion and soft deletion
* PostgreSQL database with Prisma ORM
* Redis queue system using BullMQ
* Worker architecture for asynchronous processing
* Voice input storage system
* Voice processing pipeline architecture
* Rule-based parser concept for task extraction

## Technology Stack

Frontend:
Planned (React Native or Flutter for mobile application)

Backend:
Node.js
Fastify
TypeScript

Database:
PostgreSQL
Prisma ORM

Voice Processing:
Rule-based NLP parser (custom logic)
Redis queue with BullMQ
Worker-based async processing

Assistant Integration:
Apple Siri (App Intents – planned)
Google Assistant (App Actions – planned)

## System Components

* Mobile Application
* Backend API
* Authentication System
* Task Engine
* Voice Input API
* Redis Queue System
* Worker Service
* Voice Parser Engine
* Assistant Integration Layer
* Database Layer
* Notification System (planned)

## Multilingual Strategy

Voice commands will include a language field in the voice input model.
Parsing logic will support language-specific rules.
Future versions may integrate localized parsers or language models to support global users.

## Cost Optimization Strategy

* Avoid external AI APIs in early stages
* Implement rule-based natural language parsing
* Use open-source infrastructure (PostgreSQL, Redis)
* Event-driven worker architecture to reduce compute load
* AI services will only be added as fallback or optional enhancement

## Known Constraints

* iOS background microphone access restrictions
* Assistant integrations must follow Apple and Google platform limitations
* Voice recognition handled by system assistants rather than the app itself
* Natural language parsing accuracy limited without AI models
* Queue and worker infrastructure required for asynchronous processing

## Current Focus

Stabilizing the voice processing module:

* Implementing the `/v1/voice-input` API endpoint
* Storing voice commands in the `VoiceInput` database model
* Sending voice commands to Redis queue
* Processing jobs through a worker service
* Converting voice text into structured tasks using rule-based parsing

## Next Step

Finalize the voice module and ensure the full pipeline works:

Voice Input API → VoiceInput Database → Redis Queue → Worker → Rule Parser → Task Creation

After stabilization, the next development step is improving the rule-based natural language parser to understand common phrases such as time expressions and scheduling commands.
