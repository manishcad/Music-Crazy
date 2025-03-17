import axios from "axios";
import * as cheerio from 'cheerio';

export default async function Test(){
    const response=await axios.get("https://pagalnew.com/album/andaaz-2-2025.html")
    const $=cheerio.load(response.data)
    $(".main_page_category_music a").each((index,element)=>{
        const link=$(element).attr("href")
        console.log(link)
    })
}
Test()