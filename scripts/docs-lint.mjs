#!/usr/bin/env node
// Deterministic checks for docs pages, used by the automated docs pipeline
// and safe to run by hand. No dependencies.
//
// Usage:
//   node scripts/docs-lint.mjs <file.mdx> [...]       check these files
//   node scripts/docs-lint.mjs --changed [<base>]      check .mdx files changed vs <base> (default docs/main or origin/main)
//   node scripts/docs-lint.mjs --checklist <files...>  print the screenshot checklist (Markdown) for a PR body
//
// Exit code 1 when any ERROR is found. WARN lines never fail the run.

import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);

// ---------- helpers ----------

function changedFiles(base) {
  const candidates = base ? [base] : ['docs/main', 'origin/main', 'main'];
  for (const b of candidates) {
    try {
      const out = execSync(`git diff --name-only --diff-filter=AM ${b}...HEAD`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
      const staged = execSync('git diff --name-only --diff-filter=AM HEAD', { cwd: ROOT }).toString();
      const untracked = execSync('git ls-files --others --exclude-standard', { cwd: ROOT }).toString();
      return [...new Set((out + staged + untracked).split('\n'))].filter((f) => f.endsWith('.mdx') && /^(dxp|axp)\//.test(f));
    } catch { /* try next base */ }
  }
  throw new Error('Could not find a base branch. Pass one: --changed <base>');
}

function navPages() {
  const docs = JSON.parse(readFileSync(join(ROOT, 'docs.json'), 'utf8'));
  const pages = new Set();
  const walk = (n) => {
    if (typeof n === 'string') pages.add(n);
    else if (Array.isArray(n)) n.forEach(walk);
    else if (n && typeof n === 'object') Object.values(n).forEach(walk);
  };
  walk(docs.navigation);
  return pages;
}

// Blank out fenced code, inline code and MDX comments so prose checks skip them.
// Keeps line numbers stable.
function proseOnly(text) {
  return text
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/`[^`\n]*`/g, (m) => ' '.repeat(m.length));
}

const lineOf = (text, idx) => text.slice(0, idx).split('\n').length;

const PLACEHOLDER_RE = /\{\/\*\s*SCREENSHOT:\s*([\s\S]*?)\*\/\}/g;

function placeholders(text) {
  const out = [];
  for (const m of text.matchAll(PLACEHOLDER_RE)) {
    const parts = m[1].split('|').map((s) => s.trim());
    out.push({
      line: lineOf(text, m.index),
      file: parts[0] || '',
      where: parts[1] || '',
      show: (parts[2] || '').replace(/^show:\s*/i, ''),
      ok: parts.length >= 3 && /^[a-z0-9-]+\.png$/.test(parts[0]),
    });
  }
  return out;
}

// Words allowed to stay capitalised inside a sentence-case heading.
const PROPER = new Set(('Publive DXP AXP API APIs CMS CDS MFA SSO AI Google Discover X Twitter Facebook ' +
  'LinkedIn WhatsApp Telegram Instagram YouTube Slack Webhooks Webhook Custom Entities Entity Content Workflows ' +
  'Media Library Audit Logs Copilot Starter Kit Next.js React Vue Angular Basic Auth FAQ URL URLs JSON HTML CSV ' +
  'SEO RSS AMP OTP ID IDs Edge Monitor Brand Observability Streams ClaimGraph Cloudflare Vercel Akamai Fastly ' +
  'CloudFront Gemini ChatGPT Perplexity Developer Hub Maker-Checker Access Policies Forms Custom Components ' +
  'Content Types Scoring I Owner Owners Admin Admins Editor Editors').split(' '));

// ---------- checks ----------

function lintFile(rel, nav, report) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) return report('ERROR', rel, 0, 'file does not exist');
  const text = readFileSync(abs, 'utf8');
  const prose = proseOnly(text);

  // Frontmatter
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) report('ERROR', rel, 1, 'missing YAML frontmatter at the top of the file');
  else {
    if (!/^title:\s*\S/m.test(fm[1])) report('ERROR', rel, 1, 'frontmatter has no title');
    if (!/^description:\s*\S/m.test(fm[1])) report('ERROR', rel, 1, 'frontmatter has no description');
  }

  // Navigation
  const slug = rel.replace(/\.mdx$/, '');
  const isApiRef = rel.startsWith('dxp/api-reference/');
  if (!nav.has(slug) && !rel.endsWith('changelog.mdx')) {
    report(isApiRef ? 'WARN' : 'ERROR', rel, 1, `page is not listed in docs.json navigation ("${slug}")`);
  }

  // Template leftovers
  for (const pat of ['TEMPLATE:', '<Feature name>', '<Goal,', '<Stage 1 title>', '<Action>', '<outcome>']) {
    const i = text.indexOf(pat);
    if (i >= 0) report('ERROR', rel, lineOf(text, i), `template text left in page: "${pat}"`);
  }

  // Availability (Documentation pages only; guides use Prerequisites)
  const isGuide = /^## Prerequisites/m.test(text);
  const needsAvailability = /^dxp\/documentation\/(concepts-features|content-workflows|distribution)\//.test(rel) || /^axp\/(monitor|axp-edge)\//.test(rel);
  if (needsAvailability && !isGuide && !/^## Availability/m.test(text)) {
    report('WARN', rel, 1, 'no "## Availability" section (required for plan-gated features)');
  }

  // Links
  for (const m of prose.matchAll(/\]\((\.{1,2}\/[^)]*|[^)]*\.mdx(#[^)]*)?)\)/g)) {
    report('ERROR', rel, lineOf(prose, m.index), `relative or .mdx link "${m[1]}" — use an absolute path without extension`);
  }
  for (const bad of ['help.thepublive.com', 'thepublive.com/contact-us']) {
    for (const m of prose.matchAll(new RegExp(bad.replace('.', '\\.'), 'g'))) {
      report('ERROR', rel, lineOf(prose, m.index), `do not link to ${bad}; use mailto:support@thepublive.com`);
    }
  }
  prose.split('\n').forEach((line, i) => {
    if (/\bcontact (support|publive|your csm|us)\b/i.test(line) && !/\]\((mailto:|https:\/\/axp\.thepublive\.com\/contact)/.test(line)) {
      report('WARN', rel, i + 1, 'mentions contacting support without a support link on the same line');
    }
  });

  // Terminology (prose, outside bold UI labels)
  prose.split('\n').forEach((line, i) => {
    if (/^\s*(import |\||<)/.test(line)) return;
    const plain = line.replace(/\*\*[^*]+\*\*/g, '').replace(/\[[^\]]*\]\([^)]*\)/g, '');
    if (/\bpublishers?\b/i.test(plain)) report('WARN', rel, i + 1, 'say "workspace" instead of "publisher" in prose');
    if (/\bprojects?\b/i.test(plain)) report('WARN', rel, i + 1, 'say "workspace" instead of "project"');
  });

  // Sentence-case headings. Words the page itself bolds (UI labels, feature names such as
  // **Smart Rules**) count as proper names.
  const pageProper = new Set();
  for (const m of prose.matchAll(/\*\*([^*\n]+)\*\*/g)) {
    m[1].split(/\s+/).forEach((w) => pageProper.add(w.replace(/[^\w.-]/g, '')));
  }
  prose.split('\n').forEach((line, i) => {
    const h = line.match(/^#{2,4}\s+(.+)$/);
    if (!h) return;
    const words = h[1].replace(/\*\*|[`"“”()]/g, '').split(/\s+/).slice(1);
    const caps = words.filter((w) => {
      const bare = w.replace(/[^\w.-]/g, '');
      return /^[A-Z][a-z]/.test(w) && !PROPER.has(bare) && !pageProper.has(bare);
    });
    if (caps.length >= 1) report('WARN', rel, i + 1, `heading may not be sentence case: "${h[1]}" (${caps.join(', ')})`);
  });

  // Images exist
  for (const m of text.matchAll(/(?:src=["']|\]\()(\/images\/[^"')\s]+)/g)) {
    if (!existsSync(join(ROOT, m[1]))) report('ERROR', rel, lineOf(text, m.index), `image not found: ${m[1]}`);
  }

  // Screenshot placeholders
  for (const p of placeholders(text)) {
    if (!p.ok) report('ERROR', rel, p.line, 'malformed SCREENSHOT placeholder; use {/* SCREENSHOT: name.png | route → clicks | show: what */}');
    else if (existsSync(join(ROOT, 'images', rel.split('/')[0], p.file))) {
      report('WARN', rel, p.line, `images/${rel.split('/')[0]}/${p.file} exists already; swap the placeholder for a <Frame>`);
    }
  }
}

// ---------- main ----------

if (args[0] === '--checklist') {
  const files = args.slice(1);
  let any = false;
  for (const rel of files) {
    const text = readFileSync(join(ROOT, rel), 'utf8');
    for (const p of placeholders(text)) {
      any = true;
      console.log(`- [ ] \`images/${rel.split('/')[0]}/${p.file}\` — ${p.where}. Show: ${p.show} (\`${rel}:${p.line}\`)`);
    }
  }
  if (!any) console.log('_No screenshot placeholders._');
  process.exit(0);
}

let files;
if (args[0] === '--changed') files = changedFiles(args[1]);
else files = args;
const skipped = files.filter((f) => !f.endsWith('.mdx'));
if (skipped.length) console.log(`docs-lint: skipping non-MDX file(s): ${skipped.join(', ')} (docs.json is checked for valid JSON and nav only)`);
files = files.filter((f) => f.endsWith('.mdx'));
if (!files.length) {
  console.log('docs-lint: no .mdx files to check');
  process.exit(0);
}

let nav;
try {
  nav = navPages();
} catch (e) {
  console.log(`ERROR docs.json: invalid JSON (${e.message})`);
  process.exit(1);
}

let errors = 0;
let warns = 0;
const report = (level, file, line, msg) => {
  if (level === 'ERROR') errors++;
  else warns++;
  console.log(`${level} ${file}:${line} ${msg}`);
};
for (const f of files) lintFile(f, nav, report);
console.log(`docs-lint: ${files.length} file(s), ${errors} error(s), ${warns} warning(s)`);
process.exit(errors ? 1 : 0);
