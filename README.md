# mhueni.github.io

Personal website of [Matthias Hüni](https://mhueni.ch), Software Engineer & Maker from Zurich, Switzerland.

Includes **"Wo go bade in Züri?"** — a real-time crowd monitor for Zurich's outdoor pools.

## Serve

```bash
php -S 0.0.0.0:8080 -t .
```

Open http://127.0.0.1:8080

## Push to production

```bash
git push origin master && git push mhueni.ch master
```

## Pool monitor data sources

| Source | What |
|---|---|
| WebSocket `wss://badi-public.crowdmonitor.ch:9591/api` | Real-time crowd counts |
| Stadt Zürich Open Data (proxied via `util/bathdata.php`) | Water temperature & official open/closed |
| Static `POOL_HOURS` | Hardcoded opening periods per pool |
