# ADR-001: Map Provider Abstraction Layer

> **Status**: APPROVED  
> **Date**: 2026-09-26  
> **Deciders**: Engineering Lead, Product Owner  
> **Consulted**: Technical Architecture Team

---

## Context and Problem Statement

NearBites is a map-first application whose primary discovery viewport is driven by interactive map rendering, marker placement, and user panning. Map rendering providers on React Native (Google Maps via `react-native-maps`, Mapbox/MapLibre, Apple MapKit) have drastically different licensing models, tile pricing tiers, billing unpredictability, and platform-specific capabilities. 

If third-party map SDK types and components leak throughout the codebase, migrating to an alternative provider or self-hosted tile server due to unexpected billing spikes or API policy changes would require an expensive, high-risk refactor.

## Decision Drivers

- **Cost Protection**: Tile billing can escalate quickly with active user panning. We must be able to switch or benchmark tile providers without rewriting UI features.
- **Platform Parity**: Seamless experience across iOS and Android with platform-native gesture smoothness.
- **Decoupled Architecture**: High-level components (e.g. `MealMapCanvas`, `PriceMarker`, `BudgetFilter`) must not depend directly on concrete SDK primitives.

## Considered Options

1. **Direct Coupling to Google Maps (`react-native-maps`)**: Fast to integrate, but tightly couples view components to Google API keys and proprietary props.
2. **Direct Coupling to Mapbox SDK**: Rich vector styling, but complex native build setup and recurring active-user fee structure.
3. **Map Service Boundary Abstraction (`IMapService`)**: Encapsulate marker generation, bounding-box calculation, distance estimation, and tile rendering behind a vendor-neutral facade.

## Decision Outcome

Chosen option: **Option 3 — Map Service Boundary Abstraction (`IMapService`)**.

We establish a strict interface boundary (`IMapService`) that handles all geospatial calculations, coordinate conversions, and bounding-box queries. Concrete map rendering will initially use `react-native-maps` with Google Maps / Apple Maps tiles, but wrapped in a generic `NearBitesMap` component. No domain components or hooks may import vendor map libraries directly.

### Positive Consequences
- Changing tile providers (e.g., from Google Maps to Mapbox or Stadia Maps) requires updating only one adapter class in `services/MapService.ts`.
- Easy unit testing and mocking of map interactions without loading native map binaries.
- Standardized coordinate formats (`latitude`, `longitude` numbers) enforced across client domain code.

### Negative Consequences
- Slight development overhead in defining and maintaining wrapper types.
- Advanced vendor-specific proprietary features (e.g., Google 3D buildings) must be generalized or avoided.
