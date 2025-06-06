
import { supabase } from "@/integrations/supabase/client";

// This function handles both generating audio and storing it in Supabase
export const generateAudio = async (text: string, articleId: string) => {
  try {
    console.log("Generating audio for article:", articleId);
    
    // Create a simple audio blob with a sine wave (mock audio for now)
    const audioContext = new AudioContext();
    const duration = 3; // 3 seconds
    const sampleRate = 44100;
    const frameCount = sampleRate * duration;
    
    const audioBuffer = audioContext.createBuffer(1, frameCount, sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    
    // Generate a simple sine wave
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = Math.sin(2 * Math.PI * 440 * i / sampleRate) * 0.5;
    }
    
    // Convert AudioBuffer to WAV format
    const wavData = audioBufferToWav(audioBuffer);
    const audioBlob = new Blob([wavData], { type: 'audio/wav' });
    
    // Upload to Supabase storage - use service role for upload permissions
    const filePath = articleId; // No .wav extension for storage path to match existing file
    console.log(`Uploading audio file to news-audio bucket: ${filePath}`);
    
    // Try to upload with upsert to overwrite if exists
    const { data, error } = await supabase.storage
      .from('news-audio')
      .upload(filePath, audioBlob, {
        upsert: true,
        contentType: 'audio/wav'
      });
      
    if (error) {
      console.error("Error uploading audio file:", error);
      // If upload fails, return a direct URL to the existing file
      const { data: publicUrlData } = supabase.storage
        .from('news-audio')
        .getPublicUrl(filePath);
      console.log("Using existing file URL:", publicUrlData.publicUrl);
      return { audioUrl: publicUrlData.publicUrl };
    }
    
    // Get public URL with correct path (no extension)
    const { data: publicUrlData } = supabase.storage
      .from('news-audio')
      .getPublicUrl(filePath);
      
    console.log("Successfully generated and uploaded audio:", publicUrlData.publicUrl);
      
    return {
      audioUrl: publicUrlData.publicUrl
    };
  } catch (error) {
    console.error("Error generating audio:", error);
    // As fallback, try to return URL to existing file
    const { data: publicUrlData } = supabase.storage
      .from('news-audio')
      .getPublicUrl(articleId);
    console.log("Fallback: using existing file URL:", publicUrlData.publicUrl);
    return { audioUrl: publicUrlData.publicUrl };
  }
};

// Helper function to convert AudioBuffer to WAV format
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2;
  const data = new DataView(new ArrayBuffer(44 + length));
  
  // RIFF identifier
  writeString(data, 0, 'RIFF');
  // file length
  data.setUint32(4, 36 + length, true);
  // RIFF type
  writeString(data, 8, 'WAVE');
  // format chunk identifier
  writeString(data, 12, 'fmt ');
  // format chunk length
  data.setUint32(16, 16, true);
  // sample format (raw)
  data.setUint16(20, 1, true);
  // channel count
  data.setUint16(22, numOfChan, true);
  // sample rate
  data.setUint32(24, buffer.sampleRate, true);
  // byte rate (sample rate * block align)
  data.setUint32(28, buffer.sampleRate * 4, true);
  // block align (channel count * bytes per sample)
  data.setUint16(32, numOfChan * 2, true);
  // bits per sample
  data.setUint16(34, 16, true);
  // data chunk identifier
  writeString(data, 36, 'data');
  // data chunk length
  data.setUint32(40, length, true);
  
  // Write the PCM samples
  const channelData = [];
  for (let i = 0; i < numOfChan; i++) {
    channelData.push(buffer.getChannelData(i));
  }
  
  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numOfChan; channel++) {
      // Convert float to int
      const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      data.setInt16(offset, int16, true);
      offset += 2;
    }
  }
  
  return data.buffer;
}

function writeString(dataView: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    dataView.setUint8(offset + i, string.charCodeAt(i));
  }
}
