> **Customize this file**: Tailor this template to your workspace by noting specific contribution types you're looking for, adding a Code of Conduct, or adjusting the writing guidelines to match your style.

# Contribute to the documentation

Thank you for your interest in contributing to our documentation! This guide will help you get started.

## How to contribute

### Option 1: Edit directly on GitHub

1. Navigate to the page you want to edit
2. Click the "Edit this file" button (the pencil icon)
3. Make your changes and submit a pull request

### Option 2: Local development

1. Clone this repository
2. Install the Mintlify CLI: `npm i -g mint`
3. Create a branch for your changes
4. Make changes
5. Navigate to the docs directory and run `mint dev`
6. Preview your changes at `http://localhost:3000`
7. Commit your changes and submit a pull request

Or run this single command to clone, install, and start the preview in one go:

> **Prerequisites before running this command:**
> - [Git](https://git-scm.com/downloads) installed
> - [Node.js v19+](https://nodejs.org) installed
> - SSH key [generated](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) and [added to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

```bash
git clone git@github.com:ThePublive/docs.git && cd docs && npm i -g mint && mint dev
```

For more details on local development, see our [development guide](development.mdx).

## Useful Mintlify commands

| Command | Description |
|---|---|
| `mint dev` | Start the local preview at `http://localhost:3000` |
| `mint dev --port 3333` | Start on a custom port |
| `mint broken-links` | Check for broken internal links |
| `npm mint update` | Update the CLI to the latest version |

## Using AI tools

When using AI coding assistants (Claude Code, Cursor, Windsurf, etc.) to add or edit documentation, always include `.mintlify/AGENTS.md` as context in your prompt. It defines the terminology, style, component usage, and API reference conventions the AI must follow.

Example:
```
@.mintlify/AGENTS.md Add an API reference page for the Category Details endpoint.
```

## Writing guidelines

- **Use active voice**: "Run the command" not "The command should be run"
- **Address the reader directly**: Use "you" instead of "the user"
- **Keep sentences concise**: Aim for one idea per sentence
- **Lead with the goal**: Start instructions with what you want to accomplish
- **Use consistent terminology**: Don't alternate between synonyms for the same concept
- **Include examples**: Show, don't just tell
