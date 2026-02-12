---
description: Integrate Publive CDS API with your frontend framework
---

# Frontend Integration

Use the Content Delivery Service (CDS) API to power your website or application. These guides show you how to fetch and display content from Publive using popular frontend frameworks.

## Choose Your Framework

| Framework | Guide | Best For |
| --------- | ----- | -------- |
| [Next.js](nextjs.md) | Server-side rendering with React | SEO-critical sites, blogs, news portals |
| [React](react.md) | Single-page applications | Dashboards, interactive apps |
| [Vue.js](vue.md) | Progressive framework | Flexible, incrementally-adoptable sites |
| [Angular](angular.md) | Enterprise framework | Large-scale enterprise applications |

## Common Pattern

All integrations follow the same basic pattern:

1. **Configure** your API credentials (server-side only)
2. **Fetch** content from the CDS API
3. **Render** content in your components
4. **Handle** pagination and navigation

{% hint style="warning" %}
**Security:** Never expose your API credentials in client-side code. Always make API calls from your server or serverless functions.
{% endhint %}
