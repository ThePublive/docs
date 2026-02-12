---
description: Set up webhooks to receive real-time notifications from Publive
---

# Webhooks

Webhooks allow you to receive real-time HTTP callbacks when events occur in your Publive CMS, such as content being published, updated, or deleted.

## Supported Events

| Event | Trigger |
| ----- | ------- |
| `post.created` | A new post is created |
| `post.updated` | A post is updated |
| `post.published` | A post status changes to Published |
| `post.deleted` | A post is deleted |
| `category.created` | A new category is created |
| `category.updated` | A category is updated |
| `category.deleted` | A category is deleted |
| `tag.created` | A new tag is created |
| `tag.updated` | A tag is updated |
| `media.uploaded` | New media is added to the library |

## Setup

Configure webhooks through the Publive Dashboard:

1. Go to **Settings** > **Webhooks**
2. Click **Add Webhook**
3. Enter your endpoint URL
4. Select the events you want to subscribe to
5. Save

## Payload Format

```json
{
  "event": "post.published",
  "timestamp": "2026-02-12T10:00:00Z",
  "data": {
    "id": 50123,
    "title": "My Published Article",
    "slug": "my-published-article",
    "type": "Article",
    "status": "Published",
    "primary_category": {
      "id": 100,
      "name": "News"
    }
  }
}
```

## Verification

Webhook requests include a signature header for verification:

```
X-Publive-Signature: sha256=...
```

Verify the signature by computing HMAC-SHA256 of the request body using your webhook secret.

## Best Practices

- **Respond with 200** quickly, process the payload asynchronously
- **Implement idempotency** as webhooks may be delivered more than once
- **Use HTTPS** endpoints for security
- **Validate signatures** to ensure requests are from Publive
