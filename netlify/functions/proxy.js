export default async () => {
  const apiUrl = 'https://api.libguides.com/1.1/your-endpoint' // Replace with your external API URL

  try {
    // Fetch data from external API
    const response = await fetch(apiUrl)
    const data = await response.text()


    // Return the response from the external API
    return {
      statusCode: 200,
      body: data
    }

  } catch (error) {
    // Handle any errors
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred' })
    }
  }
}