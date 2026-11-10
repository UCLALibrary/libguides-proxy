
/**
 * LibGuides A-Z Databases Proxy
 *
 * Provides live database listings, keyword search,
 * alphabetical navigation, filters, and pagination
 * for GitHub Pages previews.
 */

const SPRINGSHARE_URL =
  'https://guides.library.ucla.edu/process/az/render-list';

const ALLOWED_ORIGINS = new Set([
  'https://uclalibrary.github.io',
  'http://localhost:8080',
  'http://localhost:3000',
]);

const ALLOWED_PARAMS = new Set([
  'search',
  'subject_id',
  'type_id',
  'vendor_id',
  'access_mode_id',
  'page',
  'site_id',
  'content_id',
  'is_widget',
  'bootstrap5',
  'page_size',
  'preview',
  'sublist_id',
  'alpha',
]);

const TIMEOUT_MS = 30000;
const MAX_RESPONSE_BYTES = 5 * 1024 * 1024;

function getCorsHeaders(origin) {
  if (!ALLOWED_ORIGINS.has(origin)) {
    return {};
  }

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, X-Requested-With',
    'Access-Control-Max-Age': '3600',
    Vary: 'Origin',
  };
}

function jsonResponse(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

export default async function handler(request) {
  const origin = request.headers.get('origin') || '';
  const corsHeaders = getCorsHeaders(origin);

  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return jsonResponse(
      { error: 'Origin not allowed' },
      403,
      corsHeaders
    );
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (request.method !== 'GET') {
    return jsonResponse(
      { error: 'Method not allowed' },
      405,
      corsHeaders
    );
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.search.length > 4096) {
    return jsonResponse(
      { error: 'Request too long' },
      400,
      corsHeaders
    );
  }

  const upstreamUrl = new URL(SPRINGSHARE_URL);

  for (const [key, value] of requestUrl.searchParams) {
    if (!ALLOWED_PARAMS.has(key)) {
      return jsonResponse(
        { error: `Unsupported parameter: ${key}` },
        400,
        corsHeaders
      );
    }

    upstreamUrl.searchParams.append(key, value);
  }

  // Restrict this proxy to UCLA Library's A-Z listing.
  if (
    upstreamUrl.searchParams.get('site_id') !== '705' ||
    upstreamUrl.searchParams.get('is_widget') !== '0' ||
    upstreamUrl.searchParams.get('content_id') !== '0' ||
    upstreamUrl.searchParams.get('preview') !== ''
  ) {
    return jsonResponse(
      { error: 'Unsupported database configuration' },
      400,
      corsHeaders
    );
  }


// Filters can contain multiple comma-separated numeric IDs.
const filterParams = [
  'subject_id',
  'type_id',
  'vendor_id',
  'access_mode_id',
];

for (const key of filterParams) {
  const value = upstreamUrl.searchParams.get(key);

  // Allow empty filters, single IDs, and comma-separated IDs.
  if (value && !/^\d+(,\d+)*$/.test(value)) {
    return jsonResponse(
      { error: `Invalid parameter: ${key}` },
      400,
      corsHeaders
    );
  }
}

// Pagination and other numeric parameters must remain single values.
const numericParams = [
  'page',
  'page_size',
  'sublist_id',
];

for (const key of numericParams) {
  const value = upstreamUrl.searchParams.get(key);

  if (value && !/^\d+$/.test(value)) {
    return jsonResponse(
      { error: `Invalid parameter: ${key}` },
      400,
      corsHeaders
    );
  }
}


  const alpha = upstreamUrl.searchParams.get('alpha') || '';

  if (alpha && !/^[a-z0-9]$/i.test(alpha)) {
    return jsonResponse(
      { error: 'Invalid alphabet filter' },
      400,
      corsHeaders
    );
  }

  try {
    const response = await fetch(upstreamUrl, {
      headers: {
        Accept: 'application/json, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: 'https://guides.library.ucla.edu/az/databases',
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      return jsonResponse(
        { error: 'Springshare database request failed' },
        502,
        corsHeaders
      );
    }

    const contentLength = Number(
      response.headers.get('content-length') || 0
    );

    if (contentLength > MAX_RESPONSE_BYTES) {
      return jsonResponse(
        { error: 'Database response too large' },
        502,
        corsHeaders
      );
    }

    const body = await response.text();

    if (Buffer.byteLength(body, 'utf8') > MAX_RESPONSE_BYTES) {
      return jsonResponse(
        { error: 'Database response too large' },
        502,
        corsHeaders
      );
    }

    const data = JSON.parse(body);

    // Preserve Springshare's response structure.
    return jsonResponse(data, 200, corsHeaders);
  } catch (error) {
    console.error('A-Z Databases proxy error:', error);

    return jsonResponse(
      { error: 'Unable to retrieve databases' },
      502,
      corsHeaders
    );
  }
}
