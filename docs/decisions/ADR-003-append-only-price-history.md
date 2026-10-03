# ADR-003: Append-Only Price History and Data Integrity

> **Status**: APPROVED  
> **Date**: 2026-09-26  
> **Deciders**: Engineering Lead, Product Owner  
> **Consulted**: Technical Architecture Team

---

## Context and Problem Statement

The core value proposition of NearBites is **Price Integrity**. Conventional platforms suffer from obsolete menu prices because prices are entered once and rarely maintained, or overwritten haphazardly without tracking author source, timestamp, or historical trajectory.

When community users or merchants report price increases (e.g., a dish increasing from ₱99 to ₱110), simply updating the `current_price` column destructively would destroy historical records, prevent trend analysis, eliminate inflation metrics, and make it impossible to audit contributor reliability or revert vandalism.

## Decision Drivers

- **Trust & Transparency**: Every price displayed must have an auditable verification trail and freshness timestamp.
- **Vandalism Defense**: Malicious or erroneous price updates must be reviewable and easily reverted.
- **Analytical Value**: Historical pricing trends provide valuable data for local food cost tracking.

## Considered Options

1. **Destructive Overwrite with `updated_at` Timestamp**: Directly update `meals.current_price` and record `NOW()`. Simple, but permanently erases previous price data and source attribution.
2. **Event-Sourced Pricing Engine**: Every price event is an event stream, and `current_price` is computed by replaying events. Highly complex and unnecessary for MVP operational scale.
3. **Append-Only Audit Log (`price_history`) with Staged Updates**: The canonical table `meals` holds the active `current_price` and `last_confirmed_at`, while every change or proposed correction appends an immutable row to `price_history`.

## Decision Outcome

Chosen option: **Option 3 — Append-Only Audit Log (`price_history`) with Staged Updates**.

1. When a user confirms an existing price is still valid, the timestamp is logged in `price_confirmations` and `meals.last_confirmed_at` is updated.
2. When a user proposes a price correction, a new immutable record is inserted into `price_history` preserving `old_price`, `new_price`, `submitted_by`, `source`, and optional `receipt_photo_url`.
3. Canonical `meals.current_price` is only modified when the correction is approved by an administrator or confirmed by multiple independent community scouts.

### Positive Consequences
- Zero data loss: All historical prices, contributors, and timestamps are preserved forever.
- Enables the Price Freshness Tier system (`< 30 days`, `30–90 days`, `> 90 days`).
- Community vandalism cannot immediately corrupt public map prices.

### Negative Consequences
- Slightly increased database storage for audit tables (negligible at MVP scale).
- Requires a two-step moderation or verification flow for price modifications.
