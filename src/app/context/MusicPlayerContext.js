"use client";
import { createContext, useState, useRef } from "react";

export const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
    const [album, setAlbum] = useState(null);
    const [currentSongIndex, setCurrentSongIndex] = useState(null);
    const audioRef = useRef(null); // Maintain audio element across pages

    const playSong = (albumData, songIndex) => {
        console.log(albumData,'look here this albumData')
        setAlbum(albumData);
        setCurrentSongIndex(songIndex);
    };

    return (
        <MusicPlayerContext.Provider value={{ album, currentSongIndex, setCurrentSongIndex, playSong, audioRef }}>
            {children}
        </MusicPlayerContext.Provider>
    );
};
