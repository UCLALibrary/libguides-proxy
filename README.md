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

### Install Netlify CLI
Install the Netlify CLI globally to enable local function emulation:

```bash
npm install -g netlify-cli

### Run Locally
Use the Netlify CLI to start a local development server:

```bash
netlify dev

This will serve your functions locally and emulate the production environment.

---
### Deployment

#### Connect Repository to Netlify
1. Go to the Netlify Dashboard.
2. Select **New Site** > **Import an Existing Project** and choose this repository.

#### Automatic Setup
Netlify will automatically detect the `netlify.toml` configuration file and use the specified settings.

