# LabelWriter 4XL: HTML → PDF → CUPS

Notes from getting a checkerboard to print from Linux with **predictable size**, **no surprise scaling**, and **no extra feed** after the job.

---

## In plain terms

- **`cupsMediaType 1` is non‑optional for custom sizes.** If **`*CustomPageSize`** in the PPD doesn’t send **`/cupsMediaType 1`**, **`lp … -o media=Custom.223.92x288.00`** (and friends) **over-feeds**: the driver acts like **die-cut** stock and keeps feeding like it’s hunting the **next gap or notch**. Built-in **continuous** entries (e.g. **`w223h360`**) already had that flag; **custom** didn’t until we patched **`*CustomPageSize`** the same way. There’s no **`lp -o continuous=yes`** here — it’s all in what the PPD passes to **`setpagedevice`**.

- **Two widths, two jobs.** **(A)** Your **layout** width in CSS — here **272 px** on **`.print-area` / `.board`** with **`overflow: clip`**. That’s the ruler for grids and future art; change the HTML and update that number in your head. **(B)** The **paper** width the driver/PDF use — about **3.1 in** / **78.74 mm** / **223.2 PostScript points** (**`w223h360`** in the PPD). Think **picture frame** vs **tape width**: your frame is a bit narrower than the tape, so you get **margin** on the strip, not squishing. If the drawing gets **wider than the tape** (ballpark **~298 px** at **96 px per inch**), the stack **shrinks** it to fit and pixel tweaks stop matching inches on paper.

- **Chrome preview lies a little.** It can show the “right” size but still hand CUPS a **generic** **`Custom.221.10×360.00`**-style string instead of the **named** **`w223h360`**. **`lp -o media=w223h360`** matched the PPD and behaved. For anything important: **make a PDF**, then **`lp`** with an explicit **`-o media=…`**.

- **Why Puppeteer:** bare **`chrome --print-to-pdf`** wanted **Letter** unless you fight it. **`render-pdf.mjs`** sets **width `78.74 mm`** (same idea as **223.20 pt**), **height** from the content box as **px ÷ 96** inches. **`pdfinfo`** may say **~223.92 pt** wide — use **those** numbers in **`media=Custom.…`** so the job matches the file.

- **Which PPD actually runs:** the queue reads **`/etc/cups/ppd/LabelWriter-4XL.ppd`**. **`lw4xl.ppd`** only matters if it’s **the same bytes** (run **`sudo cmp`** on both) or you **copy** edits over. **`printers.conf`** usually won’t spell out the path.

---

## Commands

```bash
node render-pdf.mjs
pdfinfo index.pdf   # "Page size: W x H pts" → fill Custom below
lp -d "LabelWriter-4XL" -o "media=Custom.WxH.00" /home/sam/PaperPrinter/index.pdf
```

If the PDF page matches **XX80mm Continuous** exactly, named media is fine:

```bash
lp -d "LabelWriter-4XL" -o media=w223h360 /path/to/file.pdf
```

**Spelunking:** **`pdfinfo`** (PDF points for **`Custom`**), **`lpoptions -p LabelWriter-4XL -l`** (allowed sizes), **`ipptool -tv ipp://localhost/jobs/<id> …`** (what **`media`** a job really got), **`sudo cmp`** the two PPD paths (edits are live).

---

## Numbers (same ideas, no new story)

| | |
|--|--|
| **223.20 pt** | ÷ 72 → **3.1 in**; × 25.4 → **78.74 mm** |
| **272 px** | ÷ 96 → ~**2.83 in** art inside **3.1 in** tape |
| **~298 px** | ~**3.1 in** at 96 px/in — past this, expect **fit-to-width** |
