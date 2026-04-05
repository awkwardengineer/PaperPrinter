import { spawnSync } from "node:child_process";
import puppeteer from "puppeteer-core";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const argv = process.argv.slice(2).filter((a) => a !== "--print");
const htmlFile = argv.find((a) => /\.html$/i.test(a)) ?? "index.html";
const htmlPath = path.join(__dirname, htmlFile);
const outPath = path.join(
  __dirname,
  `${path.basename(htmlFile, path.extname(htmlFile))}.pdf`,
);

/** e.g. http://127.0.0.1:5500/index.html — Live Server must be running */
const paperHtmlUrlBase = (process.env.PAPER_HTML_URL || "").trim();

/** CSS px per inch (print / DIP convention you asked for). */
const PX_PER_IN = 96;

/**
 * Physical tape width (matches `lp -o media=Custom.WxH` from customMediaFromPageSize).
 * Wider stock than legacy XX80mm (223.20 pt ≈ 78.74 mm); 108 mm ≈ 306.14 pt.
 */
const PAGE_WIDTH = "108mm";
const PAGE_WIDTH_MM = Number(String(PAGE_WIDTH).replace(/mm\s*$/i, "").trim());
const PAGE_WIDTH_PT = (PAGE_WIDTH_MM / 25.4) * 72;

/** Same geometry as `page.pdf()` → `lp -o media=Custom.WxH` (PostScript points, 72 pt = 1 in). */
function customMediaFromPageSize(widthCss, heightPx, pxPerIn) {
  const mm = Number(String(widthCss).replace(/mm\s*$/i, "").trim());
  const widthPt = (mm / 25.4) * 72;
  const heightPt = (heightPx / pxPerIn) * 72;
  const f = (n) => (Math.round(n * 100) / 100).toFixed(2);
  return `Custom.${f(widthPt)}x${f(heightPt)}`;
}

const wantPrint = process.argv.includes("--print");
const cupsDest = (process.env.CUPS_DEST || "LabelWriter-4XL").trim();

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: "new",
  args: ["--no-sandbox"],
});

function buildPageLoadUrl() {
  if (paperHtmlUrlBase) return paperHtmlUrlBase;
  return pathToFileURL(htmlPath).href;
}

const loadUrl = buildPageLoadUrl();
console.log("Open:", loadUrl);

const page = await browser.newPage();
await page.goto(loadUrl, {
  waitUntil: "networkidle0",
});
await page.emulateMediaType("print");

const heightPx = await page.evaluate(() => {
  const el =
    document.querySelector(".print-area") ??
    document.querySelector(".board") ??
    document.body;
  return Math.ceil(
    Math.max(el.scrollHeight, el.offsetHeight, el.getBoundingClientRect().height),
  );
});

const heightIn = heightPx / PX_PER_IN;

console.log(
  `Page width: ${PAGE_WIDTH} (~${PAGE_WIDTH_PT.toFixed(2)} pt). Content height: ${heightPx} px → ${heightIn.toFixed(4)} in (${PX_PER_IN} px = 1 in)`,
);

await page.pdf({
  path: outPath,
  width: PAGE_WIDTH,
  height: `${heightIn}in`,
  printBackground: true,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
  preferCSSPageSize: false,
});

await browser.close();
console.log(`Wrote ${outPath}`);

const media = customMediaFromPageSize(PAGE_WIDTH, heightPx, PX_PER_IN);
console.log(`CUPS media (match PDF): ${media}`);

if (wantPrint) {
  const r = spawnSync(
    "lp",
    ["-d", cupsDest, "-o", `media=${media}`, outPath],
    { stdio: "inherit" },
  );
  if (r.error) throw r.error;
  if (r.status !== 0) process.exit(r.status ?? 1);
}
