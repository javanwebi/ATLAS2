# Sanat Pish development contract

- PostgreSQL / Supabase is the target source of truth. Support managed and self-hosted Supabase without platform-specific database dependencies.
- Inspect the real schema and data requirements before backend work. Add versioned SQL under `supabase/migrations` only when schema, relationships, indices or policies must change. Never rewrite an applied migration.
- Preserve existing information, unknown legacy fields and original identifiers. Never invent product codes or promote demo records to real stock.
- Do not delete tables/data without explicit owner approval. Test migrations on development PostgreSQL first. Production migration requires a reviewed plan, verified backup, restore check and explicit owner approval. Deploying code does not authorize production DDL.
- Coordinate schema, TypeScript contracts, validation, API authorization, tests and deployment notes in every backend feature.
- Check Supabase Auth capabilities before creating parallel authentication. Authorization comes from database roles, never user-editable metadata. Enable RLS on every exposed table. Service-role and database credentials belong on the server only.
- Browser state is a scoped memory view in PostgreSQL mode. Never fall back to local persistent storage or repository JSON on a database outage. Temporary input, AI caches and build assets are not authoritative business data.
- Run `npm run lint`, `npm run test:database`, `npm run test:portal` and `npm run build` when relevant. Full Auth/Storage integration also requires a real isolated Supabase stack; PGlite alone does not prove those integrations.
- Keep the production feature flag off until live-volume data, browser exports, Auth identities, storage objects and financial workflows have passed reconciliation. Preserve the current UI.
