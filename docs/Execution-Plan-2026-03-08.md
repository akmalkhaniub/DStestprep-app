# Product Execution Plan

**Product:** DS Test Prep App  
**Date:** 2026-03-08  
**Status:** Draft for review  
**Companion document:** `docs/PRD-2026-03-08.md`

## 1. Purpose

This document turns the PRD into an execution plan with:

- delivery phases
- epics
- user stories
- acceptance criteria
- implementation sequencing

The goal is to build the app professionally, step by step, starting from the core feature set expected in serious practice and test-prep products.

## 2. Delivery Principles

- Build the learner core before advanced surfaces.
- Keep mobile as the primary learning surface.
- Treat web as a first-class product, but do not let web complexity delay the quiz MVP.
- Keep the backend contract-first and reusable across mobile, web, and admin.
- Ship a demoable increment at the end of each milestone.
- Do not start AI, classroom, or enterprise workflows before the core practice loop proves value.

## 3. Implementation Assumptions

### Product surfaces

- `apps/mobile`: Expo + React Native learner app
- `apps/web`: Next.js learner web app
- `apps/admin`: Next.js admin and instructor app
- `services/api`: FastAPI backend

### Core technical decisions

- Monorepo with `pnpm` workspaces and Turborepo
- Shared API contracts and schemas
- PostgreSQL as the system of record
- Redis for cache and job coordination
- S3-compatible storage for media and export artifacts
- Clerk as default auth choice unless replaced later
- Sentry and PostHog from the start

### Current repo note

The current repository is an Expo starter app. Phase 0 includes reorganizing it into the monorepo shape above.

## 4. Delivery Phases

| Phase | Name | Outcome |
|---|---|---|
| 0 | Foundation | Monorepo, environments, auth, domain model, shared contracts |
| 1 | Core Learner MVP | Topic-based quiz flow with explanations and hints |
| 2 | Retention Loop | Progress dashboard, weak-topic detection, review queue |
| 3 | Premium Study | Offline packs, code/SQL items, richer analytics |
| 4 | Advanced Personalization | AI tutor and study planning |
| 5 | Instructor and Admin | Authoring, publishing, analytics, class mode |
| 6 | Advanced Classroom | Offline/local classroom delivery and governance |

## 5. Recommended Release Order

### Release A: Foundation

- EPIC-01 Monorepo and environments
- EPIC-02 Auth and identity
- EPIC-03 Learning domain and content pipeline

### Release B: Core learner MVP

- EPIC-04 Learner onboarding and home
- EPIC-05 Quiz session engine
- EPIC-06 Feedback and hint system
- EPIC-07 Analytics instrumentation v1

### Release C: Retention and value loop

- EPIC-08 Progress dashboard
- EPIC-09 Review queue and notifications
- EPIC-10 Learner web parity for core flows

### Release D: Premium study

- EPIC-11 Offline study packs
- EPIC-12 Code and SQL practice v1
- EPIC-13 Subscription and entitlements

### Release E: Advanced differentiation

- EPIC-14 AI tutor
- EPIC-15 Smart study planner

### Release F: Instructor and institution

- EPIC-16 Admin foundation
- EPIC-17 Content authoring and publishing
- EPIC-18 Classroom live mode

### Release G: Advanced classroom and governance

- EPIC-19 Offline/local class mode
- EPIC-20 Governance, audit, and enterprise controls

## 6. Epic Backlog

## EPIC-01: Monorepo and Environments

**Goal**  
Create a scalable project structure that supports mobile, web, admin, and backend development without repo sprawl.

**Priority**  
P0

**Dependencies**  
None

**User stories**

- `US-01.1` As an engineer, I want the current Expo app moved into `apps/mobile` so the repository can support additional applications cleanly.
- `US-01.2` As an engineer, I want `apps/web`, `apps/admin`, and `services/api` scaffolds so we can develop all surfaces in parallel.
- `US-01.3` As an engineer, I want shared TypeScript, linting, and environment config so code quality is consistent across the repo.
- `US-01.4` As an engineer, I want CI to run lint, typecheck, and tests so bad changes are caught before merge.

**Acceptance criteria**

- Monorepo boots all apps and services locally.
- Shared config packages are in place.
- CI runs on pull requests.
- Repo structure supports future package sharing without circular dependency risk.

## EPIC-02: Auth and Identity

**Goal**  
Provide a secure authentication base for students, instructors, and admins.

**Priority**  
P0

**Dependencies**  
EPIC-01

**User stories**

- `US-02.1` As a student, I want to sign up and log in on mobile and web so my progress is saved.
- `US-02.2` As a returning user, I want my session to persist securely so I do not need to log in repeatedly.
- `US-02.3` As an admin, I want protected admin routes so learner accounts cannot access internal tools.
- `US-02.4` As the system, I want role claims for student, instructor, and admin so authorization can scale later.

**Acceptance criteria**

- Mobile and web both support sign in, sign up, sign out, and password reset or equivalent managed flow.
- Protected routes are enforced on web and by API authorization.
- Session handling is secure on mobile and web.
- Basic RBAC claims are present in the auth model.

## EPIC-03: Learning Domain and Content Pipeline

**Goal**  
Define the core data model for subjects, topics, questions, quizzes, attempts, and analytics events.

**Priority**  
P0

**Dependencies**  
EPIC-01, EPIC-02

**User stories**

- `US-03.1` As a product team, I want a stable subject-topic-question schema so all learner features use a consistent content model.
- `US-03.2` As a content team, I want seed import support so initial subjects can be loaded quickly.
- `US-03.3` As the system, I want question metadata for difficulty, explanation, and hints so feedback and analytics can work.
- `US-03.4` As the system, I want version-aware content identifiers so future edits do not break active attempts.

**Acceptance criteria**

- Database schema exists for users, subjects, topics, questions, quizzes, attempts, and events.
- API contracts exist for content retrieval and attempt submission.
- Seed import works for at least one test dataset.
- Content schema supports explanations and hint ladders from day one.

## EPIC-04: Learner Onboarding and Home

**Goal**  
Let students enter the product, select interests, and reach useful practice quickly.

**Priority**  
P0

**Dependencies**  
EPIC-02, EPIC-03

**User stories**

- `US-04.1` As a student, I want to choose my main subjects during onboarding so the app can personalize my home experience.
- `US-04.2` As a student, I want to see a clear home screen with recommended next actions so I know where to start.
- `US-04.3` As a student, I want to browse subjects and topics so I can enter practice without confusion.

**Acceptance criteria**

- New users can complete onboarding in a few steps.
- Home screen displays recent activity, recommended topics, and a direct practice CTA.
- Topic browsing works on mobile and web.

## EPIC-05: Quiz Session Engine

**Goal**  
Deliver the core practice loop.

**Priority**  
P0

**Dependencies**  
EPIC-03, EPIC-04

**User stories**

- `US-05.1` As a student, I want to start a quiz from a topic so I can practice immediately.
- `US-05.2` As a student, I want large, mobile-friendly answer controls so the quiz is easy to use on a phone.
- `US-05.3` As a student, I want my in-progress session preserved so I can resume later.
- `US-05.4` As a student, I want support for MCQ, multi-select, true/false, and short-answer items so the app covers common assessment types.

**Acceptance criteria**

- Users can start, answer, submit, and complete a quiz session.
- Sessions support resumability.
- Core question types work on mobile and web.
- Submission and navigation feel responsive on mid-range devices.

## EPIC-06: Feedback and Hint System

**Goal**  
Provide immediate learning value after each answer.

**Priority**  
P0

**Dependencies**  
EPIC-05

**User stories**

- `US-06.1` As a student, I want immediate correctness feedback so I can learn quickly.
- `US-06.2` As a student, I want a concise explanation after each attempt so I understand the concept, not just the answer.
- `US-06.3` As a student, I want hints that become progressively stronger so I can recover without being given the answer too early.
- `US-06.4` As the product team, I want hint usage tracked so we can measure where learners struggle.

**Acceptance criteria**

- Correctness and explanation render immediately after submission.
- Hint ladder supports at least three levels.
- Hint usage is logged for analytics.
- UX prevents explanation overload and keeps the student moving.

## EPIC-07: Analytics Instrumentation v1

**Goal**  
Capture the behavior needed to measure usage, learning, and drop-off.

**Priority**  
P0

**Dependencies**  
EPIC-04, EPIC-05, EPIC-06

**User stories**

- `US-07.1` As a product team, I want analytics events for quiz start, answer submit, hint use, and completion so we can understand the learner funnel.
- `US-07.2` As a product team, I want mobile and web events normalized so reporting is comparable.
- `US-07.3` As an engineer, I want analytics instrumentation to be typed and documented so event drift is controlled.

**Acceptance criteria**

- Core events are tracked from both mobile and web.
- Event schema is documented.
- Dashboards can answer basic activation and completion questions.

## EPIC-08: Progress Dashboard

**Goal**  
Show learners where they stand and what needs work.

**Priority**  
P0

**Dependencies**  
EPIC-07

**User stories**

- `US-08.1` As a student, I want to see my accuracy by topic so I know my weak areas.
- `US-08.2` As a student, I want to see recent activity and completion trends so I can monitor consistency.
- `US-08.3` As a student, I want recommended next topics so I do not need to decide manually every time.

**Acceptance criteria**

- Dashboard displays topic-level performance.
- Weak topics are highlighted.
- Recommendation logic returns next-practice suggestions.

## EPIC-09: Review Queue and Notifications

**Goal**  
Turn the app from a quiz tool into a revision system.

**Priority**  
P0

**Dependencies**  
EPIC-08

**User stories**

- `US-09.1` As a student, I want a due-today review queue so I know exactly what to revise.
- `US-09.2` As a student, I want missed or weak questions to reappear so I reinforce weak knowledge.
- `US-09.3` As a student, I want reminder support so I return consistently.

**Acceptance criteria**

- Review queue is generated from learner performance.
- Weak or incorrect items are rescheduled.
- Notification hooks exist, even if reminder campaigns start simple.

## EPIC-10: Learner Web Parity for Core Flows

**Goal**  
Provide a serious browser-based learner experience without blocking mobile-first delivery.

**Priority**  
P0

**Dependencies**  
EPIC-04 through EPIC-09

**User stories**

- `US-10.1` As a learner, I want to log in and practice from the browser so I can use the app on laptops and desktops.
- `US-10.2` As a learner, I want my progress shared between mobile and web so the experience feels unified.
- `US-10.3` As a learner, I want the browser experience to support the same core flows as mobile so it does not feel second class.

**Acceptance criteria**

- Learners can sign in, browse, practice, and view progress on web.
- Progress sync is shared across surfaces.
- Web performance and responsiveness meet product quality expectations.

## EPIC-11: Offline Study Packs

**Goal**  
Allow learners to study without reliable connectivity.

**Priority**  
P1

**Dependencies**  
EPIC-05, EPIC-06, EPIC-09

**User stories**

- `US-11.1` As a student, I want to download selected study content so I can practice offline.
- `US-11.2` As a student, I want offline attempts saved locally so no progress is lost.
- `US-11.3` As the system, I want sync retry behavior so offline results upload when connectivity returns.

**Acceptance criteria**

- Users can download eligible packs.
- Offline attempts persist locally.
- Sync retries are reliable and idempotent.

## EPIC-12: Code and SQL Practice v1

**Goal**  
Expand beyond pure quiz items into technical practice aligned to coursework.

**Priority**  
P1

**Dependencies**  
EPIC-03, EPIC-05, EPIC-06

**User stories**

- `US-12.1` As a student, I want output-prediction and code-reasoning questions so the app supports programming courses.
- `US-12.2` As a student, I want SQL interpretation questions so I can prepare for database exams.
- `US-12.3` As a student, I want limited auto-graded technical items so I get feedback beyond MCQs.

**Acceptance criteria**

- At least one code item type and one SQL item type are supported.
- Technical explanations work in the same feedback system.
- Item delivery remains performant on mobile and web.

## EPIC-13: Subscription and Entitlements

**Goal**  
Support free and paid tiers cleanly without damaging the core experience.

**Priority**  
P1

**Dependencies**  
EPIC-08, EPIC-09, EPIC-11, EPIC-12

**User stories**

- `US-13.1` As a free user, I want to understand what is included and what is premium so pricing feels clear.
- `US-13.2` As a paid user, I want premium features unlocked immediately so the subscription feels reliable.
- `US-13.3` As the business, I want entitlements enforced consistently across mobile and web so monetization works.

**Acceptance criteria**

- Entitlements are represented centrally, not hardcoded by surface.
- Free-tier limits and premium access rules are enforced consistently.
- Upgrade flow is understandable and measurable.

## EPIC-14: AI Tutor

**Goal**  
Provide guided help without collapsing into answer dumping or hallucinated teaching.

**Priority**  
P2

**Dependencies**  
EPIC-06, EPIC-08, EPIC-12

**User stories**

- `US-14.1` As a student, I want a guided explanation of why my answer is wrong so I can recover without leaving the app.
- `US-14.2` As a student, I want hints grounded in trusted materials so I can trust the help.
- `US-14.3` As the product team, I want AI safety rules so assessment integrity is preserved.

**Acceptance criteria**

- AI output is retrieval-grounded.
- Responses follow a hint-first pattern.
- Usage, failures, and satisfaction can be measured.

## EPIC-15: Smart Study Planner

**Goal**  
Turn performance data into a structured exam-prep plan.

**Priority**  
P2

**Dependencies**  
EPIC-08, EPIC-09, EPIC-14

**User stories**

- `US-15.1` As a student, I want to set an exam date so the app can prioritize revision.
- `US-15.2` As a student, I want a weekly plan based on my weak areas so I use study time well.
- `US-15.3` As a student, I want the plan to adapt as I improve so it stays useful.

**Acceptance criteria**

- Users can set target dates.
- Planner produces actionable daily or weekly recommendations.
- Plan changes reflect current performance.

## EPIC-16: Admin Foundation

**Goal**  
Stand up the admin surface and shared operational model for future instructor workflows.

**Priority**  
P2

**Dependencies**  
EPIC-01, EPIC-02, EPIC-03

**User stories**

- `US-16.1` As an admin, I want a protected admin app so internal workflows are separated from learner surfaces.
- `US-16.2` As an admin, I want organization, role, and environment settings so administration has a solid foundation.
- `US-16.3` As the engineering team, I want audit-friendly admin patterns so future changes are traceable.

**Acceptance criteria**

- Admin app has auth, routing, navigation, and protected access.
- Core admin layout and role model exist.
- Administrative actions can be audited later without redesign.

## EPIC-17: Content Authoring and Publishing

**Goal**  
Enable structured creation and controlled publishing of practice content.

**Priority**  
P2

**Dependencies**  
EPIC-16

**User stories**

- `US-17.1` As an instructor or content manager, I want to create and edit questions so content can grow systematically.
- `US-17.2` As an instructor or content manager, I want explanations and hints attached to questions so quality remains high.
- `US-17.3` As an admin, I want versioned publishing so content updates do not break active learners.

**Acceptance criteria**

- Admin users can create, edit, validate, and publish content.
- Question schema validation prevents broken content.
- Publishing is version-aware.

## EPIC-18: Classroom Live Mode

**Goal**  
Support teacher-led live quiz sessions over the internet.

**Priority**  
P3

**Dependencies**  
EPIC-16, EPIC-17

**User stories**

- `US-18.1` As an instructor, I want to host a live quiz so I can check understanding in class.
- `US-18.2` As a student, I want to join by code or QR so classroom entry is fast.
- `US-18.3` As an instructor, I want aggregate response visibility so I can adjust teaching in real time.

**Acceptance criteria**

- Session creation, join, pacing, and end flows work.
- Join experience is fast and low-friction.
- Instructor sees aggregate results during the session.

## EPIC-19: Offline and Local Class Mode

**Goal**  
Support classroom delivery in low-connectivity environments.

**Priority**  
P3

**Dependencies**  
EPIC-18, EPIC-11

**User stories**

- `US-19.1` As an instructor, I want a local session mode so I can run a live quiz without dependable internet.
- `US-19.2` As a student, I want to join the local class session reliably so I can participate even when connectivity is poor.
- `US-19.3` As the system, I want offline session results synced later so reporting remains complete.

**Acceptance criteria**

- Local session architecture is defined and tested.
- Join and answer flows work in target delivery modes.
- Session ledgers sync later without data loss.

## EPIC-20: Governance, Audit, and Enterprise Controls

**Goal**  
Prepare the product for institutional trust, compliance, and operational maturity.

**Priority**  
P3

**Dependencies**  
EPIC-16 through EPIC-19

**User stories**

- `US-20.1` As an admin, I want audit logs for important actions so the platform is governable.
- `US-20.2` As an institution, I want role-based administrative access so sensitive data is controlled.
- `US-20.3` As an organization, I want policy controls around AI and classroom use so deployment risk is manageable.

**Acceptance criteria**

- Audit logging exists for key admin actions.
- RBAC is enforced for internal workflows.
- Governance controls exist for sensitive platform features.

## 7. MVP Scope Recommendation

The first true MVP should include:

- EPIC-01 Monorepo and environments
- EPIC-02 Auth and identity
- EPIC-03 Learning domain and content pipeline
- EPIC-04 Learner onboarding and home
- EPIC-05 Quiz session engine
- EPIC-06 Feedback and hint system
- EPIC-07 Analytics instrumentation v1
- EPIC-08 Progress dashboard
- EPIC-09 Review queue and notifications

Optional for MVP if team velocity is strong:

- EPIC-10 Learner web parity for core flows

Do not include in the first MVP:

- AI tutor
- class mode
- offline classroom delivery
- enterprise governance

## 8. Suggested Sprint-Level Sequence

### Sprint 1

- Monorepo restructure
- mobile app moved to `apps/mobile`
- scaffold `apps/web`, `apps/admin`, `services/api`
- baseline CI and shared config

### Sprint 2

- auth integration
- base database schema
- subject, topic, question contracts
- seed content loading

### Sprint 3

- onboarding
- home screen
- topic browse flow
- quiz session shell

### Sprint 4

- core question types
- answer submission
- explanations
- hint ladder

### Sprint 5

- analytics events
- progress dashboard
- weak-topic logic

### Sprint 6

- review queue
- polish and bug fixing
- launch-readiness pass for the learner MVP

## 9. Story Writing Standard

Use this format for implementation tickets:

- Story ID
- User role
- Goal
- Business value
- Dependencies
- Acceptance criteria
- Analytics events affected
- Platforms affected

Example:

`US-05.1` As a student, I want to start a quiz from a topic so I can practice immediately.

## 10. Definition of Done

A story is done only when:

- code is merged
- relevant tests pass
- analytics events are instrumented if needed
- loading and error states are handled
- mobile and web behavior are verified when the story is cross-platform
- documentation is updated if architecture or contracts changed

## 11. Immediate Next Documents Recommended

After this execution plan, the next useful docs are:

- system architecture document
- API contract draft
- database schema draft
- analytics event taxonomy
- content model specification
- MVP sprint board or backlog

## 12. Final Recommendation

The best professional path is:

1. build the learner core
2. make it sticky with progress and review
3. add premium study features
4. add AI only after the product earns trust
5. add instructor and classroom layers after the learner product is stable

This sequence keeps scope under control and gives the team a practical build order with clear epics and user stories.
