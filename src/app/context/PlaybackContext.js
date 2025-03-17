"use client";
import { createContext, useState, useRef, useContext, useEffect } from "react";

export const PlaybackContext = createContext();

export const PlaybackContextProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  useEffect(() => {
    if (!currentAlbum || currentSongIndex === null) return;
    const audio = new Audio(currentAlbum?.musicLinks[currentSongIndex]|| currentAlbum?.downloadLink);
    audioRef.current = audio;
    audioRef.current.volume = volume / 100;

    if (isPlaying) {
      audio.play();
    }

    audio.addEventListener("ended", playNextSong);

    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("ended", playNextSong);
    };
  }, [currentAlbum, currentSongIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNextSong = () => {
    if (!currentAlbum) return;
    setCurrentSongIndex((prev) => (prev + 1) % currentAlbum.songs.length);
  };

  return (
    <PlaybackContext.Provider
      value={{
        currentAlbum,
        setCurrentAlbum,
        currentSongIndex,
        setCurrentSongIndex,
        isPlaying,
        togglePlay,
        playNextSong,
        volume,
        setVolume,
        isMuted,
        setIsMuted,
        isShuffled,
        setIsShuffled,
        audioRef
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
};

export const usePlaybackContext = () => useContext(PlaybackContext);
