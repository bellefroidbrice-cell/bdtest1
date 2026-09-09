/**
 * Assemble l'export web d'Expo en une page HTML unique et auto-suffisante.
 *
 * Le bundle JavaScript, les feuilles de style, la police d'icônes et les images
 * sont intégrés au fichier : la page s'ouvre sans serveur et sans réseau, ce qui
 * la rend partageable telle quelle (pièce jointe, hébergement statique, artefact).
 *
 * Usage : node scripts/build-web-prototype.mjs <dossier-export> <fichier-sortie>
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, posix, relative, sep } from 'node:path';

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.css': 'text/css',
};

const [, , exportDir = 'dist', outputFile = 'cadence-prototype.html'] = process.argv;

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const html = readFileSync(join(exportDir, 'index.html'), 'utf8');

// Table des ressources : chemin servi -> data: URI.
const assets = new Map();
for (const file of walk(exportDir)) {
  const url = '/' + relative(exportDir, file).split(sep).join(posix.sep);
  const ext = extname(file);
  if (['.html', '.json'].includes(ext) || url.startsWith('/_expo/static/js/')) continue;
  const mime = MIME[ext] ?? 'application/octet-stream';
  assets.set(url, `data:${mime};base64,${readFileSync(file).toString('base64')}`);
}

/** Remplace les URL de ressources par leur contenu intégré. */
function inlineUrls(text) {
  // Les URL les plus longues d'abord, pour éviter les remplacements partiels.
  for (const url of [...assets.keys()].sort((a, b) => b.length - a.length)) {
    if (text.includes(url)) text = text.split(url).join(assets.get(url));
  }
  return text;
}

const cssHref = html.match(/<link rel="stylesheet" href="(\/_expo\/static\/css\/[^"]+)"/)?.[1];
const externalCss = cssHref ? readFileSync(join(exportDir, cssHref.slice(1)), 'utf8') : '';

const styles = html.match(/<style[^>]*>[\s\S]*?<\/style>/g)?.join('') ?? '';

const jsHref = html.match(/<script src="(\/_expo\/static\/js\/web\/[^"]+)"/)?.[1];
if (!jsHref) throw new Error("Bundle introuvable dans l'export : lancez d'abord `expo export --platform web`.");
const bundle = inlineUrls(readFileSync(join(exportDir, jsHref.slice(1)), 'utf8'))
  // Une chaîne « </script> » dans le code fermerait la balise prématurément.
  .split('</script>')
  .join('<\\/script>');

const root = html.match(/<div id="root">[\s\S]*?<\/div><\/div>/)?.[0] ?? '<div id="root"></div>';

const page = `<title>Cadence</title>
${inlineUrls(styles)}
<style>${externalCss}</style>
<style>
  html, body { height: 100%; margin: 0; background: #0A0A0A; }
  #root { display: flex; height: 100%; }
</style>
<script>
  // La page peut être servie depuis n'importe quel chemin (iframe, sous-dossier).
  // Le routeur résout les écrans à partir de l'URL : on la ramène à la racine.
  try {
    if (location.pathname !== '/') history.replaceState(null, '', '/' + location.search + location.hash);
  } catch (error) {
    console.warn('URL non modifiable, le routeur démarre sur', location.pathname);
  }
</script>
<script type="module">globalThis.__EXPO_ROUTER_HYDRATE__=true;</script>
${root}
<script>${bundle}</script>
`;

writeFileSync(outputFile, page);
console.log(
  `${outputFile} — ${(page.length / 1_000_000).toFixed(2)} Mo, ${assets.size} ressources intégrées`
);
