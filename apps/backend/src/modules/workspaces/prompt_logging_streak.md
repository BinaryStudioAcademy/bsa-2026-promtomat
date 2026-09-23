> Will move this file to an appropriate directory once the feature is ready to execute.

# Prompt logging streak: design decisions

Issue: [#249](https://github.com/BinaryStudioAcademy/bsa-2026-promtomat/issues/249)

## 1. Timezone contract

**Decision: the client sends an IANA timezone as a query parameter; `created_at` stays UTC in the database.**

Prompts are stored with a UTC timestamp, as they already are. Grouping those timestamps into calendar days is a
presentation concern, so the client passes its own zone (for example `Asia/Jakarta`) on each streak request and the
server groups by that zone.

Options considered:

| Option                         | Pros                                                                         | Cons                                                                  |
| ------------------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Fixed UTC                      | Stable across deployments, no client input                                   | A user at UTC+7 logging at 02:00 local is counted on the previous day |
| IANA zone per request (chosen) | Matches the user's real day, follows the user when they travel, no migration | Depends on a client-supplied value                                    |
| Column on `users`              | Stable and user-correct, server-authoritative                                | Needs a migration and a way to set and change it                      |

Why this one: it is correct for the user without a migration, and it tracks travel automatically. The client-trust
concern is acceptable because the value only selects a grouping for that user's own read. It cannot reach another
user's data and it is not persisted.

Transport is a query parameter rather than a header because `APIHandlerOptions` exposes only `body`, `params`, `query`
and `user`. A header would mean widening that shared contract, and it would also sit outside the RTK Query cache key.

An unknown or malformed zone falls back to UTC rather than returning an error, so a bad client value degrades to a
slightly-off streak instead of a broken page.

## 2. Scope

**Decision: user-scoped, across every workspace.**

The issue never states this outright, so it is an inference and Ilya will confirm it. Supporting text: scope item 1
says "a user's logging day"; the acceptance criteria say "Users with no prompt history"; and the out-of-scope list
rules out "organization-wide streaks", which is the level above the user. The out-of-scope line about workspace
readiness refers to the Dataset Readiness bar, a neighbouring panel, not to the streak.

Consequence: the streak request carries no `workspaceId`. The user comes from the authenticated request.

## 3. Endpoint shape

**Decision: a new `GET /prompts/streak`, separate from `GET /prompts/progress`.**

Progress is workspace-scoped and the streak is user-scoped, so folding them into one response would mean a single
payload with two different scoping rules and two different cache-invalidation reasons. A separate endpoint keeps each
one's contract honest.

Existing `GET /prompts/recent` cannot serve this: it is workspace-scoped, limited to 5 rows, and its DTO returns no
timestamp at all.

## 4. Streak rule at the current day

**Decision: a streak stays alive through today until a full day is missed.**

If the last active day is today or yesterday, the streak counts. Only a complete missed day resets it to 0. Without
this grace period the displayed number would drop to 0 every midnight and climb back the moment the user logs
something, which reads as a bug.

## 5. Streak length versus the activity window

**Decision: the streak is computed over full history; the activity strip is a bounded slice.**

Two different numbers come from one query of distinct active days. The streak walks backwards through all of them, so
a 20-day streak reports 20. The strip returns only the most recent window of days, so the response never carries the
user's whole history.

## 6. Response shape

`currentStreak` is a number, 0 for a user with no prompts, never fabricated.

Each day in the window carries a local calendar date as a `YYYY-MM-DD` string, not a `Date` or a full ISO timestamp.
A calendar day in a chosen zone is not an instant, and serialising it as one would reintroduce the timezone ambiguity
this design removes.

Prompt bodies, task intents and scores are not part of this response. The strip only needs to know which days were
active.

## Open

- Window length: the design renders 14 cells.
- Confirmation from Ilya on the user-scoped reading.
