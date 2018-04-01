import Promise from "bluebird";
import db from "../../lib/db";
import websocket from "../../lib/websocket";

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

models.confirmNewPager = (pagerId, portNumber) => {
  return new Promise((resolve, reject) => {
    websocket.emit("newPager", { pagerId, portNumber });

    websocket.on("newPagerResponse", res => {
      if (!res) {
        reject(new Error("rejected"));
        return;
      }

      resolve();
    });
  });
};

export default models;
