"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import "../styles/album.css"
const AlbumDetails = () => {
    const searchParams = useSearchParams();
    const url = searchParams.get("link");

    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!url) return;
        setLoading(true)
        fetch(`/api/singlealbum?link=${encodeURIComponent(url)}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.msg === "ok" && data.data.length > 0) {
                    setAlbum(data.data[0]); // Extract album from the array
                } else {
                    setAlbum(null);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching album details:", error);
                setLoading(false);
            });
    }, [url]);
    console.log(loading)
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
                        <a href={song.link} target="_blank" rel="noopener noreferrer" className="song-name">
                            {song.songName}
                        </a>
                        {album.musicLinks && album.musicLinks[index] && (
                            <a href={album.musicLinks[index]} download className="download-btn">
                                Download
                            </a>
                        )}
                    </li>
                ))}
            
            </ul>

            
        </div>
    );
};

export default AlbumDetails;
