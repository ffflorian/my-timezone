# my-timezone

<img src="./public/img/icon-512x512.png" width="150" alt="my-timezone logo" />

A React website that shows your **true solar time** - the astronomically correct local mean time at your exact geographic location - together with a live map pin.

True solar time is not political clock time (UTC offsets, DST). Every degree of longitude equals exactly 4 minutes of offset from UTC. See [this article on CS4FN](https://web.archive.org/web/20250914163157/http://www.cs4fn.org/mobile/owntimezone.php) for background.

## Features

- Requests your browser location (latitude / longitude)
- Calculates true solar time using the [`my-timezone`](https://www.npmjs.com/package/my-timezone) npm package
- Displays a live, auto-updating clock
- Shows your position on an interactive OpenStreetMap map (Leaflet)
- Reverse-geocodes your coordinates to a human-readable place name (Nominatim)
- Works fully in-browser; no backend required

## Tech stack

| Tool                      | Purpose                     |
| ------------------------- | --------------------------- |
| React 19 + TypeScript     | UI                          |
| Vite                      | Bundler / dev server        |
| Yarn 4 (Berry)            | Package manager             |
| my-timezone               | True solar time calculation |
| Leaflet + react-leaflet   | Interactive map             |
| Nominatim (OpenStreetMap) | Reverse geocoding           |
| oxlint + ESLint           | Linting                     |
| Prettier                  | Formatting                  |
| Vitest + Testing Library  | Unit / component tests      |

## Run locally

```bash
yarn install
yarn dev
```

## Run tests

```bash
yarn test
```

## Build

```bash
yarn build
```
