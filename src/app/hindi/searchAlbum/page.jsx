"use client";
import { useEffect, useState,useContext } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { FaDownload, FaMusic } from "react-icons/fa";
import { MdLibraryMusic } from "react-icons/md";
import styles from "../../styles/hindiAlbum.module.css";
import { MusicPlayerContext } from "../../context/MusicPlayerContext";
import { CiPlay1 } from "react-icons/ci";
import { FaEye } from "react-icons/fa6";
const SearchAlbumPage = () => {
    const { playSong } = useContext(MusicPlayerContext);
    const searchParams = useSearchParams();
    const search = searchParams.get("search");
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (search) {
            fetchAlbumDetails();
        }
    }, [searchParams]);

    const fetchAlbumDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/hindiAlbumSearch?search=${search}`);
            setAlbum(response.data.allDetails);
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
            <h3><MdLibraryMusic /> Songs/Albums</h3>
            <ul>
                {album.map((song, index) => (
                    <li key={index} className={styles.songItem}>
                        <img src={song.image} alt={song.image} className={styles.albumCover} />
                        <div className={styles.songInfo}>
                            <h4>{song.name}</h4>
                            
                            <div className={styles.downloadContainer}>
                                <a href={`/hindi/album?link=`+song.link} rel="noopener noreferrer" className={styles.downloadLink}>
                                    <FaEye /> View
                                </a>
                                
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            {album.length<1 && <h1 style={{color:"red"}}>Not Found</h1>}
        </div>
    </div>
    

    );
};

export default SearchAlbumPage;
