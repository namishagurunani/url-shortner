console.log("url shortner");

import express from "express";
import { nanoid } from "nanoid";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import bodyParser from  "body-parser";


const __filepath = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filepath)

const server = express();

server.use(bodyParser.urlencoded({ extended: true }));

const isUrlValid = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

server.use(express.json());

server.get('/', (req, res)=>{
  res.sendFile(__dirname + "/index.html" );
})
server.post("/url-shortner", (req, res) => {
  const urlToShorten = req.body.longUrl;

  if (isUrlValid(urlToShorten)) {
    const shortUrl = nanoid(8);
    const fileaResponse = fs.readFileSync("urlMap.json", "utf8");
    const fileData = JSON.parse(fileaResponse);
    fileData[shortUrl] = urlToShorten;
    fs.writeFileSync("urlMap.json", JSON.stringify(fileData));
    res.json({
      success: true,
      shortUrl: `https://url-shortner-backend-4esc.onrender.com/${shortUrl}`,
    });
  } else {
    res.json({
      success: false,
      message: "please provide a valid URL",
    });
  }
});

server.get('/:shortUrl', (req, res)=>{
    let url = req.params.shortUrl;
    console.log(url);
    const fileaResponse = fs.readFileSync("urlMap.json", "utf8");
    const fileData = JSON.parse(fileaResponse);
    const longUrl = fileData[url]
        if(longUrl){
        res.redirect(longUrl)
        }
    
    else {
        res.json('URL not found')
    }
})

server.listen(3000, () => {
  console.log("server is live and running on port 10000");
});