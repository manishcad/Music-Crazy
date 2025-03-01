import axios from 'axios';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
    try {
        let { page, limit } = req.query;

        // Default values if not provided
        page = parseInt(page) || 1; // Default to page 1
        limit = parseInt(limit) || 10; // Default limit to 10

        const albums = [];
        const URL = `https://www7.hiphopkit.com/music/album/page/${page}/`;

        const { data } = await axios.get(URL);
        const $ = cheerio.load(data);

        $('.myfile').each((index, element) => {
            if (index >= limit) return false; // Stop when limit is reached
            
            const uuid = uuidv4();
            const image = $(element).find('.image img').attr("data-src") || 
                "https://png.pngtree.com/png-vector/20221217/ourmid/pngtree-vinyl-disc-png-image_6527519.png";
            const link = $(element).find('.infohome h3 a').attr('href');
            const title = $(element).find('.infohome h3 a').text().trim();

            if (link && image) {
                albums.push({ link, title, image, id: uuid });
            }
        });

        res.status(200).json({
            page,
            limit,
            total: albums.length,
            data: albums
        });

    } catch (error) {
        console.error('Error scraping albums:', error);
        res.status(500).json({ error: 'Failed to scrape albums' });
    }
}
