export default async (request) => {
  // We have not built a component for this yet for the main library website
  const globalLibraryAlertBannerApiUrl = 'https://uclalibrary.slack.com//lgapi-us.libapps.com/widgets.php?site_id=705&widget_type=8&output_format=1&widget_embed_type=2&guide_id=1427138&box_id=33325708&map_id=39190263&content_only=0&include_jquery=1&config_id=1729804564421'; 
  const globalLibraryAlertDismissableBoxApiUrl = 'https://uclalibrary.slack.com//lgapi-us.libapps.com/widgets.php?site_id=705&widget_type=8&output_format=1&widget_embed_type=2&guide_id=1427138&box_id=33464938&map_id=39354139&content_only=0&include_jquery=1&config_id=1729804592797'; 
  const libraryStatusUpdateSection1ApiUrl = 'https://uclalibrary.slack.com//lgapi-us.libapps.com/widgets.php?site_id=705&widget_type=8&output_format=1&widget_embed_type=2&guide_id=1427138&box_id=33464944&map_id=39354145&content_only=0&include_jquery=1&config_id=1729804600932'; 
  const libraryStatusUpdateSection2ApiUrl = 'https://uclalibrary.slack.com//lgapi-us.libapps.com/widgets.php?site_id=705&widget_type=8&output_format=1&widget_embed_type=2&guide_id=1427138&box_id=33464982&map_id=39354184&content_only=0&include_jquery=1&config_id=1729804613204'; 
  
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
