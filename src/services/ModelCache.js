import { openDB } from "idb";

export class ModelCache {
  constructor() {
    this.dbPromise = openDB("binaire-model-explorer", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("snapshots")) {
          db.createObjectStore("snapshots", { keyPath: "key" });
        }
      }
    });
  }

  save(models) {
    return this.dbPromise.then(function (db) {
      const tx = db.transaction("snapshots", "readwrite");
      const store = tx.objectStore("snapshots");
      const payload = {
        key: "models",
        version: Date.now(),
        count: models.length,
        models: models
      };
      return store.put(payload).then(function () {
        return tx.done;
      }).then(function () {
        return payload;
      });
    });
  }

  load() {
    return this.dbPromise.then(function (db) {
      return db.get("snapshots", "models");
    }).then(function (record) {
      return record ? record.models : [];
    });
  }
}