import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    const {link}=req.query
    try {
        const response = await axios.get(link);
        const $ = cheerio.load(response.data);
        const allDetails = [];

        let title=$("#main_page h1").text().trim()
        let albumCover = $("#main_page_middle left img").attr("data-src");
        // Extract album details
        const albumPromises = $(".main_page_category_music").map(async (index, element) => {
            let songLink = $(element).find("a").attr("href");
            let songName = $(element).find(".main_page_category_music_txt div").first().text().trim();
            let singerName = $(element).find(".main_page_category_music_txt div").last().text().trim();
            
            // Ensure full URLs
            songLink = songLink ? new URL(songLink, "https://pagalnew.com").href : null;
            albumCover = albumCover ? new URL(albumCover, "https://pagalnew.com").href : null;

            let downloadLink = null;
            if (songLink) {
                try {
                    const songResponse = await axios.get(songLink);
                    const songPage = cheerio.load(songResponse.data);
                    downloadLink = songPage(".downloaddiv a").first().attr("href");

                    // Ensure full download link URL
                    downloadLink = downloadLink ? new URL(downloadLink, "https://pagalnew.com").href : null;
                } catch (error) {
                    console.error(`Error fetching song ${songLink}:`, error);
                }
            }
            
            return { songLink, songName, singerName, albumCover, downloadLink };
        }).get();
        
        const allData = await Promise.all(albumPromises);
        res.status(200).json({ allDetails: allData,title });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "Error": "Error fetching data" });
    }
}
