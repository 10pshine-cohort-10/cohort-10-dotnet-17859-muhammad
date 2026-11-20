# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19 + TypeScript + Vite + Tailwind CSS 4, backed by an ASP.NET Core 10 API. Delegated:
the required assignment stack, with Vite chosen over Next.js because the app is an
authenticated dashboard that needs no server rendering.

## Users

Individuals managing their own workload: they capture tasks, decide what to do next, and
keep due dates from slipping. A separate Admin role exists for oversight and support — it
sees and manages every task and every user, but is not the primary daily user.

## Product Purpose

Docket is a task workspace. It exists so a person can see, in one glance, what is due, what
is in progress, and what is finished, then act without ceremony. Success means the dashboard
is trustworthy enough to open every morning and the task flow is fast enough to use without
thinking about the tool.

## Positioning

One workspace with exactly two roles and no collaboration machinery. A User sees only their
own tasks; an Admin sees the whole board. There are no teams, mentions, or shared spaces to
configure, so the interface stays a personal ledger rather than a project-management suite.

## Operating Context

Used at a desk in daylight, mostly on a laptop, occasionally on a phone. Sessions are short
and frequent: check the day, update a status, add a task, close the tab. The product is also
demonstrated live to reviewers, so empty, loading, and error states must look intentional
rather than unfinished.

## Capabilities and Constraints

- Registration, login, logout, refresh, and a profile screen.
- Task CRUD with status, priority, category, due date, and assignee.
- Dashboard counts by status: user-scoped for `User`, global for `Admin`.
- Search, filtering, sorting, comments, notifications, and realtime updates arrive later;
  they are not part of the first release.
- Two roles only: `Admin` and `User`.
- Web only. No native desktop or mobile app.
- WCAG 2.2 AA is required, including keyboard navigation, visible focus, and reduced motion.
- The API is the single source of truth; the client holds no task data that is not confirmed
  by the server.

## Brand Commitments

The name is Docket. The voice is calm, exact, and unsentimental: labels name the action, errors
name the problem and the recovery, and nothing is gamified. No streaks, badges, confetti, or
productivity moralizing.

## Evidence on Hand

No real user data, testimonials, or customer claims exist. Demo content will be seeded and
labelled synthetic. Future work must not invent customers, benchmarks, or usage numbers.

## Product Principles

1. One glance answers "what needs me now?"
2. Every action is reversible or confirmed; none is a trap.
3. Density serves scanning, not decoration.
4. The same interface works for one person and for an admin looking at everyone.
5. Polish lives in the states: empty, loading, error, and long content are first-class.

## Accessibility & Inclusion

WCAG 2.2 AA. Full keyboard path through auth, navigation, and task flows; visible focus;
live regions for asynchronous feedback; respect `prefers-reduced-motion`; contrast checked
against the actual tokens rather than assumed.
