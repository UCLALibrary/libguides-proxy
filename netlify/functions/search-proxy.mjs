
/**
 * LibGuides Search Proxy
 *
 * Allows GitHub Pages previews to request live search
 * results from Springshare without browser CORS errors.
 *
 * Supports search queries, sorting, filtering,
 * and pagination by forwarding supported parameters.
 */

const SPRINGSHARE_SEARCH_URL =
  'https://guides.library.ucla.edu/srch_process_cs.php';

const ALLOWED_ORIGINS = new Set([
  'https://uclalibrary.github.io',
  'http://localhost:8080',
  'http://localhost:3000',
]);

const ALLOWED_ACTIONS = new Set([
  '580',
  '581',
  '582',
  '583',
]);

const ALLOWED_SOURCES = new Set([
  '2012',
  '2013',
]);

const TIMEOUT_MS = 15000;
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;

// Search parameters supported by Springshare.
// Expand this list when new filters are confirmed.

const ALLOWED_PARAMS = new Set([
  // Search
  'q',
  'action',
  'search_source_id',
  'layout',
  'start',
  'sort',
  'sort_field',
  'sort_dir',
  'default_lg',

  // Guide and group identifiers
  'guide_id',
  'group_id',
  'f_group_id',

  // Guide filters
  'guide_subject_ids',
  'guide_tag_ids',
  'guide_type_id',
  'guide_owner_id',

  // Additional filter parameters
  'f_guide_subject_ids',
  'f_guide_tag_ids',
  'f_guide_type_id',
  'f_guide_owner_id',
]);




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

  // Reject browser requests from unapproved origins.
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return jsonResponse(
      { error: 'Origin not allowed' },
      403,
      corsHeaders
    );
  }

  // Handle browser CORS preflight requests.
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
  const params = requestUrl.searchParams;

  const action = params.get('action');
  const sourceId = params.get('search_source_id');

  if (!ALLOWED_ACTIONS.has(action)) {
    return jsonResponse(
      { error: 'Unsupported search action' },
      400,
      corsHeaders
    );
  }

  if (!ALLOWED_SOURCES.has(sourceId)) {
    return jsonResponse(
      { error: 'Unsupported search source' },
      400,
      corsHeaders
    );
  }

  // Prevent excessively long requests.
  if (requestUrl.search.length > 4096) {
    return jsonResponse(
      { error: 'Search request too long' },
      400,
      corsHeaders
    );
  }

  // Build the upstream request using only approved parameters.
  const upstreamUrl = new URL(SPRINGSHARE_SEARCH_URL);

  for (const [key, value] of params) {
    if (!ALLOWED_PARAMS.has(key)) {
      return jsonResponse(
        { error: `Unsupported parameter: ${key}` },
        400,
        corsHeaders
      );
    }

    upstreamUrl.searchParams.append(key, value);
  }

  try {
    const response = await fetch(upstreamUrl, {
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: 'https://guides.library.ucla.edu/',
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      return jsonResponse(
        { error: 'Springshare search request failed' },
        502,
        corsHeaders
      );
    }

    const contentLength = Number(
      response.headers.get('content-length') || 0
    );

    if (contentLength > MAX_RESPONSE_BYTES) {
      return jsonResponse(
        { error: 'Search response too large' },
        502,
        corsHeaders
      );
    }

    const body = await response.text();

    if (Buffer.byteLength(body, 'utf8') > MAX_RESPONSE_BYTES) {
      return jsonResponse(
        { error: 'Search response too large' },
        502,
        corsHeaders
      );
    }

    const data = JSON.parse(body);

    return jsonResponse(data, 200, corsHeaders);
  } catch (error) {
    console.error('LibGuides Search proxy error:', error);

    return jsonResponse(
      { error: 'Unable to retrieve search results' },
      502,
      corsHeaders
    );
  }
}
