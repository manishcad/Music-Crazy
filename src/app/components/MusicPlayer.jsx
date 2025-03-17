"use client"
import { useState, useEffect, useContext } from "react";
import { MusicPlayerContext } from "../context/MusicPlayerContext";
import { FaPlay, FaPause, FaTimes, FaMinus, FaRandom, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import Image from "next/image";
import { ImSpinner8 } from "react-icons/im";
import "../styles/musicplayer.css";

const colorOptions = ["#222", "#007bff", "#ff4081", "#6200ea", "#ff9800"];

const MusicPlayer = () => {
    const { album, currentSongIndex, setCurrentSongIndex, audioRef } = useContext(MusicPlayerContext);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);
    const [accentColor, setAccentColor] = useState("#222");

    useEffect(() => {
        if (!album || currentSongIndex === null) return;
        const songUrl = album?.musicLinks ? album.musicLinks[currentSongIndex] : album?.downloadLink;


        if (!audioRef.current) {
            audioRef.current = new Audio(songUrl);
        } else {
            audioRef.current.src = songUrl;
        }
        setIsLoading(true);
        audioRef.current.play();
        setIsPlaying(true);
        
        const handleLoadedData = () => setIsLoading(false); // Stop loading once metadata is ready
        const handlePlaying = () => setIsLoading(false); // Stop loading once playback starts
        const handleWaiting = () => setIsLoading(true); // Show loading spinner when buffering
        const handleSongEnd = () => playNextSong();

        audioRef.current.addEventListener("loadeddata", handleLoadedData);
        audioRef.current.addEventListener("playing", handlePlaying);
        audioRef.current.addEventListener("waiting", handleWaiting);
        audioRef.current.addEventListener("ended", handleSongEnd); 
        audioRef.current.addEventListener("timeupdate", () => setCurrentTime(audioRef.current.currentTime));
        audioRef.current.addEventListener("loadedmetadata", () => setDuration(audioRef.current.duration));

        return () => {
            audioRef.current.removeEventListener("loadeddata", handleLoadedData);
            audioRef.current.removeEventListener("playing", handlePlaying);
            audioRef.current.removeEventListener("waiting", handleWaiting);
            audioRef.current.removeEventListener("ended", handleSongEnd);
        };
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
        setCurrentSongIndex((prevIndex) => {
            if (!album || album?.songs ?album.songs.length === 0:album.downloadLink.length==0) return null;
    
            // If shuffle mode is enabled, pick a random song
            if (isShuffled) {
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * album.songs.length);
                } while (randomIndex === prevIndex); // Avoid playing the same song again
                return randomIndex;
            }
    
            // Move to the next song, looping back to the first if at the end
            return (prevIndex + 1) % album.songs?.length ?(album.songs?.length):(1)
        });
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
                        <Image width={50} height={50} alt={album.songs ?(album.songs[currentSongIndex]?.songName):("")} src={album?.image ?(album?.image):(album?.albumCover)} className="album-image" />
                        <p className="song-title">{album?.songs ?(album?.songs[currentSongIndex]?.songName):(album?.songName)}</p>
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
                            {isLoading ? <ImSpinner8 className="spinner" size={24} /> : isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
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
                        <Image width={50} height={50} alt={"album image"} src={album?.image ?(album?.image):(album?.albumCover)} />
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
