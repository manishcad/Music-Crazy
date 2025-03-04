import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  
  try {
    const { link } = req.query;
    if (!link) {
      return res.status(400).json({ message: "Url must be provided" });
    }

    const { data } = await axios.get(link);
    const $ = cheerio.load(data);

    const image = $(".song-thumbnail img").attr("src"); // Extract album image

    let albumData = [];

    const zipFile=$(".song-download a").attr("href")|| null;

    console.log(zipFile); 
    $(".mu-o").each((index, element) => {
      const albumHeader = $(element).find("h3").text().trim();
      let songs = [];
      let musicLinks = []; // Store multiple download links

      // Extract all music download links
      $(element).find(".mu-o-act a").each((i, el) => {
        const musicLink = $(el).attr("href");
        if (musicLink) {
          musicLinks.push(musicLink);
        }
      });

      // Extract song names and links
      $(element)
        .find(".mu-o-title a")
        .each((i, el) => {
          const song = $(el).text().trim();
          const href = $(el).attr("href");
          songs.push({ songName: song, link: href });
        });

      // Store album details in a single object
      albumData.push({ title: albumHeader, image, musicLinks, songs,zipFile });
    });

    return res.status(200).json({ msg: "ok", data: albumData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Error" });
  }
}
