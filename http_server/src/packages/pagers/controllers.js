import express from "express";
import models from "./models";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json(await models.getAllPagers());
  } catch (e) {
    res.json({ response: "ERROR" });
  }
});

router.get("/:pagerId", async (req, res) => {
  try {
    res.json(await models.getPager(req.params.pagerId));
  } catch (e) {
    res.json({ response: "ERROR" });
  }
});

router.get("/:pagerId/connect/:portNumber", async (req, res) => {
  const pagerId = Number(req.params.pagerId);
  const portNumber = Number(req.params.portNumber);

  try {
    if (isNaN(pagerId) || isNaN(portNumber)) {
      res.json({ response: "ERROR" });
      return;
    }

    // If pager does exist, send success message
    if (await models.getPager(pagerId)) {
      res.sendStatus(200);
      return;
    }

    await models.confirmNewPager(pagerId, portNumber);

    res.json(200);
  } catch (e) {
    res.json({ response: "ERROR" });
  }
});

export default router;
