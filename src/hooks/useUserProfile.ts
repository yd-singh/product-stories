
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface UserProfile {
  id: string;
  user_id: string;
  credits: number;
  auto_transcribe: boolean;
  auto_broadcast: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserTopic {
  id: string;
  user_id: string;
  topic_name: string;
  rss_url: string | null;
  is_active: boolean;
  auto_research: boolean;
  auto_history: boolean;
  auto_debate: boolean;
  auto_fact_check: boolean;
  auto_late_night: boolean;
  auto_podcast: boolean;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user) return null;
      
      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    enabled: !!user,
  });
};

export const useUserTopics = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userTopics', user?.id],
    queryFn: async (): Promise<UserTopic[]> => {
      if (!user) return [];
      
      const { data, error } = await (supabase as any)
        .from('user_topics')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useCreateTopic = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (topic: Omit<UserTopic, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await (supabase as any)
        .from('user_topics')
        .insert({
          ...topic,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTopics'] });
      toast({
        title: "Topic Created",
        description: "Your new topic has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create topic. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast({
        title: "Profile Updated",
        description: "Your preferences have been saved.",
      });
    },
  });
};
