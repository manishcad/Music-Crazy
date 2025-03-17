"use client";
import { useEffect, useState,useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "../styles/albums.css"

const hindiAlbums = () => {
    const [albums, setAlbums] = useState([]);
    const [page, setPage] = useState(1); // Current page
    const [limit] = useState(12); // Number of albums per page
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const search=useRef()

    useEffect(() => {
        fetchAlbums();
      
    }, [page]); // Fetch data when `page` changes

    const fetchAlbums = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/pagalnew?page=${page}`);
            const data = await response.data;
            console.log(data,"this is data")
            setAlbums(data.allDetails); // Extract `data` from the response
        } catch (error) {
            console.error("Error fetching albums:", error);
        }
        setLoading(false);
    };

    const handleAlbumClick = (link) => {
        router.push(`/hindi/album?link=${link}`);
    };

    const handleNext = () => setPage((prev) => prev + 1);
    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
    const handleSubmit=(e)=>{
        e.preventDefault()
        const query=search.current.value
        router.push(`/hindi/searchAlbum?search=${query}`)
    }
    return (
        <div className="music-albums-container">
            <h2 className="music-albums">Hindi Albums</h2>
            {/* Search Bar with Button */}
            <div className="search-container">
                <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Search by movies name or song name..."
                    ref={search}
                    
                    className="search-bar"
                />
                <button type="submit" className="search-button">
                    Search
                </button>
                </form>
            </div>
            {loading ? (
                <p>Loading albums...</p>
            ) : (
                <div className="albums-grid">
                    {albums.map((album, index) => (
                        <div 
                            key={index} 
                            className="album-card" 
                            onClick={() => handleAlbumClick(album.albumLink)} 
                            style={{ cursor: "pointer" }}
                        >
                            <img src={album.albumSongs[0].albumCover} alt={album.title} className="album-cover" />
                            <h3>{album.albumName}</h3>
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

export default hindiAlbums;
