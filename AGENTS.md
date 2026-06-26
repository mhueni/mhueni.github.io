# mhueni.github.io

Personal website of Matthias Hüni, Software Engineer & Maker from Zurich, Switzerland + "Wo go bade in Züri?" pool crowd monitor.

## Serve

```bash
php -S 0.0.0.0:8080 -t .
```

Open http://127.0.0.1:8080

## Remotes

- `origin` — `git@github.com:mhueni/mhueni.github.io.git`
- `mhueni.ch` — `https://mhueni@mhueni.ch/plesk-git/mhueni.git` (Plesk)

Push to both:

```bash
git push origin master && git push mhueni.ch master
```

## Files

| File | Purpose |
|---|---|
| `index.html` | Landing page |
| `wo-go-bade.html` | Pool crowd monitor (main app) |
| `assets/main.js` | Typing animation for `.subtitle` elements |
| `assets/main.css` | Styles for landing page |
| `util/bathdata.php` | PHP proxy — fetches city XML, returns JSON |

## "Wo go bade" Architecture

### Data Sources

1. **WebSocket** `wss://badi-public.crowdmonitor.ch:9591/api` — real-time crowd counts per pool UID
2. **Stadt Zürich Open Data Webservice** `https://www.stadt-zuerich.ch/stzh/bathdatadownload` — water temperature + official open/closed status (XML, proxied via `util/bathdata.php`), data: https://data.stadt-zuerich.ch/dataset/wassertemperaturen-freibaeder/resource/548d1ceb-1daf-4cf9-a14a-92c86326824d
3. **Static `POOL_HOURS`** — hardcoded opening hours/periods per UID

### WHITELIST

Object mapping crowd-monitor UID → city POI ID:

```js
const WHITELIST = {
  'SSD-10':  'seb6945',  // → Seebad Utoquai
  'SSD-11':  'fb013',    // → Freibad Seebach
  'LETZI-1': 'fb002',    // → Freibad Letzigraben
  'flb6939': 'flb6939',  // Flussbad Oberer Letten
  'flb6940': 'flb6940',  // Flussbad Unterer Letten
  'flb8803': 'flb8803',  // Flussbad Unterer Letten (2nd sensor)
  'flb6941': 'flb6941',  // Frauenbad Stadthausquai
  'fb006':   'fb006',    // Freibad Allenmoos
  'fb008':   'fb008',    // Freibad Auhof
  'fb012':   'fb012',    // Freibad Heuried
  'fb018':   'fb018',    // Freibad Zwischen den Hölzern
  'seb6946': 'seb6946',  // Strandbad Mythenquai
  'seb6947': 'seb6947',  // Strandbad Tiefenbrunnen
  'seb6948': 'seb6948',  // Strandbad Wollishofen
};
```

### Card Display Logic

- **Color** (card background): green if label starts with `offen`, red if starts with `geschlossen`
- **Label** (when open & city data exists): `"offen (Wasser {temp}°C, HH:MM Uhr)"`
- **Label** (when open & city says geschlossen): `"geschlossen (HH:MM Uhr)"`
- **City data** is only fetched on `localhost`, `127.0.0.1`, `mhueni.ch` or `*.mhueni.ch`

### Render Pipeline

1. `fetchCityData()` — fetch JSON from `util/bathdata.php`, build `Map<poiid, data>`
2. WebSocket message → filter by `Object.hasOwn(WHITELIST, uid)` → attach `_cityData` via `WHITELIST[uid]`
3. `renderPools()` — sort (favorites first, then alphabetically), compute label + color, render cards
4. 60-second interval — re-evaluate `isOpen()`, update label + card color

## `index.html` Conventions

- `<h2>` for section headings, `<p class="subtitle">` for descriptions
- `.project-list` `<ul>` for project listings
- Links open in new tab (`target="_blank"`)
- Generator meta tag: `vibe coded with opencode`

## `assets/main.js`

- Typing animation for `.subtitle` elements
- `SPEED = 15` ms per character
- Uses `IntersectionObserver` — starts typing when element scrolls into view
