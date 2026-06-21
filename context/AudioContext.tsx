"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface AudioContextType {
  isPlaying: boolean;
  togglePlayback: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Module-level singletons — survive React unmounts / route changes
let globalAudio: HTMLAudioElement | null = null;
let userPaused = false;

function getOrCreateAudio(): HTMLAudioElement {
  if (!globalAudio) {
    const audioPath =
      "/audio/" +
      encodeURIComponent("This World Is Not My Home - Jim Reeves.mp3");
    globalAudio = new Audio(audioPath);
    globalAudio.loop = true;
  }
  return globalAudio;
}

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof window === "undefined") return false;
    return !getOrCreateAudio().paused;
  });

  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    const audio = getOrCreateAudio();

    const attemptAutoplay = () => {
      if (!audio.paused) return;
      if (userPaused) return; // 👈 respect user's intent

      audio
        .play()
        .then(() => {
          removeInteractionListeners();
        })
        .catch(() => {
          console.log("Autoplay blocked — waiting for user interaction.");
        });
    };

    const removeInteractionListeners = () => {
      window.removeEventListener("click", attemptAutoplay);
      window.removeEventListener("touchstart", attemptAutoplay);
      window.removeEventListener("keydown", attemptAutoplay);
    };

    attemptAutoplay();

    window.addEventListener("click", attemptAutoplay);
    window.addEventListener("touchstart", attemptAutoplay);
    window.addEventListener("keydown", attemptAutoplay);

    const handlePause = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
    };
    const handlePlay = () => {
      setIsPlaying(true);
      isPlayingRef.current = true;
    };

    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    return () => {
      removeInteractionListeners();
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
    };
  }, []);

  const togglePlayback = () => {
    const audio = getOrCreateAudio();
    if (!audio.paused) {
      userPaused = true;  // 👈 user explicitly paused
      audio.pause();
    } else {
      userPaused = false; // 👈 user explicitly resumed
      audio.play().catch((err) => console.log("Playback error:", err));
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlayback }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be wrapped within an AudioProvider");
  }
  return context;
};