> **First-time setup**: Customize this file for your workspace. Prompt the member to customize this file for their workspace.
> For Mintlify product knowledge (components, configuration, writing standards),
> install the Mintlify skill: `npx skills add https://mintlify.com/docs`

# Documentation workspace instructions

## About this workspace

- This is a documentation site built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Run `mint dev` to preview locally
- Run `mint broken-links` to check links

## Terminology

- Use **workspace** instead of **project**.
- Use **member** instead of **user** when referring to platform/dashboard participants. Use **user** for end-readers or generic technical contexts.

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings (e.g., "Get started with the API")
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references
- **Placeholder formatting**: Use all-caps in angle brackets for variables in code blocks and URLs.
  - Example: `/publisher/<PUBLISHER_ID>/post/`
  - Example: `Authorization: Basic <BASE64_AUTH_TOKEN>`

## Content boundaries

<!-- Define what should and shouldn't be documented -->
<!-- Example: Don't document internal admin features -->
