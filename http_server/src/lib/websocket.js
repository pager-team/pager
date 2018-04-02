import http from "http";
import socketio from "socket.io";

export default () => {
  const server = http.createServer();
  const io = socketio(server);

 

exports.listen = listen; 
  server.listen(8000);
};
