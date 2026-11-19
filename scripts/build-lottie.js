/* Gera assets/js/lottie.js a partir das animações em assets/lotties/.
   Uso: node scripts/build-lottie.js (na raiz do projeto).

   Os SVGs usam IDs curtos (i0, i1...) que podem colidir quando os dois
   são embutidos na mesma página; por isso cada um recebe um prefixo. */

const fs = require("fs");

function namespace(svg, prefix) {
  const ids = [...new Set([...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]))];
  let out = svg;
  for (const id of ids) {
    const esc = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(url\\(#|xlink:href="#|href="#|id=")${esc}(?=["\\)])`, "g");
    out = out.replace(re, `$1${prefix}-${id}`);
  }
  return out;
}

const thumb = namespace(fs.readFileSync("assets/lotties/thumb.svg", "utf8"), "vem-thumb");
const five = namespace(fs.readFileSync("assets/lotties/high-five.svg", "utf8"), "vem-five");

const banner = "/* Gerado a partir de assets/lotties/*.svg — não editar manualmente. */\n";
const body =
  "window.VemLottie = {\n  thumb: " +
  JSON.stringify(thumb) +
  ",\n  highfive: " +
  JSON.stringify(five) +
  "\n};\n";

fs.writeFileSync("assets/js/lottie.js", banner + body, "utf8");
console.log("lottie.js:", (banner + body).length, "bytes");
