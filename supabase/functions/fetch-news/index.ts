
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to decode HTML entities
const decodeHtmlEntities = (text: string): string => {
  const entityMap: { [key: string]: string } = {
    '&#39;': "'",
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
  };
  
  return text.replace(/&#39;|&quot;|&amp;|&lt;|&gt;|&nbsp;/g, (match) => entityMap[match] || match);
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

    // Log the first row to see the actual column names
    if (newsData.rows && newsData.rows.length > 0) {
      console.log('First row structure:', JSON.stringify(newsData.rows[0], null, 2));
      console.log('Available columns:', Object.keys(newsData.rows[0]));
    }

    // Transform the data to match our expected format
    // Try multiple possible column name variations
    const transformedNews = newsData.rows?.map((row: any) => {
      const getColumnValue = (possibleNames: string[]) => {
        for (const name of possibleNames) {
          if (row[name] !== undefined && row[name] !== null) {
            return row[name];
          }
        }
        return '';
      };

      return {
        id: row._id,
        topic: decodeHtmlEntities(getColumnValue(['Topic', 'topic', 'Category', 'category'])),
        headline: decodeHtmlEntities(getColumnValue(['Headline', 'headline', 'Title', 'title'])),
        source: decodeHtmlEntities(getColumnValue(['Source', 'source', 'Publisher', 'publisher'])),
        date: getColumnValue(['Date', 'date', 'Published', 'published', 'CreatedAt', 'created_at']),
        newsUrl: getColumnValue(['News URL', 'newsUrl', 'news_url', 'URL', 'url', 'Link', 'link']),
        aiSummary: decodeHtmlEntities(getColumnValue(['AI News Summary', 'aiSummary', 'ai_summary', 'Summary', 'summary', 'AI Summary', 'ai_news_summary', 'news_summary'])),
      };
    }) || [];

    console.log('Transformed news sample:', JSON.stringify(transformedNews.slice(0, 2), null, 2));

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
