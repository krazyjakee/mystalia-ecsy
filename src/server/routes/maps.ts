import { Router } from "express";
import { readMapFiles } from "@server/utilities/mapFiles";

const mapRoutes = Router();

mapRoutes.get("/", (req, res) => {
  const filename = req.query.filename as string;
  const maps = readMapFiles();
  res.json(maps[filename]);
});

export default mapRoutes;
