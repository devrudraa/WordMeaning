// * This app is made by Dev Rudra https://www.instagram.com/__code_dev

import Express from "express";
import { fileURLToPath } from "url";
import path from "path";
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//! Setting static folder / pages
const app = Express();
app.use(Express.static(path.join(__dirname, "dist")));

try {
  app.listen(PORT, () => {
    console.log("Server is started on http://localhost:" + PORT);
  });
} catch (err) {
  console.log("Server Did't started!");
  console.error(err);
}
