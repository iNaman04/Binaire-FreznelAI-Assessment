export class BackgroundSync {
  constructor(api, cache, onUpdate) {
    this.api = api;
    this.cache = cache;
    this.onUpdate = onUpdate;
    this.timer = null;
  }

  start(intervalMs = 60000) {
    this.stop();
    this.sync();
    this.timer = window.setInterval(this.sync.bind(this), intervalMs);
  }

  sync() {
    return this.api.request()
      .then(function (models) {
        return this.cache.save(models).then(function () {
          this.onUpdate(models);
          return models;
        });
      })
      .catch(function () {
        return this.cache.load().then(function (cached) {
          if (cached.length) this.onUpdate(cached);
          return cached;
        }.bind(this));
      }.bind(this));
  }

  stop() {
    if (this.timer) window.clearInterval(this.timer);
    this.timer = null;
  }
}