import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    const {page}=req.query
   
    try {
        const response = await axios.get(`https://pagalnew.com/category/bollywood-mp3-songs/${page || "1"}`);
        const $ = cheerio.load(response.data);
        const allDetails = [];

        // Extract album details
        const albumPromises = $(".main_page_category_music").map(async (index, element) => {
            const albumLink = $(element).find("a").attr("href");
            const albumImage = $(element).find(".main_page_category_music_img img").attr("src");
            const albumName = $(element).find(".main_page_category_music_txt div").first().text().trim();
            const singerName = $(element).find(".main_page_category_music_txt div").last().text().trim();
            
            let albumSongs = [];
            if (albumLink) {
                try {
                    const albumResponse = await axios.get(albumLink);
                    const albumPage = cheerio.load(albumResponse.data);
                    let albumCover = albumPage("left img").attr("data-src")
                    albumSongs = await Promise.all(albumPage(".main_page_category_music a").map(async (i, el) => {
                        const songLink = albumPage(el).attr("href");
                        const songName=albumPage(el).text().trim().replace(/\t/g, '')
                        let downloadLink = null;
                        
                        if (songLink) {
                            try {
                                const songResponse = await axios.get(songLink);
                                const songPage = cheerio.load(songResponse.data);
                                downloadLink = songPage(".downloaddiv a").first().attr("href");
                            } catch (error) {
                                console.error(`Error fetching song ${songLink}:`, error);
                            }
                        }
                        
                        return { songLink, downloadLink,songName,albumCover };
                    }).get());
                } catch (error) {
                    console.error(`Error fetching ${albumLink}:`, error);
                }
            }
            
            return { albumLink, albumName, singerName, albumImage, albumSongs };
        }).get();
        
        const allData = await Promise.all(albumPromises);
        
        res.status(200).json({ allDetails: allData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "Error": "Error fetching data" });
    }
}
