import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const { link } = req.query;
    if (!link) {
      return res.status(400).json({ message: "Url must be provided" });
    }

    let albumData = [];
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);

    console.log("Hello");
    const check=$(".download-btn-wrapper a").attr("href")
    const image=$(".td-post-content a img").attr("src")
    if(check){
      const songName=$(".download-btn-wrapper a").text().trim()
      console.log("download-btn-wrapper present")
      try{
        const response=await axios.get(check)
        const $=cheerio.load(response.data)
        const dwLink = $("#blocLinkDownload a").last().attr("href");
        albumData.push({songName,downloadLink:dwLink,image})
        res.status(200).json({albumData})
      }catch(err){
        console.log(err)
        return res.status(500).json({ error: "Internal Error" });
      }
    }

    $(".td-post-content p strong").each((index, element) => {
      const songName = $(element).text().trim();
      if (songName.startsWith("Track")) {
        const songLink = $(element).find("a").attr("href");
        if (songLink) {
          albumData.push({
            songName,
            link: `https://highlifeng.com${songLink}`,
          });
        }
      }
    });

    // Fetch first layer of links (song pages)
    const allLinks = await Promise.all(
      albumData.map(async (item) => {
        try {
          const response = await axios.get(item.link);
          const $ = cheerio.load(response.data);
          return $(".download-btn-wrapper a").attr("href") || null;
        } catch (err) {
          console.log("Error fetching song link:", err);
          return null; // Return null if an error occurs
        }
      })
    );

    // Merge allLinks into albumData
    albumData = albumData.map((item, index) => ({
      ...item,
      realLink: allLinks[index], // First redirect page link
    }));

    // Fetch final download links
    const downloadLinks = await Promise.all(
      allLinks.map(async (item, index) => {
        if (!item) return null; // Skip if null

        try {
          const response = await axios.get(item);
          const $ = cheerio.load(response.data);
          const dwLink = $("#blocLinkDownload a").last().attr("href");
          return dwLink || null; // Ensure a valid URL is returned
        } catch (err) {
          console.log("Error fetching final download link:", err);
          return null;
        }
      })
    );

    // Merge final download links into albumData
    albumData = albumData.map((item, index) => ({
      ...item,
      downloadLink: downloadLinks[index],
      image // Final MP3 link
    }));

    return res.status(200).json({albumData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Error" });
  }
}
