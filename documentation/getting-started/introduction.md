---
description: What is Publive and why use it for your content management needs
---

# Introduction

## What is Publive?

Publive is an India-first headless CMS (Content Management System) built for modern digital publishers and enterprises. It provides a robust backend for managing content while giving you complete freedom to build any frontend experience using your preferred framework.

## How It Works

Publive separates content management from content presentation through two core services:

| Service | Purpose | Base URL |
| ------- | ------- | -------- |
| **Content Delivery Service (CDS)** | Read-only API for fetching published content on your website or app | `https://cds.thepublive.com/publisher/{publisher_id}/` |
| **Content Management Service (CMS)** | Full CRUD API for creating and managing content programmatically | `https://cms.thepublive.com/publisher/{publisher_id}/` |

## Who Is Publive For?

* **Digital Publishers** — Manage articles, authors, categories, tags, and media at scale
* **Enterprise Teams** — Built-in governance workflows (maker-checker, approvals) for regulated industries
* **Developers** — Clean REST APIs, multiple SDKs, and framework-agnostic architecture

## Key Capabilities

### Content Management
Create and manage posts, categories, tags, authors, and media through the CMS API or the Publive Dashboard.

### Multi-format Content
Support for Articles, Videos, Web Stories, Galleries, Live Blogs, Custom Pages, and Blank Pages.

### Enterprise Governance
Maker-checker workflows, multi-step approval flows, and audit trails for compliance-heavy industries like BFSI and Pharmaceuticals.

### AI-Powered Features
Automatic tag suggestions, plagiarism detection, SEO scoring, and content recommendations with Indian language support.

### Advanced Filtering
The CDS API supports powerful query operators (`__eq`, `__contains`, `__in`, `__gte`, `__lte`, and more) for flexible content retrieval.

## Next Steps

{% content-ref url="quick-start.md" %}
[Quick Start](quick-start.md)
{% endcontent-ref %}

{% content-ref url="authentication.md" %}
[Authentication](authentication.md)
{% endcontent-ref %}

{% content-ref url="core-concepts.md" %}
[Core Concepts](core-concepts.md)
{% endcontent-ref %}
