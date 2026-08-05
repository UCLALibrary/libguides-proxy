import { parseFromString } from 'dom-parser'
import { JSDOM } from 'jsdom';

const globals = {
  infoAlert: {
    title: "",
    text: ""
  },
 bannerAlert:{
   // title: "Alert", //No title for full banner
    text: ""
  }
};
export default async (request) => {
  // We have not built a component for this yet for the main library website
  const globalFTVABannerApiUrl = 'https://lgapi-us.libapps.com/widgets.php?site_id=705&widget_type=8&output_format=1&widget_embed_type=2&guide_id=1427138&box_id=36316460&map_id=42745318&content_only=0&include_jquery=0&bs5_widget=0&config_id=1785887699766'; 
  const globalFTVADismissableBoxApiUrl = 'https://lgapi-us.libapps.com/widgets.php?site_id=705&widget_type=8&output_format=1&widget_embed_type=2&guide_id=1427138&box_id=36304418&map_id=42730650&content_only=0&include_jquery=0&bs5_widget=0&config_id=1784574546285'; 
 
  
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
    const [globalFTVABanner, globalFTVADismissableBox] = await Promise.all([
      fetch(globalFTVABannerApiUrl),
      fetch(globalFTVADismissableBoxApiUrl),
    ]);
    console.log("globals")
    const dataSection1 = await globalFTVABanner.text();
    const dataSection2 = await globalFTVADismissableBox.text();
    console.log("dataSection1",dataSection1)
    console.log("dataSection2",dataSection2)
    // Parse the HTML
    const document1 = parseFromString(dataSection1, 'text/html');
    globals.bannerAlert.text = document1.getElementById('s-lg-content-85612195')?.innerHTML;
    console.log("globals.bannerAlert.text",globals.bannerAlert.text)
    // Parse the HTML
    const dom = new JSDOM(dataSection2);
    const document2 = dom.window.document;
    const contentDiv = document2.getElementById('s-lg-content-85580763')
    console.log("contentDiv",contentDiv)
    if (contentDiv) {
      const h3Element = contentDiv.querySelector('h3');
      if (h3Element) {
        globals.infoAlert.title = h3Element?.textContent
        let contentAfterH3 = '';
        let sibling = h3Element.nextElementSibling;
        while (sibling) {
          contentAfterH3 += sibling.outerHTML || '';
          sibling = sibling.nextElementSibling;
        }

        console.log("Final contentAfterH3:", contentAfterH3);
        // globals.infoAlert.title = document2.getElementsByTagName('h3')[0].textContent;
        globals.infoAlert.text = contentAfterH3
      }
      
    }
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
