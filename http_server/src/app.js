import express from "express";
import bodyParser from "express";
import pagers from "./packages/pagers/controllers";
import http from "http";
import websocket from "./lib/websocket";

const app = express();
const server = http.Server(app);
websocket.listen(server);
const router = express.Router();
const PORT = process.env.PORT || 8080;

// Middleware
router.use(bodyParser.json());

router.use("/pagers", pagers);

app.use("/api/v1", router);

app.listen(PORT);
