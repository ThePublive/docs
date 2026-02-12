---
description: Implementing Publive for Banking, Financial Services, and Insurance
---

# BFSI Compliance

Publive provides enterprise governance features essential for the Banking, Financial Services, and Insurance (BFSI) sector.

## Key Requirements

| Requirement | Publive Feature |
| ----------- | --------------- |
| Content approval before publishing | Maker-checker workflow via `Approval Pending` status |
| Audit trail | Post `created_at`, `updated_at`, `published_at`, `approver` fields |
| Access control | API key-based authentication, role separation |
| Content versioning | Draft/Published state separation |
| Compliance reviews | `Approval Pending` → review → `Published` flow |

## Implementing Maker-Checker

For BFSI compliance, every piece of content should go through the approval flow:

```
Draft → Approval Pending → (Compliance Review) → Published
```

See the [Maker-Checker Guide](../workflows/maker-checker.md) for detailed implementation steps.

## Content Access Controls

Use the `access_type` metadata to control content visibility:

```bash
# Create compliance-restricted content
curl -X POST \
  'https://cms.thepublive.com/publisher/123/post/' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Internal Compliance Update",
    "type": "Article",
    "status": "Draft",
    "primary_category": 200,
    "meta_data": {"access_type": "Paid"}
  }'
```

## Audit Trail

Every post includes timestamps and attribution:

| Field | Purpose |
| ----- | ------- |
| `created_at` | When the content was first created |
| `updated_at` | Last modification timestamp |
| `published_at` | When content went live |
| `member` | Content creator |
| `updated_by` | Last editor |
| `approver` | Who approved publication |
| `source` | Content origin system |

## Best Practices

1. **Separate API keys** for content creators (makers) and approvers (checkers)
2. **Always use `Approval Pending`** status before publishing
3. **Track all state changes** using the post timestamps and attribution fields
4. **Use categories** to organize content by compliance domain (regulatory, investor relations, customer communications)
