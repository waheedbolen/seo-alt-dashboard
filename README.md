# SEO Alt Dashboard API

A lightweight, serverless API for managing SEO alt text data for web images. This dashboard provides endpoints for storing, retrieving, and analyzing alt text data used by the SEO Alt Injector.

## Overview

The SEO Alt Dashboard API is a Cloudflare Worker that provides a simple interface for managing alt text data. It works in conjunction with the [SEO Alt Injector](https://github.com/waheedbolen/seo-alt-injector) to improve website accessibility and SEO by providing proper alt text for images.

## Features

- **Secure API Key Authentication**: Protects your data with API key verification
- **CORS Support**: Built-in cross-origin resource sharing for frontend integration
- **Statistics Endpoint**: Track usage and performance metrics
- **KV Storage Integration**: Efficient key-value storage for alt text data
- **Serverless Architecture**: Scales automatically with zero maintenance

## API Endpoints

### GET /stats

Returns statistics about the alt text database and API usage.

**Response Example:**
```json
{
  "total_kv_entries": 250,
  "mock_api_calls": 300,
  "timestamp": "2025-05-27T07:00:00.000Z"
}
```

### GET /kv

Retrieves all stored alt text entries (limited to 100 records).

**Response Example:**
```json
[
  {
    "image": "https://example.com/image1.jpg",
    "alt": "A scenic mountain landscape with snow-capped peaks"
  },
  {
    "image": "https://example.com/image2.jpg",
    "alt": "A red sports car on a coastal highway"
  }
]
```

### POST /kv

Stores a new alt text entry.

**Request Body:**
```json
{
  "image": "https://example.com/image3.jpg",
  "alt": "A golden retriever puppy playing with a tennis ball"
}
```

**Response Example:**
```json
{
  "success": true
}
```

## Authentication

All endpoints (except OPTIONS preflight requests) require authentication using an API key.

Add the following header to your requests:
```
x-api-key: your-api-key-here
```

## CORS Support

The API includes built-in CORS support with the following headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, x-api-key
```

## Deployment

### Prerequisites

- [Cloudflare Workers](https://workers.cloudflare.com/) account
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed

### Setup

1. Create a KV namespace in your Cloudflare account:
```bash
wrangler kv:namespace create "SEO_ALT_KV"
```

2. Create a `wrangler.toml` file:
```toml
name = "seo-alt-dashboard"
main = "index.js"
compatibility_date = "2023-01-01"

kv_namespaces = [
  { binding = "SEO_ALT_KV", id = "your-kv-namespace-id" }
]

[vars]
DASHBOARD_API_KEY = "your-api-key-here"
```

3. Deploy the worker:
```bash
wrangler deploy
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DASHBOARD_API_KEY` | API key for authentication |

## KV Storage

The API uses Cloudflare KV storage with the following structure:
- **Key**: Image URL (string)
- **Value**: Alt text (string)

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start local development server:
```bash
wrangler dev
```

## Integration with SEO Alt Injector

This dashboard API works seamlessly with the [SEO Alt Injector](https://github.com/waheedbolen/seo-alt-injector) to provide a complete solution for automated alt text generation and management.

Configure your SEO Alt Injector with the following settings:
```javascript
window.seoAltInjectorConfig = {
  kvEndpoint: "https://your-worker-subdomain.workers.dev/kv",
  apiKey: "your-api-key-here"
};
```
