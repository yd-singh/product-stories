
import { supabase } from "@/integrations/supabase/client";
import { generateAudio } from "@/api/generate-audio";

// Function to check if audio file exists in storage and return URL
export const getAudioUrl = async (articleId: string): Promise<string> => {
  try {
    const audioFilePath = articleId;
    console.log("Getting audio file URL:", audioFilePath);
    
    // Get the public URL for the audio file
    const { data: publicUrl } = supabase
      .storage
      .from('news-audio')
      .getPublicUrl(audioFilePath);
      
    console.log("Generated public URL:", publicUrl.publicUrl);
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
    
    // Test if the audio file actually exists with a more robust check
    try {
      console.log("Testing if audio file exists at:", audioUrl);
      const response = await fetch(audioUrl, { 
        method: 'HEAD',
        mode: 'cors'
      });
      console.log("HEAD request response status:", response.status);
      
      // If file exists and is accessible, use it
      if (response.ok && response.status === 200) {
        console.log("Audio file exists and is accessible, using URL:", audioUrl);
        return audioUrl;
      }
    } catch (fetchError) {
      console.log("Audio file not accessible or error:", fetchError);
    }
    
    // If file doesn't exist or isn't accessible, generate new audio
    console.log("Generating new audio for article:", article.id);
    const { audioUrl: generatedUrl } = await generateAudio(`${article.headline}. ${article.aiSummary}`, article.id);
    return generatedUrl;
  } catch (error) {
    console.error("Error in getOrGenerateAudio:", error);
    // As final fallback, return the URL and let the player handle it
    return await getAudioUrl(article.id);
  }
};

// Function to play audio from URL with better error handling
export const playAudioFromUrl = async (audioUrl: string): Promise<HTMLAudioElement> => {
  console.log("Playing audio from URL:", audioUrl);
  
  const audio = new Audio();
  
  return new Promise((resolve, reject) => {
    // Set up all event listeners before setting src
    audio.addEventListener('canplaythrough', () => {
      console.log("Audio can play through, starting playback");
      audio.play()
        .then(() => {
          console.log("Audio playback started successfully");
          resolve(audio);
        })
        .catch((playError) => {
          console.error("Error starting audio playback:", playError);
          reject(playError);
        });
    });
    
    audio.addEventListener('error', (errorEvent) => {
      console.error("Audio loading error:", errorEvent);
      console.error("Audio error details:", {
        error: audio.error,
        networkState: audio.networkState,
        readyState: audio.readyState,
        src: audio.src
      });
      reject(new Error(`Audio failed to load: ${audio.error?.message || 'Unknown error'}`));
    });
    
    audio.addEventListener('loadstart', () => {
      console.log("Audio loading started");
    });
    
    audio.addEventListener('loadeddata', () => {
      console.log("Audio data loaded");
    });

    audio.addEventListener('loadedmetadata', () => {
      console.log("Audio metadata loaded");
    });
    
    // Set CORS mode and src
    audio.crossOrigin = "anonymous";
    audio.src = audioUrl;
    
    // Load the audio
    audio.load();
  });
};
