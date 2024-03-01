import express from "express";
import { nanoid } from "nanoid";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import bodyParser from "body-parser";

const __filepath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filepath);

const server = express();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());

const isUrlValid = (url) => {
  try {
    if (!url) {
      return false; // Return false if URL is undefined or empty
    }
    new URL(url);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.post("/url-shortner", (req, res) => {
  const urlToShorten = req.body.longUrl;

  if (!urlToShorten || !isUrlValid(urlToShorten)) {
    res.json({
      success: false,
      message: "Please provide a valid URL",
    });
    return;
  }

  const shortUrl = nanoid(8);
  const fileResponse = fs.readFileSync("urlFile.json", "utf8"); // Updated filename
  const fileData = JSON.parse(fileResponse);
  fileData[shortUrl] = urlToShorten;
  fs.writeFileSync("urlFile.json", JSON.stringify(fileData)); // Updated filename
  res.json({
    success: true,
    shortUrl: `https://url-shortner-backend-4esc.onrender.com/${shortUrl}`,
  });
});

server.get("/:shortUrl", (req, res) => {
  let url = req.params.shortUrl;
  const fileResponse = fs.readFileSync("urlFile.json", "utf8"); // Updated filename
  const fileData = JSON.parse(fileResponse);
  const longUrl = fileData[url];
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.json("URL not found");
  }
});

server.listen(3000, () => {
  console.log("Server is live and running on port 3000");
});
