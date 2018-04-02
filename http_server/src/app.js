import express from "express";
import bodyParser from "express";
import pagers from "./packages/pagers/controllers";
import socketio from "socket.io";
import EventEmitter from "events";

const app = express();

const io = socketio.listen(8000);

const emitter = new EventEmitter();

app.set("socketio", io);
app.set("emitter", emitter);

io.sockets.on("connection", function(socket) {
  socket.on("newPagerResponse", res => {
    emitter.emit("newPagerResponse", res);
  });
});

const router = express.Router();

// Middleware
router.use(bodyParser.json());

router.use("/pagers", pagers);

app.use("/api/v1", router);

app.listen(8080);
