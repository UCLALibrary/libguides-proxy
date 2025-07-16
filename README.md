# Library Status Update Proxies

This repository hosts two Netlify serverless functions that serve as proxies for fetching and structuring HTML content from library update sources. These functions return JSON-formatted content for easier integration into frontend applications.

## Contents

- [Overview](#overview)
- [Proxy Functions](#proxy-functions)
  - [Global Data Proxy](#global-data-proxy)
  - [Library Status Updates Proxy](#library-status-updates-proxy)
- [Setup Instructions](#setup-instructions)
  - [Local Development](#local-development)
  - [Deployment](#deployment)
- [Configuration](#configuration)
- [Example Response](#example-response)
- [Dependencies](#dependencies)

---

## Overview

This project provides structured access to library data by creating two endpoint proxies:

1. **Global Data Proxy** for library alert banners.
2. **Library Status Updates Proxy** for ongoing updates about library facilities and services.

## Proxy Functions

### Global Data Proxy

**Path**: `/api/libguides/global/proxy`

- **Purpose**: Retrieves library alert banner data, such as full-banner alerts and dismissible alert boxes.
- **Output**: JSON with `title` and `text` fields for each alert type.

### Library Status Updates Proxy

**Path**: `/api/libguides/library/status/updates/proxy`

- **Purpose**: Gathers specific library status updates, extracting structured content after each `<h3>` header.
- **Output**: JSON object containing a `sectionTitle` and `richText` for each update section.

---

## Setup Instructions

### Local Development

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

### Install Netlify CLI

Install the Netlify CLI globally to enable local function emulation:

````bash
npm install -g netlify-cli

### Run Locally
Use the Netlify CLI to start a local development server:

```bash
netlify dev

This will serve your functions locally and emulate the production environment.

Example:
http://localhost:8888/api/libguides/library/status/updates/proxy

---
### Deployment

#### Connect Repository to Netlify
1. Go to the Netlify Dashboard.
2. Select **New Site** > **Import an Existing Project** and choose this repository.

#### Automatic Setup
Netlify will automatically detect the `netlify.toml` configuration file and use the specified settings.

## Configuration

## Example Response

````

{
summary: "

<p>Last updated Tuesday, July 15, 2025.</p>

    	   ",

blocks: [
{
id: "4243666",
typeHandle: "richText",
richText: "<ul>

<li>
<p>Due to scheduled critical maintenance on the facility that supplies the campus with power, the <strong>UCLA Library Special Collections (LSC) Reading Room</strong> will be closed from Monday, July 28&nbsp;to Wednesday, July 30. It&nbsp;will re-open on Thursday, July 31. Please submit all paging requests for LSC materials by Thursday, July 24 to ensure materials are available for your visit on July 31.</p>
</li>
<li>
<p>All other Library locations are operating normally. Please check <a href="https://www.library.ucla.edu/visit/locations/" style="background-color: rgb(255, 255, 255);">Locations &amp; Hours</a> before visiting.</p>
</li>
<li>
<p><a href="https://www.library.ucla.edu/help/research-help/">Research Help</a> is available through research consultations and other resources.</p>
</li>
<li>
<p>Use <a href="https://www.library.ucla.edu/help/services-resources/ask-us/">Ask Us</a> for questions, including 24/7 chat.</p>
</li>

</ul>",
sectionTitle: "Access to Libraries and Services"
},
{
id: "4243668",
typeHandle: "richText",
richText: "<p>No planned construction at this time.</p>",
sectionTitle: "Planned Library Construction"
},
{
id: "4243669",
typeHandle: "simpleCards",
sectionTitle: "Additional Campus Resources",
sectionSummary: null,
cards: [
{
id: "4243670",
typeHandle: "externalServiceOrResource",
title: "Bruins Safe Online",
summary: "Information on the current campus status.",
externalLink: "https://bso.ucla.edu"
},
{
id: "4243986",
typeHandle: "externalServiceOrResource",
title: "Bruin Safety & Well-Being",
summary: "Resources and services to assist the campus community during difficult times.",
externalLink: "https://equity.ucla.edu/bruin-safety-well-being/?mc_cid=024964e8ea&mc_eid=9ef0760ab7"
}
]
},
{
id: "4243671",
typeHandle: "callToAction",
callToAction: [
{
id: "4243672",
titleCta: "Have Further Questions?",
summary: "We're here to help. Chat with a librarian 24/7, schedule a research consultation or email us your quick questions.",
icon: "svg-call-to-action-chat",
buttonText: "Contact us",
buttonUrl: "https://www.library.ucla.edu/help/services-resources/ask-us",
backgroundColor: "false"
}
]
}
]
}
```

## Gotchas

### If content editors accidently delete the box on Libguides Page

`Library Alerts & Status Updates`

```
https://ucla.libapps.com/libguides/admin_c.php?g=1427138
https://guides.library.ucla.edu/c.php?g=1427138&p=10587194#s-lg-box-wrapper-40758929
```

#### Steps to fix:

1. Get the new box id, map id and config id and update the url of the box that got deleted and readded on the libguides page with the new box id, map id and config id

```
https://github.com/UCLALibrary/libguides-proxy/blob/main/netlify/functions/libraryStatusUpdatesProxy.js#L63
```

2. Also inspect the url and add the new id to extract the html content for the new box content

sample place to update in code

```
https://github.com/UCLALibrary/libguides-proxy/blob/main/netlify/functions/libraryStatusUpdatesProxy.js#L122
```
