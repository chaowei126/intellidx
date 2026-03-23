import os
import uuid
from gtts import gTTS

def generate_audio_summary(content: str) -> str:
    """
    Generate an audio summary using Google Text-to-Speech (gTTS).
    This simulates the Gemini-Batch-TTS system.
    """
    if not content or len(content) < 5:
        return ""
        
    print("Generating audio summary with gTTS...")
    
    try:
        # Create output directory mapping locally, matching storage.py strategy
        output_dir = "/app/outputs"
        os.makedirs(output_dir, exist_ok=True)
        
        audio_filename = f"summary_{uuid.uuid4().hex[:8]}.mp3"
        local_path = os.path.join(output_dir, audio_filename)
        
        # Create TTS in Japanese
        tts = gTTS(text=content, lang='ja', slow=False)
        tts.save(local_path)
        
        print(f"Audio summary generated at {local_path}")
        
        # Return the actual local path so `storage.py` can upload/copy it later
        return local_path
    except Exception as e:
        print(f"Failed to generate audio summary: {e}")
        return ""
