"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const AlbumDetails = () => {
    const searchParams = useSearchParams();
    const url = searchParams.get("link");

    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!url) return;

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

    if (loading) return <p>Loading...</p>;
    if (!album) return <p>Album not found</p>;

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

            <style jsx>{`
                .album-details-container {
                    max-width: 700px;
                    margin: 100px auto;
                    
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    display:flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content:center;
                }
                .album-cover {
                    width: 50%;
                    border-radius: 10px;
                    margin-bottom: 15px;
                }
                .album-title {
                    font-size: 22px;
                    font-weight: bold;
                }
                .song-list {
                    list-style: none;
                    padding: 0;
                    width:100%;
                }
                .song-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    border-bottom: 1px solid #ddd;
                }
                .song-name {
                    text-decoration: none;
                    color: #007bff;
                    flex: 1;
                    text-align: left;
                }
                .song-name:hover {
                    text-decoration: underline;
                }
                .download-btn {
                    background-color: #007bff;
                    color: white;
                    text-decoration: none;
                    padding: 5px 10px;
                    border-radius: 5px;
                    font-size: 14px;
                    text-align: center;
                    white-space: nowrap;
                }
                .download-btn:hover {
                    background-color: #0056b3;
                }
            `}</style>
        </div>
    );
};

export default AlbumDetails;
