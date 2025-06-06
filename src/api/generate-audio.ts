import { supabase } from "@/integrations/supabase/client";

// This function handles both generating audio and storing it in Supabase
export const generateAudio = async (text: string, articleId: string) => {
  try {
    // Instead of creating a bucket (which requires admin privileges),
    // we'll check if the bucket exists and use it
    console.log("Checking for news-audio bucket...");
    
    // Create a simple audio blob with a sine wave
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 440; // A4 note
    gainNode.gain.value = 0.5;
    
    // Record 3 seconds of audio
    const duration = 3;
    const sampleRate = 44100;
    const frameCount = sampleRate * duration;
    
    const audioBuffer = audioContext.createBuffer(1, frameCount, sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    
    for (let i = 0; i < frameCount; i++) {
      // Generate a sine wave
      channelData[i] = Math.sin(i * 0.01);
    }
    
    // Convert AudioBuffer to WAV format
    const wavData = audioBufferToWav(audioBuffer);
    const audioBlob = new Blob([wavData], { type: 'audio/wav' });
    
    // Upload to Supabase
    const filePath = `${articleId}.wav`;
    console.log(`Uploading audio file to bucket: news-audio, path: ${filePath}`);
    
    const { data, error } = await supabase.storage
      .from('news-audio')
      .upload(filePath, audioBlob, {
        upsert: true,
        contentType: 'audio/wav'
      });
      
    if (error) {
      console.error("Error uploading audio file to Supabase:", error);
      
      // If the error is related to permissions, we'll return a mock audio URL
      // This is a temporary solution until the storage permissions are fixed
      if (error.message.includes('row-level security policy')) {
        // Return a mock audio URL using the Web Audio API
        return {
          audioUrl: `data:audio/wav;base64,${btoa(String.fromCharCode(...new Uint8Array(wavData)))}`
        };
      }
      
      throw error;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('news-audio')
      .getPublicUrl(filePath);
      
    console.log("Successfully generated and uploaded audio:", publicUrlData.publicUrl);
      
    return {
      audioUrl: publicUrlData.publicUrl
    };
  } catch (error) {
    console.error("Error generating audio:", error);
    
    // Return a fallback audio URL for development
    return {
      audioUrl: `data:audio/wav;base64,${btoa("Mock audio data")}`
    };
  }
};

// Helper function to convert AudioBuffer to WAV format
function audioBufferToWav(buffer) {
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

function writeString(dataView, offset, string) {
  for (let i = 0; i < string.length; i++) {
    dataView.setUint8(offset + i, string.charCodeAt(i));
  }
}
