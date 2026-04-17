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
- Always use the spelling **Publive** when referring to the product.
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
- **Callouts**: Use Mintlify's `<Note>`, `<Warning>`, `<Info>`, and `<Tip>` components for important context.
- **Diagrams**: Always use modern `mermaid` code boxes for architecture or workflows. DO NOT use ASCII art or static placeholder images.

## Linking Rules

- **Internal Links**: Always use absolute paths from the root without the file extension (e.g., `[Billing](/settings/billing)` instead of `[Billing](./billing.mdx)`).

## Content boundaries

- Do not document internal admin portal features.
- Do not document unreleased or deprecated entities (e.g., Dynamic Custom URLs or Array field types) without explicit instructions.
