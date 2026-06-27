# mhueni.github.io

## Guidelines

- Be short and concise
- Keep asking until every detail is clear and every issue is solved
- Only commit / push if asked explicitly
- Automatically update README.md and llms.txt if necessary

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
| `util/pooldata.php` | PHP proxy — fetches city XML, returns JSON |

## "Wo go bade" Architecture

### Data Sources

1. **WebSocket** `wss://badi-public.crowdmonitor.ch:9591/api` — real-time crowd counts per pool UID
2. **Stadt Zürich Open Data Webservice** `https://www.stadt-zuerich.ch/stzh/bathdatadownload` — water temperature + official open/closed status (XML, proxied via `util/pooldata.php`), data: https://data.stadt-zuerich.ch/dataset/wassertemperaturen-freibaeder/resource/548d1ceb-1daf-4cf9-a14a-92c86326824d
3. **Static `POOL_HOURS`** — hardcoded opening hours/periods per UID

### `POOLS`

Object mapping crowd-monitor UID → `{ poiid, name }`:

```js
const POOLS = {
  'SSD-10':  { poiid: 'seb6945',  name: 'Seebad Utoquai' },
  'SSD-11':  { poiid: 'fb013',    name: 'Freibad Seebach' },
  'LETZI-1': { poiid: 'fb002',    name: 'Freibad Letzigraben' },
  'flb6939': { poiid: 'flb6939', name: 'Flussbad Oberer Letten' },
  'flb6940': { poiid: 'flb6940', name: 'Flussbad Unterer Letten' },
  'flb8803': { poiid: 'flb8803', name: 'Flussbad Unterer Letten (Fluss)' },
  'flb6941': { poiid: 'flb6941', name: 'Frauenbad Stadthausquai' },
  'fb006':   { poiid: 'fb006',   name: 'Freibad Allenmoos' },
  'fb008':   { poiid: 'fb008',   name: 'Freibad Auhof' },
  'fb012':   { poiid: 'fb012',   name: 'Freibad Heuried' },
  'fb018':   { poiid: 'fb018',   name: 'Freibad Zwischen den Hölzern' },
  'seb6946': { poiid: 'seb6946', name: 'Strandbad Mythenquai' },
  'seb6947': { poiid: 'seb6947', name: 'Strandbad Tiefenbrunnen' },
  'seb6948': { poiid: 'seb6948', name: 'Strandbad Wollishofen' },
};
```

### Card Display Logic

- **Color** (card background): grey if closed, green if open (fill ≤ 50%), orange if open (fill > 50%), red if open (fill > 80%)
- **Label** (when open & city data exists): `"offen (Wasser {temp}°C, HH:MM Uhr)"`
- **Label** (when open & city says geschlossen): `"geschlossen (HH:MM Uhr)"`
- **City data** is fetched from `util/pooldata.php` locally, or `https://mhueni.ch/util/pooldata.php` when host is in `REMOTE_API_HOSTS`

### Render Pipeline

1. `fetchCityData()` — fetch JSON from `util/pooldata.php`, build `Map<poiid, data>`
2. `DOMContentLoaded` → initialize `currentPools` from `POOLS` (fill starts at 0), render immediately
3. WebSocket message → for each pool in data, update `currentfill`/`maxspace` on matching `currentPools` entry
4. `renderPools()` — sort (favorites first, then alphabetically), compute label + color, render cards
5. 60-second interval — re-evaluate `isOpen()`, update label + card color

## `index.html` Conventions

- `<h2>` for section headings, `<p class="subtitle">` for descriptions
- `.project-list` `<ul>` for project listings
- Links open in new tab (`target="_blank"`)
- Generator meta tag: `vibe coded with opencode`

## `assets/main.js`

- Typing animation for `.subtitle` elements
- `SPEED = 15` ms per character
- Uses `IntersectionObserver` — starts typing when element scrolls into view
