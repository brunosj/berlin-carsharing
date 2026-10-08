![carsharing-berlin](https://brunosj.github.io/images/berlin-carsharing.jpg)

## Description

This repo contains the Berlin Carsharing Price Calculator app, accessible at [carsharing.landozone.net](https://carsharing.landozone.net).

When public transport takes too long and your bike still needs to be fixed, car sharing options can be interesting.
This app compares prices between different providers based on distance and time (with an additional parameter for airport pick-up/drop-off)

## Technologies

This app is a minimalist [Svelte](https://svelte.dev/) + [Vite](https://vitejs.dev/) project deployed on [Vercel](https://vercel.com/).

## Installation

1. Use the git CLI to close the repo

```
gh repo clone brunosj/berlin-carsharing
```

2. Copy `.env.example` to `.env` and set `VITE_GOOGLE_MAPS_API_KEY` (restrict the key by HTTP referrer in Google Cloud).

3. Install dependencies

```bash
pnpm install
```

4. Start the development server

```bash
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Further development

Pricing lives in `src/data/` with sources and `lastUpdated` in `src/data/pricingMeta.json`. After editing tariffs, bump `lastUpdated` and run:

```bash
pnpm run check:pricing
```

GitHub Actions runs pricing-source checks weekly and `pnpm run check`, `pnpm run test`, and `pnpm run build` on pull requests.

Any input or feedback is appreciated!

This repository is maintained by [brunosj](https://github.com/brunosj).
