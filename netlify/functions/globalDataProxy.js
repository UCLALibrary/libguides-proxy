import { parseFromString } from 'dom-parser'

const globals = {
  libraryAlert: {
    title: "Alert",
    text: ""
  },
  fullBannerAlert:{
   // title: "Alert", //No title for full banner
    text: ""
  }
};
export default async (request) => {
  // We have not built a component for this yet for the main library website
  const globalLibraryAlertBannerApiUrl = 'https://lgapi-us.libapps.com/widgets.php?site_id=705&widget_type=8&output_format=1&widget_embed_type=2&guide_id=1427138&box_id=33325708&map_id=39190263&content_only=0&include_jquery=1&config_id=1729804564421'; 
  const globalLibraryAlertDismissableBoxApiUrl = 'https://lgapi-us.libapps.com/widgets.php?site_id=705&widget_type=8&output_format=1&widget_embed_type=2&guide_id=1427138&box_id=33464938&map_id=39354139&content_only=0&include_jquery=1&config_id=1729804592797'; 
 
  
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
    // Fetch data from both sections
    const [globalLibraryAlertBanner, globalLibraryAlertDismissableBox] = await Promise.all([
      fetch(globalLibraryAlertBannerApiUrl),
      fetch(globalLibraryAlertDismissableBoxApiUrl),
    ]);
    console.log("globals")
    const dataSection1 = await globalLibraryAlertBanner.text();
    const dataSection2 = await globalLibraryAlertDismissableBox.text();
    // Parse the HTML
    const document1 = parseFromString(dataSection1, 'text/html');
    // globals.fullBannerAlert.title = document1.getElementsByTagName('h3')[0]?.textContent;
    globals.fullBannerAlert.text = document1.getElementById('s-lg-content-78281771').innerHTML;
    // Parse the HTML
    const document2 = parseFromString(dataSection2, 'text/html');
    // globals.libraryAlert.title = document2.getElementsByTagName('h3')[0].textContent;
    globals.libraryAlert.text = document2.getElementById('s-lg-content-78601329').innerHTML;
    console.log(globals)
    // Return the response from the external API
    return new Response(
      JSON.stringify(globals),{
        headers: {
          'Content-Type': 'application/json',
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
