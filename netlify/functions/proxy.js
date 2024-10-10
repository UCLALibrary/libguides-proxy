export default async (request) => {
  const apiUrl = 'https://lgapi-us.libapps.com/widget_box.php?site_id=705&widget_type=8&output_format=2&widget_title=Library+Alert&widget_height=250&widget_width=100%25&guide_id=1427138&box_id=33325708&map_id=39190263&content_only=0&include_jquery=1&config_id=1727199122170';
  const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*', // Allows all origins (you can restrict this to specific domains)
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  try {
    // Fetch data from external API
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: CORS_HEADERS
      });
    }
    const response = await fetch(apiUrl);
    const data = await response.text(); // Using .text() because the content might not be JSON

    // Return the response from the external API
    return new Response(
       data,{
        headers: {
          'Content-Type': 'text/html',
          ...CORS_HEADERS
        },
        status: 200
       }
      )
  } catch (error) {
    // Handle any errors
    return new Response(
      JSON.stringify({ error: 'An error occurred', details: error.toString() }), {
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS
        },
        status: 500
      }
    );
  }
};
