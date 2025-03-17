import axios from 'axios';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { HttpsProxyAgent } from "https-proxy-agent";
export default async function handler(req, res) {
    
    try {
        let { page } = req.query ||"1";

        // Default values if not provided
        page = parseInt(page) || 1; // Default to page 1
        // Default limit to 10

        const albums = [];
        const URL = `https://highlifeng.com/africa/american-hiphop-songs/page/${page}/`;
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        ];
        const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

        const proxy = "http://47.245.14.41:3389"; // Replace with a working proxy
        const agent = new HttpsProxyAgent(proxy);
        
        
        const { data } = await axios.get(URL, {
         
            headers: {
                'User-Agent': userAgent,
                'Referer': 'https://www.google.com/',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });
       
        const $ = cheerio.load(data);

        $('.td-block-span6 div').each((index, element) => {
             // Stop when limit is reached
            
           
            const title = $(element).find('h3').text().trim() 
            const link = $(element).find('.td-module-image div a').attr('href');
            const image = $(element).find('.td-module-image div a img').attr('data-img-url');
            const date=$(element).find(".td-module-meta-info .td-post-date time").text().trim()
         

            if (title) {
                albums.push({title,link,image,date})
            }
        });

        res.status(200).json({
            page,
          
            total: albums.length,
            data: albums
        });

    } catch (error) {
        console.error('Error scraping albums:', error);
        res.status(500).json({ error: 'Failed to scrape albums' });
    }
}
