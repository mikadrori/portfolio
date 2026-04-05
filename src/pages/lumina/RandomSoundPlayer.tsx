import { useRef, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface RandomSoundPlayerProps {
  sounds?: string[];
  className?: string;
}

export function RandomSoundPlayer({
  sounds = [],
  className = "",
}: RandomSoundPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(() => {
    if (sounds.length === 0) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const randomIndex = Math.floor(Math.random() * sounds.length);
    const audio = new Audio(sounds[randomIndex]);
    audioRef.current = audio;

    audio.addEventListener("ended", () => setIsPlaying(false));
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [sounds]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const hasSounds = sounds.length > 0;

  return (
    <button
      onClick={isPlaying ? stop : play}
      disabled={!hasSounds}
      className={`flex items-center gap-3 px-6 py-3 rounded-[8px] transition-all
        ${hasSounds
          ? "bg-[#0d0439] hover:bg-[#1d1171] cursor-pointer"
          : "bg-[#d9d9d9] cursor-not-allowed"
        } ${className}`}
    >
      {isPlaying ? (
        <VolumeX size={20} className="text-[#fcf7ee]" />
      ) : (
        <Volume2 size={20} className={hasSounds ? "text-[#fcf7ee]" : "text-[#999]"} />
      )}
      <span
        className={`font-['Bricolage_Grotesque'] font-light text-[14px] tracking-[0.5px]
          ${hasSounds ? "text-[#fcf7ee]" : "text-[#999]"}`}
      >
        {hasSounds
          ? isPlaying
            ? "Stop"
            : "Play Random Sound"
          : "Sound files coming soon"}
      </span>
    </button>
  );
}
