"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import "../styles/NewHomePage.css"
const NewHomePage = () => {
    const [albums, setAlbums] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [page,setPage]=useState("1")
    
    const router = useRouter();

    useEffect(() => {
        console.log("use effect running")
        const controller = new AbortController();
        console.log(albums,"why is this not working")
        fetchDefaultAlbums();
    
        return () => controller.abort(); // Cleanup function cancels request on unmount
    },[]);

    const fetchDefaultAlbums = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/highlifeng?page=${page}`); // Fetch latest or trending albums
            setAlbums(response.data.data);
             // Store default albums separately
        } catch (error) {
            console.error("Error fetching albums:", error);
        }
        setLoading(false);
    };

    const handleSearchClick = (e) => {
        e.preventDefault();
        const query = searchQuery.trim();
        if (!query) return;
        router.push(`/englishAlbumSearch?search=${query}`); // Redirect to search results page
    };
    
    

    const handleAlbumClick = (link) => {
        router.push(`/englishAlbum?link=${link}`);
    };

    return (
        
        <div className="Newhomepage">
            <h1 className="title">🎵 Discover Music Albums</h1>

            {/* Search Bar with Button */}
            <div className="search-container">
                <form onSubmit={handleSearchClick}>
                <input
                    type="text"
                    placeholder="Search for an album or song only english..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar"
                />
                <button type="submit" className="search-button">
                    Search
                </button>
                </form>
            </div>

            {/* Albums List */}
            {loading ? (
                <p className="loading-text">Loading albums...</p>
            ) : (
                <div className="albums-grid">
                    {albums.length > 0 ? (
                        albums.map((album,index) => (
                            <div
                                key={index}
                                className="album-card"
                                onClick={() => handleAlbumClick(album.link)}
                            >
                                <Image
                                    src={album.image}
                                    alt={album.title}
                                    width={200}
                                    height={200}
                                    className="album-cover"
                                    priority
                                />
                                <h3 className="album-title">{album.title}</h3>
                            </div>
                        ))
                    ) : (
                        <p className="no-results">No albums found.</p>
                    )}
                </div>
            )}

            {/* CSS Styling */}
            
        </div>
        
    );
    
};

export default NewHomePage;
