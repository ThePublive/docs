---
description: Implement maker-checker workflows for content governance
---

# Maker-Checker Workflow

The maker-checker pattern ensures that content created by one user (maker) must be reviewed and approved by another user (checker) before publication. This is essential for regulated industries like BFSI and Pharmaceuticals.

## How It Works

1. **Maker** creates or edits a post and sets status to `Approval Pending`
2. **Checker** reviews the post in the Publive Dashboard
3. **Checker** approves (sets to `Published`) or rejects (sets back to `Draft`)

## Implementation via API

### Step 1: Create a Post as Draft

```bash
curl -X POST \
  'https://cms.thepublive.com/publisher/123/post/' \
  -H 'username: MAKER_API_KEY' \
  -H 'password: MAKER_API_SECRET' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Quarterly Financial Report Q4 2025",
    "english_title": "Quarterly Financial Report Q4 2025",
    "type": "Article",
    "status": "Draft",
    "primary_category": 100,
    "content": "<p>Financial results for Q4 2025...</p>"
  }'
```

### Step 2: Submit for Approval

```bash
curl -X PATCH \
  'https://cms.thepublive.com/publisher/123/post/50200/' \
  -H 'username: MAKER_API_KEY' \
  -H 'password: MAKER_API_SECRET' \
  -H 'Content-Type: application/json' \
  -d '{"status": "Approval Pending"}'
```

### Step 3: Approve and Publish

```bash
curl -X PATCH \
  'https://cms.thepublive.com/publisher/123/post/50200/' \
  -H 'username: CHECKER_API_KEY' \
  -H 'password: CHECKER_API_SECRET' \
  -H 'Content-Type: application/json' \
  -d '{"status": "Published"}'
```

## Post Status Flow

```
Draft → Approval Pending → Published
  ↑                          |
  └──── (Rejected) ──────────┘
```

{% hint style="info" %}
The `approver` field in the post response shows who approved the content.
{% endhint %}
