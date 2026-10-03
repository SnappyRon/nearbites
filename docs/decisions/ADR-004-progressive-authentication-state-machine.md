# ADR-004: Progressive Authentication State Machine and Action Resumption

> **Status**: APPROVED  
> **Date**: 2026-09-26  
> **Deciders**: Engineering Lead, Product Owner, UX Architect  
> **Consulted**: Frontend Architecture Team

---

## Context and Problem Statement

Forcing users to create an account or sign in upon opening a mobile discovery app creates immediate abandonment: up to 60%–70% of potential users drop off before ever seeing a single dish. NearBites must allow 100% public, frictionless food discovery.

However, certain actions (saving favorites, confirming prices, submitting price corrections, contributing new dishes, and reporting listings) inherently require user identity for attribution, spam prevention, and data ownership. If an unauthenticated user attempts one of these actions, prompting login must not discard their work or redirect them to a generic home screen.

## Decision Drivers

- **Zero-Friction Discovery**: 100% of browsing, filtering, search, map exploration, and external navigation must work anonymously.
- **Context Preservation**: When authentication is prompted, the user must return to the exact same screen and their paused intent must execute automatically upon successful login.
- **Security & RLS**: Server-side Row Level Security requires `auth.uid()` for write operations.

## Considered Options

1. **Forced Upfront Registration (Wall)**: Requires sign-up on first launch. High abandonment, directly contradicts product thesis.
2. **Post-Action Prompt without Resumption**: Allow action click, prompt login, and after login redirect to the home screen. Poor UX; forces user to hunt down the meal again.
3. **Progressive Authentication with Memory Interception & Action Resumption**: Intercept the protected action, cache intent in a state machine (`pendingAction`), display a progressive auth modal sheet, and automatically resume the action upon auth state change.

## Decision Outcome

Chosen option: **Option 3 — Progressive Authentication with Memory Interception & Action Resumption**.

We implement a dedicated `useProgressiveAuth` hook coupled with the Zustand `useAuthStore`:

```typescript
type PendingAction = 
  | { type: 'FAVORITE'; mealId: string }
  | { type: 'CONFIRM_PRICE'; mealId: string }
  | { type: 'CORRECTION'; mealId: string }
  | { type: 'CONTRIBUTE' }
  | { type: 'REPORT'; targetId: string; targetType: 'meal' | 'restaurant' };

interface AuthStore {
  session: Session | null;
  pendingAction: PendingAction | null;
  setPendingAction: (action: PendingAction | null) => void;
  executePendingAction: () => void;
}
```

When an anonymous user initiates an action:
1. The hook checks `session`. If `null`, it saves the action object to `pendingAction` in memory and opens `/(modals)/auth`.
2. The user authenticates via Google, Apple, or Magic Link.
3. Upon receiving the `SIGNED_IN` event from Supabase Auth, the modal sheet dismisses automatically, and `executePendingAction()` runs the paused mutation.
4. A celebratory toast appears confirming completion (e.g. "Saved to your favorites!").
5. If the user dismisses the auth modal, `pendingAction` is cleared with zero side effects.

### Positive Consequences
- Maximizes user acquisition and top-of-funnel conversion.
- Eliminates user frustration by preserving context and intent.
- Guarantees backend data integrity by ensuring write actions only occur with valid `auth.uid()`.

### Negative Consequences
- Slightly more complex client state management required for pending action execution.
- Edge cases where session token exchange fails must be handled gracefully without throwing unhandled exceptions.
