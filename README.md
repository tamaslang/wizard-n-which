# Wizard-n-Which

A browser-based side-scrolling game about witches and wizards, designed by a 9-year-old. Plain HTML/CSS/ES modules, no build step. Desktop and laptop only.

See [docs/game-design.md](docs/game-design.md) for the concept and milestones.

## Run

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## Test

```sh
npm ci && npx playwright install chromium && npm test
```
