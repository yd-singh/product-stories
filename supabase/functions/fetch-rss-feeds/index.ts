
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SeatableResponse {
  rows: Array<{
    [key: string]: any;
    _id: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Fetching RSS feeds from Seatable NewsCollections...')
    
    const seatableToken = Deno.env.get('SEATABLE_API_TOKEN')
    if (!seatableToken) {
      console.error('SEATABLE_API_TOKEN not found')
      return new Response(
        JSON.stringify({ 
          error: 'Configuration error: Missing API token',
          rssFeeds: [],
          total: 0
        }),
        { 
          status: 500, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }
    
    // First, get access token
    const authResponse = await fetch('https://cloud.seatable.io/api/v2.1/dtable/app-access-token/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${seatableToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!authResponse.ok) {
      const errorText = await authResponse.text()
      console.error(`Failed to get access token: ${authResponse.status} - ${errorText}`)
      throw new Error(`Failed to get access token: ${authResponse.status}`)
    }

    const authData = await authResponse.json()
    console.log('Got access token, fetching RSS data...')

    // Get table data
    const dataResponse = await fetch(`https://cloud.seatable.io/dtable-server/api/v1/dtables/${authData.dtable_uuid}/rows/?table_name=Table1`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${authData.access_token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!dataResponse.ok) {
      const errorText = await dataResponse.text()
      console.error(`Failed to fetch RSS data: ${dataResponse.status} - ${errorText}`)
      throw new Error(`Failed to fetch RSS data: ${dataResponse.status}`)
    }

    const data: SeatableResponse = await dataResponse.json()
    console.log(`Fetched ${data.rows.length} RSS feed entries`)

    // Log structure of first row to understand the schema
    if (data.rows.length > 0) {
      console.log('Available columns:', Object.keys(data.rows[0]))
      console.log('First row structure:', JSON.stringify(data.rows[0], null, 2))
    }

    // Transform the data to extract RSS feed information
    const rssFeeds = data.rows
      .filter(row => row.rss_url || row.url) // Filter rows that have RSS URLs
      .map(row => ({
        id: row._id,
        title: row.topic || row.headline || row.title || 'Unknown Topic',
        rss_url: row.rss_url || row.url,
        source: row.source || 'Unknown Source',
        description: row.description || row.news_summary || '',
        category: row.topic || 'General'
      }))

    console.log(`Transformed ${rssFeeds.length} RSS feeds`)

    return new Response(
      JSON.stringify({ rssFeeds, total: rssFeeds.length }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error fetching RSS feeds:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        rssFeeds: [],
        total: 0
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
