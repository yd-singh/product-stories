
import { supabase } from "@/integrations/supabase/client";
import { generateAudio } from "@/api/generate-audio";

// Function to check if audio file exists in storage and return URL
export const getAudioUrl = async (articleId: string): Promise<string> => {
  try {
    const audioFilePath = `${articleId}.wav`;
    console.log("Checking for audio file:", audioFilePath);
    
    // Try to get the audio file URL
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
    // First try to get existing audio
    const audioUrl = await getAudioUrl(article.id);
    
    // Test if the audio exists by creating a test element
    return new Promise((resolve, reject) => {
      const testAudio = new Audio(audioUrl);
      
      const onLoad = () => {
        console.log("Audio file exists, using URL:", audioUrl);
        testAudio.removeEventListener('loadeddata', onLoad);
        testAudio.removeEventListener('error', onError);
        resolve(audioUrl);
      };
      
      const onError = async () => {
        console.log("Audio file not found, generating new audio...");
        testAudio.removeEventListener('loadeddata', onLoad);
        testAudio.removeEventListener('error', onError);
        
        try {
          const text = `${article.headline}. ${article.aiSummary}`;
          const { audioUrl: generatedUrl } = await generateAudio(text, article.id);
          resolve(generatedUrl);
        } catch (err) {
          console.error("Failed to generate audio:", err);
          reject(err);
        }
      };
      
      testAudio.addEventListener('loadeddata', onLoad);
      testAudio.addEventListener('error', onError);
      
      // Set a timeout in case neither event fires
      setTimeout(() => {
        testAudio.removeEventListener('loadeddata', onLoad);
        testAudio.removeEventListener('error', onError);
        onError();
      }, 3000);
    });
  } catch (error) {
    console.error("Error in getOrGenerateAudio:", error);
    throw error;
  }
};

// Function to play audio from URL
export const playAudioFromUrl = async (audioUrl: string): Promise<HTMLAudioElement> => {
  console.log("Playing audio from URL:", audioUrl);
  
  const audio = new Audio(audioUrl);
  
  await audio.play();
  
  return audio;
};
