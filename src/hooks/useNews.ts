
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NewsItem {
  id: string;
  topic: string;
  headline: string;
  source: string;
  date: string;
  newsUrl: string;
  aiSummary: string;
}

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async (): Promise<NewsItem[]> => {
      console.log('Fetching news from Seatable...');
      
      const { data, error } = await supabase.functions.invoke('fetch-news');
      
      if (error) {
        console.error('Error invoking fetch-news function:', error);
        throw error;
      }
      
      if (data?.error) {
        console.error('Error from fetch-news function:', data.error);
        throw new Error(data.error);
      }
      
      console.log('News data received:', data);
      return data?.news || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
