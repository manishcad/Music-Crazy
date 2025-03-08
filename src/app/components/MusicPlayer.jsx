"use client"
import { useState, useEffect, useContext } from "react";
import { MusicPlayerContext } from "../context/MusicPlayerContext";
import { FaPlay, FaPause, FaTimes, FaMinus, FaRandom, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import Image from "next/image";
import "../styles/musicplayer.css";

const colorOptions = ["#222", "#007bff", "#ff4081", "#6200ea", "#ff9800"];

const MusicPlayer = () => {
    const { album, currentSongIndex, setCurrentSongIndex, audioRef } = useContext(MusicPlayerContext);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);
    const [accentColor, setAccentColor] = useState("#222");

    useEffect(() => {
        if (!album || currentSongIndex === null) return;
        const songUrl = album.musicLinks[currentSongIndex];

        if (!audioRef.current) {
            audioRef.current = new Audio(songUrl);
        } else {
            audioRef.current.src = songUrl;
        }
        
        audioRef.current.play();
        setIsPlaying(true);
        
        audioRef.current.addEventListener("timeupdate", () => setCurrentTime(audioRef.current.currentTime));
        audioRef.current.addEventListener("loadedmetadata", () => setDuration(audioRef.current.duration));
    }, [album, currentSongIndex]);

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
        setCurrentSongIndex((prev) => (prev + 1) % album.songs.length);
    };

    const playPreviousSong = () => {
        setCurrentSongIndex((prev) => (prev - 1 + album.songs.length) % album.songs.length);
    };

    const toggleShuffle = () => {
        setIsShuffled(!isShuffled);
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e) => {
        setVolume(e.target.value);
        if (audioRef.current) {
            audioRef.current.volume = e.target.value / 100;
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const onClose = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setCurrentSongIndex(null);
    };

    if (!album || currentSongIndex === null) return null;

    return (
        <div className={`music-player ${isMinimized ? "minimized" : ""}`} style={{ backgroundColor: accentColor, borderColor: accentColor }}>
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
                        <Image width={50} height={50} alt={album.songs[currentSongIndex]?.songName} src={album.image} className="album-image" />
                        <p className="song-title">{album.songs[currentSongIndex]?.songName}</p>
                    </div>

                    <div className="progress-container" onClick={(e) => {
                        const newTime = (e.nativeEvent.offsetX / e.target.clientWidth) * duration;
                        audioRef.current.currentTime = newTime;
                        setCurrentTime(newTime);
                    }}>
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
                        <button onClick={toggleShuffle} className={`control-btn shuffle-btn ${isShuffled ? "active" : ""}`}>
                            <FaRandom size={20} />
                        </button>
                    </div>

                    <div className="volume-container">
                        <button onClick={toggleMute} className="volume-btn">
                            {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                        </button>
                        <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} className="volume-slider" />
                    </div>

                    <div className="color-picker">
                        {colorOptions.map((color, index) => (
                            <button 
                                key={index} 
                                className="color-option" 
                                style={{ background: color, border: accentColor === color ? "2px solid #fff" : "none" }} 
                                onClick={() => setAccentColor(color)}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className="minimized-controls">
                    <button className="minimize-btn" onClick={() => setIsMinimized(false)}>
                        <FaMinus />
                    </button>
                    <button className="minimized-btn" onClick={() => setIsMinimized(false)}>
                        <Image width={50} height={50} alt={album.songs[currentSongIndex]?.songName} src={album.image} />
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
