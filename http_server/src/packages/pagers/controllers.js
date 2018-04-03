import express from "express";
import models from "./models";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json(await models.getAllPagers());
  } catch (e) {
    res.sendStatus(500);
  }
});

router.get("/:pagerId", async (req, res) => {
  try {
    res.json(await models.getPager(req.params.pagerId));
  } catch (e) {
    res.sendStatus(500);
  }
});

router.post("/:pagerId/connect/:portNumber", async (req, res) => {
  const pagerId = Number(req.params.pagerId);
  const portNumber = Number(req.params.portNumber);
  const io = req.app.get("socketio");
  const emitter = req.app.get("emitter");

  try {
    if (isNaN(pagerId) || isNaN(portNumber)) {
      res.sendStatus(400);
      return;
    }

    // If pager does exist, send success message
    if (await models.getPager(pagerId)) {
      await models.updatePort(pagerId, portNumber);
      await models.pagerConnected(pagerId);
      res.sendStatus(200);
      return;
    }

    await models.confirmNewPager(pagerId, portNumber, io, emitter);
    await models.addPager(pagerId, portNumber);

    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.post("/:portNumber/disconnect", async (req, res) => {
  const portNumber = Number(req.params.portNumber);

  try {
    if (isNaN(portNumber)) {
      res.sendStatus(400);
      return;
    }

    await models.pagerDisconnected(portNumber);
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.post("/:pagerId/activate/:orderId", async (req, res) => {
  const pagerId = Number(req.params.pagerId);
  const orderId = Number(req.params.orderId);

  try {
    if (isNaN(pagerId) || isNaN(orderId)) {
      res.sendStatus(400);
      return;
    }

    // Check if pagerId is already activated
    if (await models.alreadyActivated(pagerId)) {
      res.sendStatus(400);
      return;
    }

    await models.activatePager(orderId, pagerId);

    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/:pagerId/ring", async (req, res) => {
  const pagerId = Number(req.params.pagerId);
  try {
    if (isNaN(pagerId)) {
      res.sendStatus(400);
      return;
    }

    if (!await models.alreadyActivated(pagerId)) {
      res.sendStatus(400);
      return;
    }

    await models.sendRingMessage(pagerId, req.app.get("client"));

    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.post("/:pagerId/deactivate", async (req, res) => {
  const pagerId = Number(req.params.pagerId);

  try {
    if (!await models.alreadyActivated(pagerId)) {
      res.sendStatus(400);
      return;
    }

    models.deactivatePager(pagerId, req.app.get("client"));

    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});

export default router;
