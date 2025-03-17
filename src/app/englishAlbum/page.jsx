"use client";
import { useEffect, useState,useContext } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { FaDownload, FaMusic } from "react-icons/fa";
import { MdLibraryMusic } from "react-icons/md";
import styles from "../styles/hindiAlbum.module.css";
import { MusicPlayerContext } from "../context/MusicPlayerContext";
import { CiPlay1 } from "react-icons/ci";
import Image from "next/image";

const EnglishAlbum = () => {
    const { playSong } = useContext(MusicPlayerContext);
    const searchParams = useSearchParams();
    const albumLink = searchParams.get("link");
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (albumLink) {
            fetchAlbumDetails();
        }
    }, [albumLink]);

    const fetchAlbumDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/englishAlbum?link=${encodeURIComponent(albumLink)}`);
            setAlbum(response.data);
        } catch (error) {
            console.error("Error fetching album details:", error);
        }
        setLoading(false);
    };

    if (loading) return <p className="loading">Loading album details...</p>;

    if (!album) return <p className="error">Album not found.</p>;

    return (
        <div className={styles.albumContainer}>
        <h2 className={styles.albumTitle}>
            <MdLibraryMusic /> {album.title}
        </h2>
        
        <div className={styles.songsList}>
            <h3><MdLibraryMusic /> Songs</h3>
            <ul>
                {album.albumData.map((song, index) => (
                    <li key={index} className={styles.songItem}>
                        <Image width={50} height={50} src={song.image} alt={song.songName} className={styles.albumCover} />
                        <div className={styles.songInfo}>
                            <h4>{song.songName}</h4>
                            
                            <div className={styles.downloadContainer}>
                                <a href={song.downloadLink} target="_blank" rel="noopener noreferrer" className={styles.downloadLink}>
                                    <FaDownload /> Download
                                </a>
                                <span style={{color:"red", cursor:"pointer",display:"flex",alignItems:"center"}} onClick={() => playSong(song, index)}>
                                        <CiPlay1 className="music-play-btn" />Play
                                    </span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
    

    );
};

export default EnglishAlbum;
