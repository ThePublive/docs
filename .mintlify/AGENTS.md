# Documentation workspace instructions

## About this workspace

- This is a documentation site built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Run `mint dev` to preview locally
- Run `mint broken-links` to check links

## Target Audience & Voice

- Write for developers with 1-3 years of experience. Don't oversimplify, but explain non-obvious platform-specific concepts (like Maker-Checker workflows).
- Use active voice and second person ("you").
- Keep sentences concise — one idea per sentence.

## Terminology

- Use **workspace** instead of **project**.
- Use **member** instead of **user** when referring to platform/dashboard participants. Use **user** for end-readers or generic technical contexts.
- This site documents two distinct products — never use bare "Publive" when the product is ambiguous:
  - **Publive DXP** — the headless CMS product (`documentation/`, `api-reference/`, existing `Documentation` / `Guides` / `API Reference` tabs).
  - **Publive AXP** — the AI-visibility product (`axp/` folder), made up of two sub-products: **AXP Edge** and **AI Streams**.
- AXP docs are customer/technical-facing (setup, configuration, dashboard usage, FAQ). Do not port over pricing tables, ROI/case-study stats, competitor comparisons, or sales objection-handling copy from the marketing site.
- Capitalize features correctly (e.g., **Webhooks**, **Custom Entities**).
- Always refer to authentication as **Basic Auth** rather than legacy username/password.

## Style preferences

- Use sentence case for headings (e.g., "Get started with the API")
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references
- **Placeholder formatting**: Use all-caps in angle brackets for variables in code blocks and URLs.
  - Example: `/publisher/<PUBLISHER_ID>/post/`
  - Example: `Authorization: Basic <BASE64_AUTH_TOKEN>`

## Code Standards & Examples

- Use realistic values in JSON examples (e.g., `"title": "My First Post"`), not `foo/bar` placeholders.
- Always include both success and error response examples for all API endpoints.
- Ensure all API request snippets include the `Authorization: Basic <BASE64_AUTH_TOKEN>` header.
- Use JavaScript/TypeScript for generic code examples unless otherwise requested.

## Document Structure & Layout

- **Prerequisites**: Guides must include a Prerequisites section at the top if API keys, specific configurations, or prior setups are required.
- **API Endpoints**: Must always explicitly document rate limits, authentication requirements, and common error codes.
- **Next Steps**: Include a Next Steps section at the bottom of long tutorials linking to related workflows.

## Mintlify Components & UI

- **Expandables**: Use `<Accordion>` or `<AccordionGroup>` for secondary details, large API responses, or long code snippets.
- **Code Block Expandables**: All long code blocks (e.g., full implementation files, modules over 30 lines) must use the `expandable` attribute on the fence line (e.g., ` ```tsx middleware/routeToPublive.ts expandable `).
- **Callouts**: Use Mintlify's `<Note>`, `<Warning>`, `<Info>`, and `<Tip>` components for important context.
- **Diagrams**: Always use modern `mermaid` code boxes for architecture or workflows. DO NOT use ASCII art or static placeholder images.

## Linking Rules

- **Internal Links**: Always use absolute paths from the root without the file extension (e.g., `[Billing](/settings/billing)` instead of `[Billing](./billing.mdx)`).
- **Contact & Support Links**: Wherever text mentions contacting support, Publive, or a CSM (e.g., "contact Publive", "contact support", "talk to Publive"), it must include an explicit link to the contact/support page. Which link depends on the audience:
  - **New client / entry point** (prospective clients, general product inquiries, requesting a new capability be enabled) — link to `https://axp.thepublive.com/contact` (e.g., `[contact Publive](https://axp.thepublive.com/contact)`).
  - **Existing client technical support** (setup/integration guides for clients already onboarded, e.g. AXP Edge CDN setup) — link to `mailto:support@thepublive.com` (e.g., `[support@thepublive.com](mailto:support@thepublive.com)`).

## API Reference conventions

**Structural change:** the Content Delivery API and Content Management API sections (`dxp/api-reference/content-delivery/`, `dxp/api-reference/content-management/`) are no longer individual per-endpoint `.mdx` files. They are generated from two OpenAPI 3.1 specs:

- `openapi/content-delivery.json` — all Content Delivery (CDS) endpoints
- `openapi/content-management.json` — all Content Management (CMS) endpoints, including categories, tags, posts, live blogs, media, custom content types, custom components, forms, reader, and newsletter

Only `README.mdx` overview pages remain as hand-written MDX per resource group (narrative content, endpoint tables, shared object field tables) — never delete these when touching an endpoint. Everything else is spec-driven.

**The `dxp/api-reference/deprecated/` section is the sole exception** and still uses the legacy `api:` frontmatter MDX pattern described under "Deprecated endpoints" below. Do not migrate it without explicit instruction.

### Editing an existing endpoint

- To change parameters, request/response schemas, descriptions, or examples for an active (non-deprecated) endpoint, edit its operation in the relevant `openapi/*.json` file directly — do not create an `.mdx` file for it.
- Every operation must keep: `operationId` (unique across the spec), `summary` (matches the sidebar/page title), `tags` (matches its `docs.json` subgroup name), and `x-mint: { "href": "..." }` pinning its exact public URL (e.g. `/dxp/api-reference/content-management/media/update-media`). Never change an operation's `x-mint.href` casually — it's a live, indexed, public URL; if a URL genuinely must move, add a redirect in `docs.json`'s `redirects` array.
- Security: both specs default to `basicAuth` (HTTP Basic) via top-level `security`. Override per-operation only when the real endpoint differs — e.g. `security: []` for the reader/newsletter public flows, or the dedicated `formSubmissionAuth` apiKey scheme for form submission.
- Request `Content-Type` must match what the real API actually requires per endpoint — most are `application/json`, but verify against real behavior (support tickets, curl repros) rather than assuming; several Media Library and form-submission endpoints require `multipart/form-data` or `application/x-www-form-urlencoded` instead. Getting this wrong reintroduces the exact bug this migration was built to fix.
- After any spec edit: validate the file (`npx --yes --package=@apidevtools/swagger-cli -c "swagger-cli validate openapi/<file>.json"`), then run `mint validate` and `mint broken-links` for the whole site before considering the change done.

### `docs.json` wiring

- Each top-level API group (`"Content Delivery API"`, `"Content Management API"`) declares `"openapi": "openapi/<file>.json"` once; nested subgroups inherit it.
- List individual endpoints as `"METHOD /path"` strings (exact path from the spec, HTTP method uppercase) — not file paths.
- Never list both a raw `"METHOD /path"` nav entry and an `.mdx` file for the same operation in the same build — Mintlify treats that as a conflict.

### Adding a new endpoint

- Add the operation to the appropriate `openapi/*.json` file (with `operationId`, `summary`, `tags`, `x-mint.href` as above), then add its `"METHOD /path"` string to the matching subgroup in `docs.json`. Do not create an `.mdx` file for it.

### Same real endpoint, multiple request content-types (dedicated pages)

Some real endpoints legitimately accept more than one mutually exclusive request `Content-Type` for different use cases (e.g. Media Library's create endpoint: upload a file via `multipart/form-data`, or register an existing URL via `application/x-www-form-urlencoded`). If each variant should get its own dedicated page rather than one page with a content-type switcher:

- **Do not** bind two pages to the same shared operation via `openapi:` frontmatter — Mintlify's playground defaults every page bound to one operation to whichever content-type is listed first in that operation's `requestBody.content`, so both pages end up showing the same (likely wrong) default for at least one of them. This is a known, tested failure mode — see `openapi/media-register-url.json` / `openapi/media-upload-file.json` as the reference example of the fix.
- Instead, create one standalone companion spec file per variant (e.g. `openapi/media-register-url.json`, `openapi/media-upload-file.json`), each declaring the identical real `server` + path + method but only its own single `requestBody` content-type.
- Create one hand-written `.mdx` page per variant with `openapi: "openapi/<companion-file>.json POST /path"` frontmatter (not `api:` — that reintroduces the JSON-default bug), a short intro, a cross-link to the sibling page, and a static example request block matching that variant's content type.
- Register these pages in `docs.json` by file path (like a README), not as a `"METHOD /path"` string, and remove any raw nav entry for the shared operation so it isn't double-listed.
- After creating/editing pages this way, verify with a fresh `mint dev` + curl on the rendered HTML that each page's embedded schema shows only its own content type — grepping for the string's presence alone is not sufficient, since both variants legitimately appear somewhere in a broken page too. Confirm the *count*/default, not just presence.

### Deprecated endpoints

Applies only to `dxp/api-reference/deprecated/`, which still uses the legacy MDX pattern:

- Deprecated endpoints use the `api:` frontmatter field with the full URL and HTTP method (e.g., `api: "GET https://cds.thepublive.com/publisher/{publisher_id}/posts/"`).
- Deprecated page titles must use the `[DEPRECATED]` prefix in the `description` frontmatter field.
- Deprecated pages must open with a `<Warning>` callout naming the replacement endpoint and linking to its page.
- Deprecated pages must include a **Migration** section with a `bash` code block showing the old path and the new recommended path side by side.
- Do not add an `## Authentication` section (documented globally) or a `## Parameters` heading (`<ParamField>` components go directly after the intro paragraph).
- Path parameter placeholders in the `api:` field use `{lower_snake_case}` (e.g., `{publisher_id}`). In prose and code examples, use `<UPPER_SNAKE_CASE>` (e.g., `<PUBLISHER_ID>`).
- Always describe the `publisher_id` path parameter as: "Your Publisher ID" — no variation.
- All response examples must use `<ResponseExample>` with labeled fenced code blocks (e.g., `` ```json 200 ``, `` ```json 401 ``) — never unlabeled blocks. The `401` error response body must always be exactly: `{"detail": "Invalid Auth Credentials"}`.

### Callouts and tables

- Use an `<Info>` callout before parameters to state endpoint-specific constraints (e.g., type restrictions, beta/prod URL differences).
- Use markdown tables — not prose — for documenting sets of filter operators or enumerated field values.

## Content boundaries

- Do not document internal admin portal features.
- Do not document unreleased or deprecated entities (e.g., Dynamic Custom URLs or Array field types) without explicit instructions.
