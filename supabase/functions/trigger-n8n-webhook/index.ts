
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WebhookRequest {
  endpoint: string;
  newsId: string;
  debateTopic?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, newsId, debateTopic }: WebhookRequest = await req.json();

    // Get Basic Auth credentials from environment
    const username = Deno.env.get("N8N_API_USERNAME");
    const password = Deno.env.get("N8N_API_PASSWORD");

    if (!username || !password) {
      throw new Error("N8N API credentials not configured");
    }

    // Create Basic Auth header
    const basicAuth = btoa(`${username}:${password}`);
    
    // Prepare the request body based on the endpoint
    let body: any = { newsId };
    
    if (endpoint === 'debate' && debateTopic) {
      body.debateTopic = debateTopic;
    }

    // Make the request to the n8n webhook
    const webhookUrl = `https://n8n.srv848613.hstgr.cloud/webhook/${endpoint}`;
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`N8N webhook failed with status ${response.status}`);
    }

    const result = await response.json();

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in trigger-n8n-webhook function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
