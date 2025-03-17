import axios from 'axios';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {

    try {
        const {q}=req.query
        const albums = [];
        for(let i=1;i<4;i++){
            const URL = `https://www7.hiphopkit.com/search?q=${q}&folder=album&p=${i}`;

            const { data } = await axios.get(URL);
            const $ = cheerio.load(data);

        $('.result').each((index, element) => {
            
            
            const uuid = uuidv4();
            const image = $(element).find('.result-img img').attr("src") || 
                "https://png.pngtree.com/png-vector/20221217/ourmid/pngtree-vinyl-disc-png-image_6527519.png";
            const link = $(element).find('.result-info h3 a').attr("href");
            const title = $(element).find('.result-info h3 a').text().trim();

            if (link && image) {
                albums.push({ link, title, image, id: uuid });
            }
        });
            
        }
        

        res.status(200).json({
          
            total: albums.length,
            data: albums
        });

    } catch (error) {
        console.error('Error scraping albums:', error);
        res.status(500).json({ error: 'Failed to scrape albums' });
    }
}
