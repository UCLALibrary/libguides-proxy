import fetch from 'node-fetch';

exports.handler = async () => {
  const apiUrl = 'https://lgapi-us.libapps.com/widget_box.php?site_id=705&widget_type=8&output_format=2&widget_title=Library+Alert&widget_height=250&widget_width=100%25&guide_id=1427138&box_id=33325708&map_id=39190263&content_only=0&include_jquery=1&config_id=1727199122170';

  try {
    // Fetch data from external API
    const response = await fetch(apiUrl);
    const data = await response.text(); // Using .text() because the content might not be JSON

    // Return the response from the external API
    return {
      statusCode: 200,
      body: data,
      headers: {
        'Content-Type': 'text/html' // Adjust if necessary
      }
    };
  } catch (error) {
    // Handle any errors
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred', details: error.toString() })
    };
  }
};
