---
description: Integrate Publive with Next.js for server-rendered content
---

# Next.js Integration

Build a server-rendered website powered by Publive using Next.js App Router.

## Setup

### 1. Create a Publive API Client

Create `lib/publive.js`:

```javascript
const BASE_URL = 'https://cds.thepublive.com/publisher/YOUR_PUBLISHER_ID';

const headers = {
  'username': process.env.PUBLIVE_API_KEY,
  'password': process.env.PUBLIVE_API_SECRET,
};

export async function fetchPosts(params = {}) {
  const query = new URLSearchParams({ limit: '10', ...params });
  const res = await fetch(`${BASE_URL}/posts/?${query}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function fetchPost(slug) {
  const res = await fetch(`${BASE_URL}/post/${slug}/`, { headers });
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/categories/`, { headers });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function fetchNavbar() {
  const res = await fetch(`${BASE_URL}/navbar/`, { headers });
  if (!res.ok) throw new Error('Failed to fetch navbar');
  return res.json();
}
```

### 2. Set Environment Variables

Add to `.env.local`:

```
PUBLIVE_API_KEY=your_api_key
PUBLIVE_API_SECRET=your_api_secret
```

### 3. Create a Post Listing Page

Create `app/page.js`:

```jsx
import { fetchPosts } from '@/lib/publive';
import Link from 'next/link';

export default async function HomePage() {
  const { data } = await fetchPosts({ limit: '20' });

  return (
    <main>
      <h1>Latest Articles</h1>
      {data.map((post) => (
        <article key={post.id}>
          {post.banner_url && (
            <img src={post.banner_url} alt={post.title} />
          )}
          <h2>
            <Link href={post.absolute_url}>{post.title}</Link>
          </h2>
          <p>{post.short_description}</p>
          <span>{post.primary_category?.name}</span>
        </article>
      ))}
    </main>
  );
}
```

### 4. Create a Post Detail Page

Create `app/[...slug]/page.js`:

```jsx
import { fetchPost } from '@/lib/publive';

export default async function PostPage({ params }) {
  const slug = params.slug.join('/');
  const { data } = await fetchPost(slug);

  return (
    <article>
      <h1>{data.title}</h1>
      <div className="meta">
        <span>{data.primary_category?.name}</span>
        <time>{data.formatted_first_published_at_datetime}</time>
      </div>
      {data.banner_url && !data.hide_banner_image && (
        <figure>
          <img src={data.banner_url} alt={data.title} />
          {data.banner_description && (
            <figcaption>{data.banner_description}</figcaption>
          )}
        </figure>
      )}
      <div dangerouslySetInnerHTML={{ __html: data.content_html }} />
      <div className="tags">
        {data.tags?.map((tag) => (
          <span key={tag.id}>{tag.name}</span>
        ))}
      </div>
    </article>
  );
}
```

## Advanced

### Filtering by Category

```javascript
// Fetch articles in the "News" category (ID: 100)
const { data } = await fetchPosts({
  'categories.id__eq': '100',
  'type__eq': 'Article',
});
```

### Building Navigation

```jsx
import { fetchNavbar } from '@/lib/publive';

export default async function Navbar() {
  const { data } = await fetchNavbar();

  return (
    <nav>
      {data.map((item) => (
        <div key={item.link}>
          <a href={item.link}>{item.name}</a>
          {item.children && (
            <div className="submenu">
              {item.children.map((child) => (
                <a key={child.link} href={child.link}>{child.name}</a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
```
