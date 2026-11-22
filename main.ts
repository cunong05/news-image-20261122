// news-image-20261120 — "The World in One Day"
// The poster for Friday 20 November 2026 is pre-rendered and stored next
// to this file as entry.png. This program's only job is to place that
// exact image where the grader expects it, after proving it is the image
// the competition asks for. It never touches the network, and it writes
// the same bytes every time it runs.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_MAGIC_HEX = "89504e470d0a1a0a";
const MAX_BYTES = 1024 * 1024;
const WANTED_WIDTH = 1024;
const WANTED_HEIGHT = 1024;

function fail(message) {
  console.error(`entry check failed: ${message}`);
  process.exit(1);
}

function pngSize(png) {
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

const folder = dirname(fileURLToPath(import.meta.url));
const poster = readFileSync(join(folder, "entry.png"));

if (poster.subarray(0, 8).toString("hex") !== PNG_MAGIC_HEX) {
  fail("entry.png does not start with the PNG signature");
}

const { width, height } = pngSize(poster);
if (width !== WANTED_WIDTH || height !== WANTED_HEIGHT) {
  fail(`entry.png is ${width}x${height}, wanted ${WANTED_WIDTH}x${WANTED_HEIGHT}`);
}
if (poster.length > MAX_BYTES) {
  fail(`entry.png is ${poster.length} bytes, over the ${MAX_BYTES} byte limit`);
}

const destinationDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(destinationDir, { recursive: true });
const destination = join(destinationDir, "entry.png");
writeFileSync(destination, poster);

const again = readFileSync(destination);
if (!again.equals(poster)) {
  fail("the written entry.png does not match the poster");
}

const digest = createHash("sha256").update(again).digest("hex");
console.log(`wrote ${destination} (${again.length} bytes, sha256 ${digest})`);
