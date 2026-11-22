import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "entry.png");
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outputPath = join(outputDir, "entry.png");

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

let data;
try {
  data = await readFile(sourcePath);
} catch (err) {
  fail(`cannot read entry.png: ${err.message}`);
}

if (data.length > 1048576) {
  fail(`file too large: ${data.length} bytes exceeds 1048576 byte limit`);
}

if (data.length < 24) {
  fail(`file too short: ${data.length} bytes, cannot contain PNG header`);
}

const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const actualSig = data.subarray(0, 8);
if (!actualSig.equals(signature)) {
  fail(`invalid PNG signature: got ${actualSig.toString("hex")}, expected 89504e470d0a1a0a`);
}

const chunkType = data.subarray(12, 16).toString("ascii");
if (chunkType !== "IHDR") {
  fail(`invalid first chunk: got "${chunkType}", expected "IHDR"`);
}

const width = data.readUInt32BE(16);
const height = data.readUInt32BE(20);
if (width !== 1024 || height !== 1024) {
  fail(`invalid dimensions: got ${width}x${height}, expected 1024x1024`);
}

try {
  await mkdir(outputDir, { recursive: true });
} catch (err) {
  fail(`cannot create output directory ${outputDir}: ${err.message}`);
}

try {
  await writeFile(outputPath, data);
} catch (err) {
  fail(`cannot write output file ${outputPath}: ${err.message}`);
}

let copy;
try {
  copy = await readFile(outputPath);
} catch (err) {
  fail(`cannot read back output file ${outputPath}: ${err.message}`);
}

if (copy.length !== data.length) {
  fail(`copy length mismatch: source ${data.length} bytes, copy ${copy.length} bytes`);
}

for (let i = 0; i < data.length; i++) {
  if (copy[i] !== data[i]) {
    fail(`copy differs from source at byte offset ${i}`);
  }
}

const hash = createHash("sha256").update(copy).digest("hex");
console.log(`bytes: ${copy.length}`);
console.log(`sha256: ${hash}`);
console.log(`output: ${outputPath}`);
