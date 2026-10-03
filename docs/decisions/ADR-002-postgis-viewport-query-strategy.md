# ADR-002: PostGIS Viewport Bounding Box Query Strategy

> **Status**: APPROVED  
> **Date**: 2026-09-26  
> **Deciders**: Engineering Lead, Backend Architect  
> **Consulted**: Technical Architecture Team

---

## Context and Problem Statement

A fundamental flaw of many food discovery applications is attempting to download extensive restaurant catalogs to the mobile device and performing distance sorting and filtering client-side. In urban centers like Metro Manila with tens of thousands of food venues and hundreds of thousands of dishes, downloading full catalogs causes severe bandwidth bloat, high client memory pressure, battery drain, and slow initial rendering.

We must decide how spatial discovery queries are structured, indexed, and constrained between the mobile client and backend.

## Decision Drivers

- **Bandwidth Minimization**: Payload per marker must be `< 100 bytes` so mobile clients on 3G/4G connections can render markers instantaneously.
- **Query Performance**: Database execution time for spatial queries must be `< 80ms` (NFR-07).
- **Scalability**: The system must sustain 100,000+ dishes without query degradation.
- **Strict Bounding Box Constraints**: The server must return only pins visible within the current camera frame.

## Considered Options

1. **Client-Side Distance Calculation (Full Catalog Fetch)**: The mobile app downloads all restaurants in a city and computes Euclidean distance.
2. **Radial Search (`ST_DWithin` from User Location)**: Querying meals within a fixed radius (e.g., 2km) from the user's GPS position.
3. **Viewport Bounding Box Query (`ST_MakeEnvelope` on GIST Index)**: The client transmits the map camera bounding coordinates (`min_lat`, `min_lng`, `max_lat`, `max_lng`) upon pan/zoom idle; the database executes spatial box intersection with budget and category filters.

## Decision Outcome

Chosen option: **Option 3 — Viewport Bounding Box Query (`ST_MakeEnvelope` on GIST Index)**.

The mobile app observes map camera idle events with a **300ms debounce**. Upon idle, it extracts the bounding coordinates and calls the PostGIS stored procedure `get_viewport_meals(min_lat, min_lng, max_lat, max_lng, max_budget, category)`.

Spatial indexing uses PostgreSQL `GIST (location)` on `GEOGRAPHY(Point, 4326)`. Marker payloads are stripped of heavy attributes (descriptions, reviews, operating hours), returning only `{ id, meal_id, title, price, latitude, longitude, thumbnail_url, freshness_tier }`.

### Positive Consequences
- Viewport query payloads are minuscule (typically 2KB–8KB for 50 markers).
- Database spatial index (`GIST`) resolves bounding-box intersections in `< 15ms`.
- Panning to any part of the city automatically streams pins for that area on demand.
- Full meal and restaurant payloads are loaded only when the user explicitly taps a marker.

### Negative Consequences
- Rapid panning generates multiple query requests (mitigated by 300ms debouncing and TanStack Query caching).
- Zooming far out (e.g. whole country) could return too many points (mitigated by hard query `LIMIT 75` and client-side clustering).
