"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
  isPlaying: boolean;
  togglePlayback: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 1. Strict guard: Make sure we are 100% inside the browser before doing anything
    if (typeof window === "undefined") return;

    const audioPath = "/audio/" + encodeURIComponent("This World Is Not My Home - Jim Reeves.mp3");
    const audio = new Audio(audioPath);
    audio.loop = true;
    audioRef.current = audio;

    const attemptAutoplay = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          removeInteractionListeners();
        })
        .catch((err) => {
          console.log("Autoplay blocked by browser policy. Awaiting user interaction.");
        });
    };

    const removeInteractionListeners = () => {
      if (typeof window === "undefined") return;
      window.removeEventListener("click", attemptAutoplay);
      window.removeEventListener("touchstart", attemptAutoplay);
      window.removeEventListener("keydown", attemptAutoplay);
    };

    // Run initial test
    attemptAutoplay();

    // Attach listeners safely on browser window object
    window.addEventListener("click", attemptAutoplay);
    window.addEventListener("touchstart", attemptAutoplay);
    window.addEventListener("keydown", attemptAutoplay);

    return () => {
      audio.pause();
      removeInteractionListeners();
    };
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .catch((err) => console.log("Playback error:", err));
      setIsPlaying(true);
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