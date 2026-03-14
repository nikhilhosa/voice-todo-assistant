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

A voice-first productivity assistant that allows users to create, manage, and complete tasks through natural voice interaction. The system converts spoken commands into structured tasks, schedules intelligent reminders, and interacts with users conversationally to confirm task completion and adapt reminders over time.

## Core Philosophy

* Speak once → task structured automatically
* Voice-first productivity without needing to open the app
* Conversational assistant behavior instead of simple notifications
* Event-driven, scalable backend architecture
* Feature-by-feature development with production-ready implementations
* Human-like reminder interactions designed around behavioral psychology
* Minimal reliance on paid AI APIs through rule-based and open-source NLP

## Target Users

* Busy professionals
* Students
* Individuals managing daily tasks through voice
* Mobile-first users who prefer voice assistants
* Users already relying on Siri or Google Assistant

## Current Development Stage

Backend infrastructure and the core task system are implemented and functioning. Voice command ingestion, asynchronous processing via queue workers, and a Python-based NLP parsing service are operational. A reminder scheduling system has been designed and partially implemented to enable psychologically-informed interactive reminders.

## Key Features Planned

* Intelligent conversational reminder engine
* Adaptive reminders based on user behavior
* Task completion confirmation via conversation
* Recurring task detection
* User interaction tracking for reminders
* Mobile application (React Native or Flutter)
* Push notification system
* Siri App Intents integration
* Google Assistant App Actions integration
* Task analytics and productivity insights
* Multilingual voice command support
* Behavior-learning reminder adjustment
* Context-aware task updates

## Key Features Already Implemented

* Fastify backend server with modular architecture
* JWT authentication with OTP login
* Task CRUD API
* Task completion and soft deletion
* PostgreSQL database with Prisma ORM
* Redis queue system using BullMQ
* Worker-based asynchronous processing
* Voice input API endpoint
* VoiceInput database model
* Python NLP microservice for parsing commands
* Natural-language time parsing using dateparser
* Queue-based voice processing pipeline
* Task creation from voice commands
* Intent detection (create, complete, delete, update task)
* Initial reminder scheduling architecture
* Reminder worker framework

## Technology Stack

Frontend:
Planned (React Native or Flutter mobile application)

Backend:
Node.js
Fastify
TypeScript

Database:
PostgreSQL
Prisma ORM

Voice Processing:
Python NLP microservice
FastAPI
dateparser library
Rule-based NLP logic

Assistant Integration:
Apple Siri (App Intents – planned)
Google Assistant (App Actions – planned)

## System Components

* Mobile Application (planned)
* Backend API Server
* Authentication System
* Task Engine
* Voice Input Module
* Python NLP Parsing Service
* Redis Queue System
* Worker Processing Service
* Reminder Scheduler
* Reminder Engine
* Assistant Integration Layer
* Database Layer
* Notification Delivery System (planned)

## Multilingual Strategy

Voice commands include a language field in the voice input model. The NLP system supports language-specific parsing rules and can be extended using localized NLP models or libraries. Multilingual support will be added incrementally through rule-based parsing and additional language-specific NLP modules.

## Cost Optimization Strategy

* Avoid external AI APIs during early stages
* Use rule-based NLP and open-source Python libraries
* Use PostgreSQL and Redis as open-source infrastructure
* Asynchronous queue architecture to reduce compute load
* Python NLP service instead of paid AI models
* AI services reserved for optional future enhancement

## Known Constraints

* iOS background microphone restrictions
* Assistant integrations must follow Apple and Google platform limitations
* Speech-to-text handled by device or assistant services
* Natural language parsing accuracy limited without advanced AI models
* Push notifications not yet implemented
* Reminder interactions currently simulated via logs

## Current Focus

Implementing and validating the intelligent reminder engine that schedules preparation, main, and follow-up reminders, and enabling conversational task confirmation and behavioral reminder design.

## Next Step

Fix and validate the NLP time extraction pipeline so that parsed reminder timestamps correctly populate task `dueDate` and `reminderAt` fields, enabling the reminder scheduler to generate reminders automatically.
