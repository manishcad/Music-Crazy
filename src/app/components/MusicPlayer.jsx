"use client";
import { useState, useEffect, useRef } from "react";
import "../styles/musicplayer.css";
import Image from 'next/image';
import { FaPlay, FaPause, FaTimes, FaMinus } from "react-icons/fa";

const MusicPlayer = ({ album, currentSongIndex, setCurrentSongIndex, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    const song = album.songs[currentSongIndex];

    useEffect(() => {
        if (!song) return;
    
        // Pause and reset previous audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
    
        // Create new audio object
        const audio = new Audio(album.musicLinks[currentSongIndex]);
        audioRef.current = audio;
    
        // Play the audio after ensuring it's ready
        audioRef.current.oncanplay = () => {
            setDuration(audioRef.current.duration); // Set duration
            audioRef.current.play().catch(error => console.error("Play error:", error));
            setIsPlaying(true);
        };
    
        // Update progress bar
        const updateProgress = () => {
            setCurrentTime(audioRef.current.currentTime);
        };
    
        audioRef.current.addEventListener("timeupdate", updateProgress);
    
        // Auto-play next song when current song ends
        audioRef.current.onended = () => {
            playNextSong();
        };
    
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current.removeEventListener("timeupdate", updateProgress);
            }
        };
    }, [song]);
    
    
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
        let nextIndex = (currentSongIndex + 1) % album.songs.length;
        setCurrentSongIndex(nextIndex);
    };

    const playPreviousSong = () => {
        let prevIndex = (currentSongIndex - 1 + album.songs.length) % album.songs.length;
        setCurrentSongIndex(prevIndex);
    };

    const handleSeek = (e) => {
        const barWidth = e.target.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        const seekTime = (clickX / barWidth) * duration;
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    if (!song) return null;

    return (
        <div className={`music-player ${isMinimized ? "minimized" : ""}`}>
            {!isMinimized ? (
                <>
                    <div className="player-header">
                        <button className="minimize-btn" onClick={() => setIsMinimized(true)}>
                            <FaMinus />
                        </button>
                        <button className="close-btn" onClick={onClose}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="player-info">
                        <Image width={50} height={50} alt={song.songName} src={album.image} className="album-image" />
                        <p className="song-title">{song.songName}</p>
                    </div>
                    
                    <div className="progress-container" onClick={handleSeek}>
                        <div className="progress-bar" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                    </div>
                    <div className="time-info">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>

                    <div className="player-controls">
                        <button onClick={playPreviousSong} className="control-btn">⏮</button>
                        <button onClick={togglePlay} className="control-btn">
                            {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
                        </button>
                        <button onClick={playNextSong} className="control-btn">⏭</button>
                    </div>
                </>
            ) : (
                <div className="minimized-controls">
                    <button className="minimize-btn" onClick={() => setIsMinimized(false)}>
                        <FaMinus />
                    </button>
                    <button className="minimized-btn" onClick={() => setIsMinimized(false)}>
                        <Image width={50} height={50} alt={song.songName} src={album.image} />
                    </button>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
            )}
        </div>
    );
};

export default MusicPlayer;
