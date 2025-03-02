"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../styles/albums.css"

const MusicAlbums = () => {
    const [albums, setAlbums] = useState([]);
    const [page, setPage] = useState(1); // Current page
    const [limit] = useState(12); // Number of albums per page
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchAlbums();
    }, [page]); // Fetch data when `page` changes

    const fetchAlbums = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/albums?page=${page}&limit=${limit}`);
            const data = await response.json();
            setAlbums(data.data); // Extract `data` from the response
        } catch (error) {
            console.error("Error fetching albums:", error);
        }
        setLoading(false);
    };

    const handleAlbumClick = (link) => {
        router.push(`/album?link=${link}`);
    };

    const handleNext = () => setPage((prev) => prev + 1);
    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));

    return (
        <div className="music-albums-container">
            <h2 className="music-albums">Music Albums</h2>

            {loading ? (
                <p>Loading albums...</p>
            ) : (
                <div className="albums-grid">
                    {albums.map((album, index) => (
                        <div 
                            key={index} 
                            className="album-card" 
                            onClick={() => handleAlbumClick(album.link)} 
                            style={{ cursor: "pointer" }}
                        >
                            <img src={album.image} alt={album.title} className="album-cover" />
                            <h3>{album.title}</h3>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Buttons */}
            <div className="pagination">
                <button onClick={handlePrev} disabled={page === 1}>← Previous</button>
                <span>Page {page}</span>
                <button onClick={handleNext} disabled={albums.length < limit}>Next →</button>
            </div>

          
        </div>
    );
};

export default MusicAlbums;
