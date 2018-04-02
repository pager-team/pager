import Promise from "bluebird";
import db from "../../lib/db";
import socketio from "socket.io";
import http from "http";

const models = {};

models.getAllPagers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await db.query("SELECT * FROM pagers"));
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

models.getPager = pagerId => {
  return new Promise(async (resolve, reject) => {
    try {
      const pager = await db.query("SELECT * FROM pagers WHERE pager_id = ?", [
        pagerId
      ]);

      if (!pager.length) {
        resolve(null);
        return;
      }

      resolve(pager[0]);
    } catch (e) {
      reject(e);
    }
  });
};

models.confirmNewPager = (pagerId, portNumber, io, emitter) => {
  return new Promise((resolve, reject) => {
    io.emit("newPager", { pagerId, portNumber });

    emitter.on("newPagerResponse", res => {
      if (res) {
        resolve(true);
        return;
      }
      reject(new Error("Not authorized"));
    });
  });
};

models.addPager = (pagerId, portNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.query("INSERT INTO pagers VALUES (?, ?)", [pagerId, portNumber]);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export default models;
