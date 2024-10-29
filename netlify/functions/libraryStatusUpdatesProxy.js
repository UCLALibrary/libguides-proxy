import { JSDOM } from 'jsdom';

const blocks = [
  {
    "id": "4243666",
    "typeHandle": "richText",
    "richText": "<ul><li><p dir=\"ltr\">All Library locations are operating normally.<strong> </strong>Please check <a href=\"https://www.library.ucla.edu/visit/locations/\"></a><a href=\"https://www.library.ucla.edu/visit/locations\">Locations &amp Hours</a> before visiting.</p></li><li dir=\"ltr\"><p dir=\"ltr\">For course reserves, check your reading lists in <a href=\"https://bruinlearn.ucla.edu/\" target=\"_blank\" rel=\"noreferrer noopener\">Bruin Learn</a> for materials access and locations. <br /></p></li><li dir=\"ltr\"><p dir=\"ltr\"><a href=\"https://www.library.ucla.edu/help/research-help/\">Research Help</a> is available through research consultations and other resources. Use <a href=\"https://www.library.ucla.edu/help/services-resources/ask-us\">Ask Us</a> for questions, including 24/7 chat.</p></li></ul>",
    "sectionTitle": "Access to Libraries and Services"
  },
  {
    "id": "4243668",
    "typeHandle": "richText",
    "richText": "<ul><li>Due to construction, Powell Library Reading Room is temporarily closed. Visit <a href=\"https://www.library.ucla.edu/help/services-resources/construction-closures-at-powell-library/\">Construction Closure at Powell Library</a> to learn how to access resources during the closure.</li></ul>",
    "sectionTitle": "Planned Library Construction"
  },
  {
    "id": "4243669",
    "typeHandle": "simpleCards",
    "sectionTitle": "Additional Campus Resources",
    "sectionSummary": null,
    "cards": [
      {
        "id": "4243670",
        "typeHandle": "externalServiceOrResource",
        "title": "Bruins Safe Online",
        "summary": "Information on the current campus status.",
        "externalLink": "https://bso.ucla.edu"
      },
      {
        "id": "4243986",
        "typeHandle": "externalServiceOrResource",
        "title": "Bruin Safety & Well-Being",
        "summary": "Resources and services to assist the campus community during difficult times.",
        "externalLink": "https://equity.ucla.edu/bruin-safety-well-being/?mc_cid=024964e8ea&mc_eid=9ef0760ab7"
      }
    ]
  },
  {
    "id": "4243671",
    "typeHandle": "callToAction",
    "callToAction": [
      {
        "id": "4243672",
        "titleCta": "Have Further Questions?",
        "summary": "We're here to help. Chat with a librarian 24/7, schedule a research consultation or email us your quick questions.",
        "icon": "svg-call-to-action-chat",
        "buttonText": "Contact us",
        "buttonUrl": "https://www.library.ucla.edu/help/services-resources/ask-us",
        "backgroundColor": "false"
      }
    ]
  }
]

export default async (request) => {
  // We have not built a component for this yet for the main library website
  
  const libraryStatusUpdateSection1ApiUrl = 'https://lgapi-us.libapps.com/widgets.php?site_id=705&widget_type=8&output_format=1&widget_embed_type=2&guide_id=1427138&box_id=33464944&map_id=39354145&content_only=0&include_jquery=1&config_id=1729804600932' 
  const libraryStatusUpdateSection2ApiUrl = 'https://lgapi-us.libapps.com/widgets.php?site_id=705&widget_type=8&output_format=1&widget_embed_type=2&guide_id=1427138&box_id=33464982&map_id=39354184&content_only=0&include_jquery=1&config_id=1729804613204' 
  
  const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*', // Allows all origins (you can restrict this to specific domains)
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
 
  try {
    // Fetch data from external API
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: CORS_HEADERS
      })
    }
     // Fetch data from both sections
     const [responseSection1, responseSection2] = await Promise.all([
      fetch(libraryStatusUpdateSection1ApiUrl),
      fetch(libraryStatusUpdateSection2ApiUrl),
    ])

    const dataSection1 = await responseSection1.text()
    const dataSection2 = await responseSection2.text()

    // Helper function to extract HTML nodes after <h3>
    const extractHTMLAfterH3 = (htmlString, id) => {
      const dom = new JSDOM(htmlString);
      const document = dom.window.document;
      const contentDiv = document.getElementById(id)
      if (!contentDiv) {
        console.log("contentDiv not found");
        return '';
      }

      const h3Element = contentDiv.querySelector('h3');
      if (!h3Element) {
        console.log("h3 not found");
        return '';
      }

      let contentAfterH3 = '';
      let sibling = h3Element.nextElementSibling;

      while (sibling) {
        contentAfterH3 += sibling.outerHTML || '';
        sibling = sibling.nextElementSibling;
      }

      console.log("Final contentAfterH3:", contentAfterH3);
      return contentAfterH3;
    }

    // Process each section and extract HTML nodes after <h3>
    blocks[0].richText = extractHTMLAfterH3(dataSection1, 's-lg-content-78601395')
    blocks[1].richText = extractHTMLAfterH3(dataSection2, 's-lg-content-78601402')
    
    
    // Return the response from the external API
    return new Response(
      JSON.stringify(blocks),{
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
    )
  }
}
