import { parseFromString } from 'dom-parser'
import { JSDOM } from 'jsdom';

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
    const dom = new JSDOM(dataSection2);
    const document2 = dom.window.document;
    const contentDiv = document2.getElementById('s-lg-content-78601329')
    if (!contentDiv) {
      console.log("contentDiv not found");
      return '';
    }
   
    const h3Element = contentDiv.querySelector('h3');
    if (!h3Element) {
      console.log("h3 not found");
      return '';
    }
    globals.libraryAlert.title = h3Element.textContent
    let contentAfterH3 = '';
    let sibling = h3Element.nextElementSibling;
    while (sibling) {
      contentAfterH3 += sibling.outerHTML || '';
      sibling = sibling.nextElementSibling;
    }

    console.log("Final contentAfterH3:", contentAfterH3);
    // globals.libraryAlert.title = document2.getElementsByTagName('h3')[0].textContent;
    globals.libraryAlert.text = contentAfterH3
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
