"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

const HomePage = () => {
    const [albums, setAlbums] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [defaultAlbums, setDefaultAlbums] = useState([]);

    const router = useRouter();

    useEffect(() => {
        fetchDefaultAlbums();
    }, []);

    const fetchDefaultAlbums = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/search?q=latest`); // Fetch latest or trending albums
            setAlbums(response.data.data);
            setDefaultAlbums(response.data.data); // Store default albums separately
        } catch (error) {
            console.error("Error fetching albums:", error);
        }
        setLoading(false);
    };

    const handleSearchClick = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return; // Prevent empty searches
        setLoading(true);
        if(searchQuery.trim()==="phedophile"){
            setSearchQuery("drake")
            return
        }
        try {
            const response = await axios.get(`/api/search?q=${searchQuery}`);
            setAlbums(response.data.data);
        } catch (error) {
            console.error("Error fetching albums:", error);
        }

        setLoading(false);
    };

    const handleAlbumClick = (link) => {
        router.push(`/album?link=${link}`);
    };

    return (
        
        <div className="homepage">
            <h1 className="title">🎵 Discover Music Albums</h1>

            {/* Search Bar with Button */}
            <div className="search-container">
                <form onSubmit={(e)=>handleSearchClick(e)}>
                <input
                    type="text"
                    placeholder="Search for an album..."
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
                        albums.map((album) => (
                            <div
                                key={album.id}
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
            <style jsx>{`
                form{
                    width: 80%;
                    }
                .homepage {
                    text-align: center;
                    padding: 30px;
                    background-color: #121212;
                    color: white;
                    margin-top: 50px;
                }
                .title {
                    font-size: 32px;
                    font-weight: bold;
                    color: #ff4c4c;
                    margin-bottom: 20px;
                }
                .search-container {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                .search-bar {
                    width: 50%;
                    padding: 12px;
                    font-size: 16px;
                    border: 2px solid #ff4c4c;
                    border-radius: 25px;
                    background: #222;
                    color: white;
                    outline: none;
                    transition: 0.3s;
                }
                .search-bar:focus {
                    border-color: #ff914c;
                }
                .search-button {
                    padding: 12px 20px;
                    font-size: 16px;
                    border: none;
                    border-radius: 25px;
                    background: linear-gradient(45deg, #ff4c4c, #ff914c);
                    color: white;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .search-button:hover {
                    background: linear-gradient(45deg, #ff914c, #ff4c4c);
                }
                .albums-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                    padding: 20px;
                }
                .album-card {
                    background: #1a1a1a;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    transition: transform 0.3s ease-in-out;
                    cursor: pointer;
                    box-shadow: 0px 4px 10px rgba(255, 76, 76, 0.2);
                    display:flex;
                    flex-direction: column;
                    align-items: center;
                }
                .album-card:hover {
                    transform: scale(1.05);
                    box-shadow: 0px 6px 15px rgba(255, 76, 76, 0.3);
                }
                .album-cover {
                    border-radius: 8px;
                }
                .album-title {
                    margin-top: 10px;
                    font-size: 16px;
                }
                .loading-text {
                    font-size: 18px;
                    margin-top: 20px;
                }
                .no-results {
                    font-size: 18px;
                    color: #ff4c4c;
                    margin-top: 20px;
                }
            `}</style>
        </div>
        
    );
    
};

export default HomePage;
