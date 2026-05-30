# Graph Report - frontend  (2026-05-30)

## Corpus Check
- 21 files · ~4,249 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 101 nodes · 167 edges · 9 communities (5 shown, 4 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3d4f6bbd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]

## God Nodes (most connected - your core abstractions)
1. `Categories` - 17 edges
2. `Category` - 13 edges
3. `AuthService` - 11 edges
4. `Layout` - 10 edges
5. `AuthService` - 8 edges
6. `Application Routes` - 7 edges
7. `Layout (App Shell Component)` - 7 edges
8. `CategoriesService` - 6 edges
9. `Login` - 5 edges
10. `authGuard (CanActivateFn)` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Layout (App Shell Component)` --implements--> `Responsive App Shell (Rail + Drawer)`  [EXTRACTED]
  src/app/layout/layout.ts → src/app/layout/layout.html
- `Login Component` --implements--> `Keyboard-First Accessibility Pattern`  [EXTRACTED]
  src/app/modules/auth/login/login.ts → src/app/modules/auth/login/login.html
- `AssetWisePreset (PrimeNG Theme)` --conceptually_related_to--> `Keyboard-First Accessibility Pattern`  [INFERRED]
  src/app/theme/asset-wise-preset.ts → src/app/modules/auth/login/login.html
- `Layout (App Shell Component)` --implements--> `Signal-Based State Management`  [INFERRED]
  src/app/layout/layout.ts → src/app/modules/auth/services/auth.service.ts
- `authGuard (CanActivateFn)` --semantically_similar_to--> `guestGuard (CanActivateFn)`  [INFERRED] [semantically similar]
  src/app/modules/auth/guards/auth.guard.ts → src/app/modules/auth/guards/guest.guard.ts

## Hyperedges (group relationships)
- **Authentication Flow** — login_Login, authservice_AuthService, authmodel_AuthUser, authguard_authGuard, guestguard_guestGuard [EXTRACTED 0.95]
- **App Shell and Navigation** — layout_Layout, icon_LayoutIcon, categories_Categories, authservice_AuthService [EXTRACTED 0.85]
- **Bootstrap and Routing Configuration Chain** — main_bootstrap, appconfig_appConfig, approutes_routes, preset_AssetWisePreset [EXTRACTED 0.95]

## Communities (9 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.20
Nodes (7): routes, authGuard(), guestGuard(), AuthUser, LoginRequest, LoginResponse, AuthService

### Community 1 - "Community 1"
Cohesion: 0.15
Nodes (21): App (Root Component), appConfig (ApplicationConfig), Application Routes, authGuard (CanActivateFn), AuthUser / Login Models, AuthService, Categories Component, Shared Design Token Language (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.31
Nodes (4): App, appConfig, authInterceptor(), AssetWisePreset

### Community 4 - "Community 4"
Cohesion: 0.21
Nodes (5): CategoriesService, ApiResponse, Category, CategoryRequest, environment

### Community 6 - "Community 6"
Cohesion: 0.70
Nodes (3): IconName, LayoutIcon, NavItem

## Knowledge Gaps
- **5 isolated node(s):** `environment`, `App (Root Component)`, `LayoutIcon Component`, `Categories Component`, `Environment Config (apiBaseUrl)`
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Categories` connect `Community 7` to `Community 4`?**
  _High betweenness centrality (0.160) - this node is a cross-community bridge._
- **Why does `Layout` connect `Community 2` to `Community 6`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `AuthService` connect `Community 0` to `Community 3`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **What connects `environment`, `App (Root Component)`, `LayoutIcon Component` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.14761904761904762 - nodes in this community are weakly interconnected._