import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    const {search}=req.query
    if(!search) return

    try {
        const response = await axios.get(`https://pagalnew.com/search.php?find=${search}`);
        const $ = cheerio.load(response.data);
        const allDetails = [];

        $(".row > a").each((index,element)=>{
            let link=$(element).attr("href")
            link="https://pagalnew.com"+link
            //console.log(link)
            let image=$(element).find("img").attr("src").slice(2)
            image="https://pagalnew.com"+image
            let name=$(element).find(".main_page_category_music_txt").first().text().trim()
            allDetails.push({link,image,name})

        })
            
      
        
        
        res.status(200).json({ allDetails });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "Error": "Error fetching data" });
    }
}
