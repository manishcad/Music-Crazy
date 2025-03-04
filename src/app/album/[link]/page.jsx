"use client";
export const dynamic = "force-dynamic";
import { useParams } from "next/navigation"; // Use params instead of searchParams
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import "../../styles/search.css"
const SearchPage = () => {
    const {link}=useParams()

    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!link) return;
        fetchSearchResults();
        console.log(albums)
    }, [link]);

    const fetchSearchResults = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/search?q=${link}`);
            setAlbums(response.data.data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
        setLoading(false);
    };

    const handleAlbumClick = (link) => {
        router.push(`/album?link=${link}`);
    };

    return (
        <div className="search-results-page">
            <h1>Search Results for "{link}"</h1>
            {loading ? (
                <p>Loading...</p>
            ) : albums.length > 0 ? (
                <div className="albums-grid">
                    {albums.map((album) => (
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
                    ))}
                </div>
            ) : (
                <p>No results found.</p>
            )}

            
        </div>
    );
};

export default SearchPage;
