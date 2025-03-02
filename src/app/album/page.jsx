"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MusicPlayer from "../components/MusicPlayer";
import "../styles/album.css";
import { CiPlay1 } from "react-icons/ci";

const AlbumDetails = () => {
    const searchParams = useSearchParams();
    const url = searchParams.get("link");
    const [currentSongIndex, setCurrentSongIndex] = useState(null);
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentSong, setCurrentSong] = useState(null);

    useEffect(() => {
        if (!url) return;
        console.log(currentSong,"this is the current song")
        setLoading(true);
        fetch(`/api/singlealbum?link=${encodeURIComponent(url)}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.msg === "ok" && data.data.length > 0) {
                    setAlbum(data.data[0]);
                } else {
                    setAlbum(null);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching album details:", error);
                setLoading(false);
            });
    }, [url,currentSong]);

    const handleSong=(e,song,actuallink,albumImage,index)=>{
        console.log(e)
        e.preventDefault()
        const newSong = { ...song, actuallink, albumImage };
        setCurrentSong(newSong); 
        setCurrentSongIndex(index);
    }
    if (loading) return <p className="extra-box">Loading...</p>;
    if (!album) return <p className="extra-box">Album not found</p>;

    return (
        <div className="album-details-container">
            
            {album.image && <img src={album.image} alt={album.title} className="album-cover" />}
            <h2 className="album-title">{album.title}</h2>
            {album.zipFile && <a href={album.zipFile}><button className="zip-btn">Zip Download</button></a>}
            
            <h3>Songs:</h3>
            <ul className="song-list">
                {album.songs.map((song, index) => (
                    <li key={index} className="song-item">
                    <span onClick={() => setCurrentSong(song)} className="song-name">
                        {song.songName}
                    </span>
                    {album.musicLinks && album.musicLinks[index] && (
                        <>
                            <span onClick={(e) => handleSong(e, song, album.musicLinks[index], album.image, index)}>
                                <CiPlay1 className="music-play-btn" />
                            </span>
                            <a href={album.musicLinks[index]} download className="download-btn">
                                Download
                            </a>
                        </>
                    )}
                </li>
                
                ))}
            </ul>
            {currentSong &&  <MusicPlayer album={album} currentSongIndex={currentSongIndex} setCurrentSongIndex={setCurrentSongIndex} onClose={() => setCurrentSongIndex(null)} />}
        </div>
    );
};

export default AlbumDetails;
