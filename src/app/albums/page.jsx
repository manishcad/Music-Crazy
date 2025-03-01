"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

            <style jsx>{`
                .music-albums-container {
                    padding: 20px;
                    text-align: center;
                    margin-top: 100px;
                }
                .albums-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                    padding: 50px;
                }
                .album-card {
                    border: 1px solid #ddd;
                    padding: 10px;
                    border-radius: 5px;
                    text-align: center;
                    transition: transform 0.2s;
                }
                .album-card:hover {
                    transform: scale(1.05);
                }
                .album-cover {
                    width: 100%;
                    height: auto;
                    border-radius: 5px;
                }
                .pagination {
                    margin-top: 20px;
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                }
                .pagination button {
                    background: #ff4c4c;
                    color: white;
                    font-size: 16px;
                    padding: 10px 15px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .pagination button:hover {
                    background: #ff914c;
                }
                .pagination button:disabled {
                    background: #555;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default MusicAlbums;
