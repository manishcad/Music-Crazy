"use client";
import { useState, useEffect, useRef } from "react";
import "../styles/musicplayer.css";
import Image from "next/image";
import { FaPlay, FaPause, FaTimes, FaMinus, FaVolumeUp, FaVolumeMute, FaRandom } from "react-icons/fa";

const colorOptions = ["#FFAB76 ", "#1A1A2E", "#D8BFD8 ", "#ff33a8", "#C5E1A5 "]; // Sample color themes

const MusicPlayer = ({ album, currentSongIndex, setCurrentSongIndex, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);
    const [accentColor, setAccentColor] = useState(colorOptions[0]); // Default color

    const audioRef = useRef(null);
    const songOrderRef = useRef([...Array(album.songs.length).keys()]); // Keeps track of song order
    const song = album.songs[songOrderRef.current[currentSongIndex]];

    useEffect(() => {
        if (!song) return;
        setIsLoading(true);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }

        const audio = new Audio(album.musicLinks[songOrderRef.current[currentSongIndex]]);
        audioRef.current = audio;
        audioRef.current.volume = volume / 100;

        audioRef.current.oncanplay = () => {
            setDuration(audioRef.current.duration);
            setIsLoading(false);
            audioRef.current.play().catch((error) => console.error("Play error:", error));
            setIsPlaying(true);
        };

        const updateProgress = () => setCurrentTime(audioRef.current.currentTime);
        audioRef.current.addEventListener("timeupdate", updateProgress);
        audioRef.current.onended = playNextSong;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current.removeEventListener("timeupdate", updateProgress);
            }
        };
    }, [song]);

    const togglePlay = () => {
        if (!audioRef.current || isLoading) return;
        isPlaying ? audioRef.current.pause() : audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    const toggleShuffle = () => setIsShuffled(!isShuffled);

    const playNextSong = () => setCurrentSongIndex((prevIndex) => (prevIndex + 1) % album.songs.length);
    const playPreviousSong = () => setCurrentSongIndex((prevIndex) => (prevIndex - 1 + album.songs.length) % album.songs.length);

    const handleSeek = (e) => {
        const barWidth = e.target.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        const seekTime = (clickX / barWidth) * duration;
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        audioRef.current.volume = newVolume / 100;
        setIsMuted(newVolume === "0");
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        audioRef.current.volume = isMuted ? volume / 100 : 0;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    if (!song) return null;

    return (
        <div 
            className={`music-player ${isMinimized ? "minimized" : ""}`} 
            style={{ backgroundColor: accentColor, borderColor: accentColor }}
        >
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

                    <div className="progress-container" onClick={handleSeek} style={{ background: "#00000050" }}>
                        <div className="progress-bar" style={{ width: `${(currentTime / duration) * 100}%`, background: "#ffffff" }}></div>
                    </div>
                    <div className="time-info">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>

                    <div className="player-controls">
                        <button onClick={playPreviousSong} className="control-btn">⏮</button>
                        <button onClick={togglePlay} className="control-btn">
                            {isLoading ? <div className="loader"></div> : isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
                        </button>
                        <button onClick={playNextSong} className="control-btn">⏭</button>
                        <button onClick={toggleShuffle} className={`control-btn shuffle-btn ${isShuffled ? "active" : ""}`}>
                            <FaRandom size={20} />
                        </button>
                    </div>

                    <div className="volume-container">
                        <button onClick={toggleMute} className="volume-btn">
                            {isMuted || volume === "0" ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                        </button>
                        <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} className="volume-slider" />
                    </div>

                    {/* Color Picker */}
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
