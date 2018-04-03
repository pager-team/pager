import Promise from "bluebird";
import db from "../../lib/db";
import socketio from "socket.io";
import http from "http";

const models = {};

models.getAllPagers = connected => {
  return new Promise(async (resolve, reject) => {
    try {
      const rows = await db.query(
        "SELECT pager_id, pager_port, pager_connected, pager_status FROM pagers"
      );

      if (!connected) {
        resolve(rows);
        return;
      }

      const pagers = { connected: [], disconnected: [] };

      for (const pager of rows) {
        if (pager.pager_connected) {
          pagers.connected.push(pager);
        } else {
          pagers.disconnected.push(pager);
        }
      }

      resolve(pagers);
    } catch (e) {
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
      await db.query("INSERT INTO pagers VALUES (?, ?, DEFAULT, DEFAULT)", [
        pagerId,
        portNumber
      ]);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

models.pagerConnected = pagerId => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.query("UPDATE pagers SET pager_connected = ?", [true]);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

models.pagerDisconnected = pagerPort => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.query(
        "UPDATE pagers SET pager_connected = ?, pager_status = 0 WHERE pager_port = ? and pager_connected = ?",
        [false, pagerPort, true]
      );
      resolve();
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

models.alreadyActivated = pagerId => {
  return new Promise(async (resolve, reject) => {
    try {
      const rows = await db.query(
        "SELECT pager_status FROM pagers WHERE pager_id= ?",
        [pagerId]
      );

      if (!rows.length) {
        reject(new Error("Pager doesn't exist"));
        return;
      }

      if (rows[0].pager_status != 0) {
        resolve(true);
        return;
      }

      resolve(false);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

models.activatePager = (orderId, pagerId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.query(
        "INSERT INTO orders VALUES (?, ?, UNIX_TIMESTAMP(), DEFAULT, DEFAULT)",
        [orderId, pagerId]
      );

      await db.query("UPDATE pagers SET pager_status = 1 WHERE pager_id = ?", [
        pagerId
      ]);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

models.sendRingMessage = (pagerId, client) => {
  return new Promise(async (resolve, reject) => {
    const rows = await db.query(
      "SELECT pager_port FROM pagers WHERE pager_id = ?",
      [pagerId]
    );

    await db.query(
      "UPDATE orders SET order_ring_date = UNIX_TIMESTAMP() WHERE order_pager_id = ?",
      [pagerId]
    );

    await db.query("UPDATE pagers SET pager_status = 2 WHERE pager_id = ?", [
      pagerId
    ]);

    client.write(
      JSON.stringify({ type: "ring", pager_port: rows[0].pager_port })
    );

    resolve();
  });
};

models.updatePort = (pagerId, portNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.query("UPDATE pagers SET pager_port = ? WHERE pager_id = ?", [
        portNumber,
        pagerId
      ]);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

models.deactivatePager = (pagerId, client) => {
  return new Promise(async (resolve, reject) => {
    const rows = await db.query(
      "SELECT pager_port FROM pagers WHERE pager_id = ?",
      [pagerId]
    );

    await db.query(
      "UPDATE orders SET order_end = UNIX_TIMESTAMP() WHERE order_pager_id = ?",
      [pagerId]
    );

    await db.query("UPDATE pagers SET pager_status = 0 WHERE pager_id = ?", [
      pagerId
    ]);

    client.write(
      JSON.stringify({ type: "deactivate", pager_port: rows[0].pager_port })
    );
  });
};

models.orderIdExists = orderId => {
  return new Promise(async (resolve, reject) => {
    try {
      const rows = await db.query(
        "SELECT order_id FROM orders WHERE order_id = ?",
        [orderId]
      );

      if (rows.length) {
        resolve(true);
      }

      resolve(false);
    } catch (e) {
      reject(e);
    }
  });
};

export default models;
