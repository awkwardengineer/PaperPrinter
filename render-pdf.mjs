import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const htmlPath = path.join(__dirname, "index.html");
const outPath = path.join(__dirname, "index.pdf");

/** CSS px per inch (print / DIP convention you asked for). */
const PX_PER_IN = 96;

/**
 * Fixed page width to match lw4xl.ppd XX80mm entry: PaperDimension width 223.20 pt
 * = 223.20/72 in = 3.1 in = 78.74 mm.
 */
const PAGE_WIDTH = "78.74mm";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: "new",
  args: ["--no-sandbox"],
});

const page = await browser.newPage();
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle0" });
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
  `Page width: ${PAGE_WIDTH} (matches PPD ~223.2 pt). Content height: ${heightPx} px → ${heightIn.toFixed(4)} in (${PX_PER_IN} px = 1 in)`,
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
