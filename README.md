# Library Guides Proxy

This repository hosts Netlify serverless functions that proxy HTML content from UCLA Library LibGuides and return structured JSON for frontend applications. The proxies normalize HTML responses into a consistent format, allowing consuming applications to avoid parsing LibGuides markup directly.

## Contents

- [Overview](#overview)
- [Proxy Endpoints](#proxy-endpoints)
  - [Global Data Proxy](#global-data-proxy)
  - [Library Status Updates Proxy](#library-status-updates-proxy)
  - [FTVA Global Proxy](#ftva-global-proxy)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
- [Deployment](#deployment)
  - [Netlify Configuration](#netlify-configuration)
  - [Preview Deployments](#preview-deployments)
- [Configuration](#configuration)
- [Example Response](#example-response)
- [Dependencies](#dependencies)
- [Gotchas](#gotchas)

---

# Overview

This project exposes proxy endpoints that retrieve HTML from LibGuides, extract the required content, and return structured JSON.

Currently, the project provides three endpoints:

1. **Global Data Proxy** – Returns global library alert banners.
2. **Library Status Updates Proxy** – Returns structured library status updates.
3. **FTVA Global Proxy** – Returns global alerts for the Film & Television Archive (FTVA).

---

# Proxy Endpoints

## Global Data Proxy

**Endpoint**

```
/api/libguides/global/proxy
```

### Purpose

Retrieves library-wide alert banner content, including:

- Full-width banner alerts
- Dismissible alert boxes

### Response

```json
{
  "bannerAlert": {
    "text": "<p>...</p>"
  },
  "infoAlert": {
    "title": "Alert Title",
    "text": "<p>...</p>"
  }
}
```

---

## Library Status Updates Proxy

**Endpoint**

```
/api/libguides/library/status/updates/proxy
```

### Purpose

Retrieves structured library status updates from the Library Alerts & Status Updates LibGuide.

Each section is extracted from the LibGuide and returned as structured JSON.

### Response

Each section contains:

- `sectionTitle`
- `richText`

along with any additional structured content such as cards and call-to-actions.

---

## FTVA Global Proxy

**Endpoint**

```
/api/libguides/ftva/global/proxy
```

### Purpose

Retrieves Film & Television Archive (FTVA) global alert content from LibGuides.

The proxy returns:

- Global banner alert
- Dismissible information alert

### Response

```json
{
  "bannerAlert": {
    "text": "<p>...</p>"
  },
  "infoAlert": {
    "title": "Summer Intermission",
    "text": "<p>Screenings will be on pause...</p>"
  }
}
```

---

# Setup Instructions

## Prerequisites

Install project dependencies:

```bash
pnpm install
```

Install the Netlify CLI:

```bash
npm install -g netlify-cli
```

---

## Local Development

Run the local Netlify development server:

```bash
netlify dev
```

Netlify Functions will be available locally.

Examples:

```
http://localhost:8888/api/libguides/global/proxy
```

```
http://localhost:8888/api/libguides/library/status/updates/proxy
```

```
http://localhost:8888/api/libguides/ftva/global/proxy
```

---

# Deployment

This project is deployed on **Netlify**.

## Netlify Configuration

The project uses the following configuration in `netlify.toml`:

```toml
[build]
  functions = "netlify/functions"

[[redirects]]
  from = "/api/libguides/global/proxy"
  to = "/.netlify/functions/globalDataProxy"
  status = 200

[[redirects]]
  from = "/api/libguides/library/status/updates/proxy"
  to = "/.netlify/functions/libraryStatusUpdatesProxy"
  status = 200

[[redirects]]
  from = "/api/libguides/ftva/global/proxy"
  to = "/.netlify/functions/ftvaGlobalProxy"
  status = 200
```

---

## Preview Deployments

This repository is connected to GitHub and Netlify.

Whenever a pull request is opened or updated:

- GitHub Actions automatically builds the branch.
- Netlify creates a **Preview Deployment**.
- A preview URL is posted back to the pull request, allowing reviewers to test the changes before merging.

Once the pull request is merged into the main branch, Netlify automatically deploys the latest production version.

---

# Configuration

All LibGuide URLs, Box IDs, Map IDs, Config IDs, and HTML selectors are configured within the corresponding Netlify Function.

If LibGuides content changes, these values may need to be updated.

---

# Example Response

```json
{
  "summary": "<p>Last updated Tuesday, July 15, 2025.</p>",
  "blocks": [
    {
      "id": "4243666",
      "typeHandle": "richText",
      "sectionTitle": "Access to Libraries and Services",
      "richText": "<ul>...</ul>"
    },
    {
      "id": "4243668",
      "typeHandle": "richText",
      "sectionTitle": "Planned Library Construction",
      "richText": "<p>No planned construction at this time.</p>"
    },
    {
      "id": "4243669",
      "typeHandle": "simpleCards",
      "sectionTitle": "Additional Campus Resources",
      "cards": [
        {
          "title": "Bruins Safe Online",
          "externalLink": "https://bso.ucla.edu"
        }
      ]
    }
  ]
}
```

---

# Dependencies

- Node.js
- Netlify Functions
- Netlify CLI
- jsdom

---

# Gotchas

## If content editors accidentally delete the box on the LibGuides page

**Library Alerts & Status Updates**

Admin page:

```
https://ucla.libapps.com/libguides/admin_c.php?g=1427138
```

Public page:

```
https://guides.library.ucla.edu/c.php?g=1427138&p=10587194#s-lg-box-wrapper-40758929
```

### Steps to fix

### 1. Update the LibGuide URL

If the content box is deleted and recreated, LibGuides generates new:

- Box ID
- Map ID
- Config ID

Update the corresponding URL in the Netlify Function.

Example:

```
https://github.com/UCLALibrary/libguides-proxy/blob/main/netlify/functions/libraryStatusUpdatesProxy.js#L63
```

---

### 2. Update the HTML selector

After recreating the box, LibGuides also generates a new HTML element ID.

Update the selector used to extract the content.

Example:

```
https://github.com/UCLALibrary/libguides-proxy/blob/main/netlify/functions/libraryStatusUpdatesProxy.js#L122
```

---

## If the FTVA LibGuide content is recreated

The same process applies to the FTVA proxy.

If an FTVA content box is deleted and recreated:

1. Update the Box ID, Map ID, and Config ID in:

```
netlify/functions/ftvaGlobalProxy.js
```

2. Update any HTML element IDs used by the parser (for example, `s-lg-content-xxxxxxxx`) to match the newly generated LibGuides markup.

Failure to update these IDs will result in empty `bannerAlert` or `infoAlert` responses.
