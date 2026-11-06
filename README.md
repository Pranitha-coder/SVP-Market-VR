# SVP Market 360° VR

A simple static HTML, CSS, JavaScript and JSON project.

## Project structure

- `index.html` — page structure
- `css/style.css` — styling
- `js/script.js` — interactions, scene loading and language switching
- `data/data.json` — scene content, translations and waypoint data
- `assets/images/` — welcome image and site plan
- `assets/panoramas/` — 360° panorama images

## Add your existing assets

Copy your original image files into the folders below, keeping the filenames exactly as listed:

### `assets/images/`
- `welcome-hero.jpg`
- `Site plan.jpg`

### `assets/panoramas/`
- `Ariel View.png`
- `Cafe.png`
- `Charpoy.jpg`
- `Totlot.jpg`
- `Corridor.jpg`
- `Courtyard.png`

The actual image files were not included with the two source-code uploads, so these folders are ready for your originals.

## Run locally

Because the project loads JSON with `fetch()`, open it through a local development server rather than double-clicking `index.html`.

For example, in VS Code, use the Live Server extension and open `index.html`.

## Notes

- All six scene records are included: the original four plus Corridor and Courtyard.
- Site Plan buttons are generated from the JSON scene list.
- Waypoint markers are rendered only for waypoint positions present in the JSON. At present, the supplied JSON defines the Corridor ↔ Courtyard connection.
- Architectural hover information uses those supplied waypoint labels. More architectural hotspots can be added by adding waypoint records with verified positions.
- Site-plan area highlighting is not enabled because no area coordinates or marked-up site-plan asset were supplied. No positions have been guessed.
- Image sharpness depends on the resolution of the original panorama files. The code avoids adding extra image compression, but cannot restore detail missing from a source image.
