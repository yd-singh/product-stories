
import { useQuery } from "@tanstack/react-query";

export interface RSSFeed {
  id: string;
  title: string;
  rss_url: string;
  source: string;
  description: string;
  category: string;
}

export const useRSSFeeds = () => {
  return useQuery({
    queryKey: ['rssFeeds'],
    queryFn: async (): Promise<RSSFeed[]> => {
      const response = await fetch('/api/functions/v1/fetch-rss-feeds', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch RSS feeds');
      }

      const data = await response.json();
      return data.rssFeeds || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
