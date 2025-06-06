
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const seatableApiToken = Deno.env.get('SEATABLE_API_TOKEN');
    
    if (!seatableApiToken) {
      throw new Error('SEATABLE_API_TOKEN not configured');
    }

    console.log('Fetching news from Seatable NewsCollections/Table1...');
    
    // First, get access token for the NewsCollections base
    const authResponse = await fetch('https://cloud.seatable.io/api/v2.1/dtable/app-access-token/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${seatableApiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!authResponse.ok) {
      throw new Error(`Seatable auth failed: ${authResponse.status}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;
    const dtableUuid = authData.dtable_uuid;
    
    console.log('Got access token, fetching news data from Table1...');

    // Now fetch the news data from Table1
    const newsResponse = await fetch(`https://cloud.seatable.io/dtable-server/api/v1/dtables/${dtableUuid}/rows/?table_name=Table1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!newsResponse.ok) {
      throw new Error(`Failed to fetch news: ${newsResponse.status}`);
    }

    const newsData = await newsResponse.json();
    console.log(`Fetched ${newsData.rows?.length || 0} news items from Table1`);

    // Transform the data to match our expected format
    const transformedNews = newsData.rows?.map((row: any) => ({
      id: row._id,
      topic: row.Topic || '',
      headline: row.Headline || '',
      source: row.Source || '',
      date: row.Date || '',
      newsUrl: row['News URL'] || row.newsUrl || '',
      aiSummary: row['AI News Summary'] || row.aiSummary || '',
    })) || [];

    return new Response(JSON.stringify({ news: transformedNews }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
