
import { supabase } from "@/integrations/supabase/client";
import { generateAudio } from "@/api/generate-audio";

// Function to check if audio file exists in storage and return URL
export const getAudioUrl = async (articleId: string): Promise<string> => {
  try {
    const audioFilePath = `${articleId}.wav`;
    console.log("Getting audio file URL:", audioFilePath);
    
    // Get the public URL for the audio file
    const { data: publicUrl } = supabase
      .storage
      .from('news-audio')
      .getPublicUrl(audioFilePath);
      
    return publicUrl.publicUrl;
  } catch (error) {
    console.error("Error getting audio URL:", error);
    throw error;
  }
};

// Function to get or generate audio for an article
export const getOrGenerateAudio = async (article: { id: string; headline: string; aiSummary: string }): Promise<string> => {
  try {
    // First try to get existing audio URL
    const audioUrl = await getAudioUrl(article.id);
    
    // Test if the audio file actually exists by making a HEAD request
    try {
      const response = await fetch(audioUrl, { method: 'HEAD' });
      if (response.ok) {
        console.log("Audio file exists, using URL:", audioUrl);
        return audioUrl;
      }
    } catch (fetchError) {
      console.log("Audio file not found, generating new audio...");
    }
    
    // If file doesn't exist, generate new audio
    const { audioUrl: generatedUrl } = await generateAudio(`${article.headline}. ${article.aiSummary}`, article.id);
    return generatedUrl;
  } catch (error) {
    console.error("Error in getOrGenerateAudio:", error);
    throw error;
  }
};

// Function to play audio from URL
export const playAudioFromUrl = async (audioUrl: string): Promise<HTMLAudioElement> => {
  console.log("Playing audio from URL:", audioUrl);
  
  const audio = new Audio(audioUrl);
  
  return new Promise((resolve, reject) => {
    audio.addEventListener('canplaythrough', () => {
      audio.play()
        .then(() => resolve(audio))
        .catch(reject);
    });
    
    audio.addEventListener('error', reject);
    
    // Load the audio
    audio.load();
  });
};
