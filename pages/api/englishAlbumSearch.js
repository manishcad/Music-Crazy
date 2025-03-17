import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ message: "Url must be provided" });
    }

    const { data } = await axios.get(`https://highlifeng.com/africa/?s=${search}`);
    const $ = cheerio.load(data);

    let extractedData = [];

    $(".td_module_16.td_module_wrap").each((index, element) => {
      const title = $(element).find(".entry-title a").text().trim();
      const postsearch = $(element).find(".entry-title a").attr("href");

      // Extract image from "src" or "data-img-url"
      let albumCover = $(element).find(".td-module-thumb img").attr("src") ||
                  $(element).find(".td-module-thumb img").attr("data-img-url");

      const author = $(element).find(".td-post-author-name a").text().trim();
      const date = $(element).find(".td-post-date time").attr("datetime");
      const comments = $(element).find(".td-module-comments a").text().trim();
      const excerpt = $(element).find(".td-excerpt").text().trim();

      extractedData.push({
        title,
        postsearch,
        albumCover,
        author,
        date,
        comments,
        excerpt,
      });
    });

    return res.status(200).json({ msg: "ok", data: extractedData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Error" });
  }
}
