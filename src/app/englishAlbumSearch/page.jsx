"use client";
import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import { MdLibraryMusic } from "react-icons/md";
import styles from "../styles/hindiAlbum.module.css";
import { MusicPlayerContext } from "../context/MusicPlayerContext";
import { CiPlay1 } from "react-icons/ci";
import Image from "next/image";
import { useRouter } from "next/navigation";
const EnglishAlbumSearch = () => {
    const router=useRouter()
    const { playSong } = useContext(MusicPlayerContext);
    const searchParams = useSearchParams();
    const query = searchParams.get("search");

    const [album, setAlbum] = useState(null);
    

    useEffect(() => {
        if (query) {
            fetchAlbumDetails();
            console.log(album)
        }
    }, [query]);

    const fetchAlbumDetails = async () => {
        if (!query) return; // ✅ Ensure query exists before fetching

 
        try {
            console.log(`Fetching data for query: ${query}`); // ✅ Debugging log
            const response = await axios.get(`/api/englishAlbumSearch?search=${query}`);

            console.log("API Response:", response.data); // ✅ Check if API returns data
            if (response.data && response.data.data) {
                setAlbum(response.data.data);
            } else {
                setAlbum(null);
            }
        } catch (error) {
            console.error("Error fetching album details:", error);
        } finally {
            console.log()// ✅ Always stop loading
        }
    };



    if (!album) return <p className="error">Album not found.</p>;

    return (
        <div className={styles.albumContainer}>
            <h2 className={styles.albumTitle}>
                <MdLibraryMusic /> {album.title}
                <p>{query}</p>
            </h2>

            <div className={styles.songsList}>
                <h3><MdLibraryMusic /> Songs/Albums</h3>
                <ul>
                    {album.map((song, index) => (
                        <li key={index}  className={styles.songItem} onClick={()=>router.push(`/englishAlbum?link=${song.postsearch}`)}>
                            <Image src={song.albumCover || "/default-cover.jpg"} alt={"albums"} className={styles.albumCover} width={50} height={50}/>
                            <div className={styles.songInfo}>
                                <h4 style={{cursor:"pointer"}}>{song.title}</h4>
                                
                                
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default EnglishAlbumSearch;
