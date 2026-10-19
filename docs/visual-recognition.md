# Industrial image recognition

The image identification route uses this pipeline: uploaded image → multimodal observation → local retrieval across real imported warehouse SKUs → candidate comparison → evidence policy → exact and similar result lists. The legacy `AT-E...` catalogue is not an inventory source. Invented demo variants absent from the original import are excluded. Admin edits to existing inventory are refreshed for new requests.

## Server configuration

```dotenv
PART_RECOGNITION_WORKER_URL="https://atlas-aishenasaei.javanwebio.workers.dev/"
PART_RECOGNITION_WORKER_TOKEN=""
PART_RECOGNITION_WORKER_TIMEOUT_MS="45000"
ai-forza=""
AI_FORZA_API_KEY=""
```

An unset Worker URL selects the supplied default. An explicitly empty URL disables the Worker. The Worker is attempted first; a configured direct Gemini key is available when the Worker is disabled or fails. Direct key priority: `ai-forza`, `AI_FORZA_API_KEY`, legacy `GEMINI_API_KEY`. The hyphenated name works in dotenv and hosting secret settings; use the uppercase alias for shells. No direct API key is included in Worker requests or client bundles. The optional Worker access token is sent as Bearer authentication and must match the Worker's own configuration.

The example file is never loaded as runtime configuration. Configure production secrets on the actual backend host; committing `.env.example` does not deploy or configure hosting.

## Interpretation

Model confidence, perceptual distance, matching color and matching family photos do not establish a unique SKU. A readable exact warehouse code with high transcription confidence can establish a code match. Dedicated photos require separately verified SKU identity before they can establish an image-based exact match. Existing photo mappings have not been certified as such; the policy therefore does not treat them as identity proof. The admin gallery provides an explicit per-image confirmation checkbox after code binding. Changing the code, replacing the image, or switching to family scope clears the confirmation. No existing images are automatically marked verified. Similar products remain available alongside a confirmed match. If the ranked list has no alternative, existing same-family items are labelled as family alternatives with unverified visual/technical compatibility.

Dimensions without a scale, exact polymer/metal grade, hidden geometry and conformity to standards must not be inferred as facts. Result specifications come from the matched inventory row. Unavailable AI is explicitly labelled; failure to confirm a match is not proof that the product is out of stock or absent. Availability text does not promise stock or custom manufacture.

## Verification, 2026-10-19

- Unit tests cover Worker selection/disable, key aliases, real inventory filtering, confidence downgrade, shared photo ambiguity, exact code plus alternatives, multimodal transport, and malformed/error responses.
- Public Worker metadata reports a configured Gemini key, but an unauthenticated POST to `/v1/chat/completions` returned `unauthorized` / `دسترسی به Worker مجاز نیست.`. No valid Worker access token or direct API key was present in this workspace. Live model recognition cannot be certified until the Worker token or a direct key is configured. No production deployment is implied by a Git commit.
