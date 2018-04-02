import express from "express";
import bodyParser from "express";
import pagers from "./packages/pagers/controllers";
import socketio from "socket.io";
import EventEmitter from "events";
import net from "net";
import cors from "cors";

const app = express();

const io = socketio.listen(8000);
const client = new net.Socket();

/*client.connect(8005, "127.0.0.1", () => {*/
//app.set("client", client);
/*});*/

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
router.use(cors());

router.use("/pagers", pagers);

app.use("/api/v1", router);

app.listen(8080);
