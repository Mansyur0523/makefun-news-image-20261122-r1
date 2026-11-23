// makefun-news-image-20261122-r1 — entry.png copier / validator.
// Node stdlib only. Reads entry.png next to this script, validates the PNG
// structure, then copies it byte-identically to $MAKEFUN_OUTPUT_DIR.
// Never writes into the repo or the current working directory.
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 1024 * 1024;
const MAX_SIDE = 1024;

// CRC-32 (IEEE 802.3) table, built once.
const CRC_TABLE: number[] = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}
function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function fail(msg: string): never {
  console.error(`error: ${msg}`);
  process.exit(1);
}

function main(): void {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const src = resolve(scriptDir, "entry.png");
  const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  const dst = resolve(outDir, "entry.png");

  // Guard: never write into the repo (or anywhere under the script dir).
  if (dst === src || dst.startsWith(scriptDir + sep)) {
    fail(`output path ${dst} is inside the repo; refusing to write`);
  }

  let data: Buffer;
  try {
    data = readFileSync(src);
  } catch {
    fail(`cannot read ${src}`);
  }

  if (data.length > MAX_BYTES) fail(`entry.png is ${data.length} bytes, over the 1 MiB limit`);
  if (!data.subarray(0, 8).equals(PNG_MAGIC)) fail("bad PNG magic bytes");

  // Walk the chunk list: IHDR first, at least one IDAT, IEND last, CRC per chunk.
  let off = 8;
  let first = true;
  let sawIdat = false;
  let sawIend = false;
  let width = 0;
  let height = 0;
  while (off + 8 <= data.length) {
    const len = data.readUInt32BE(off);
    const type = data.subarray(off + 4, off + 8).toString("ascii");
    const chunkEnd = off + 8 + len + 4;
    if (chunkEnd > data.length) fail(`chunk ${type} overruns the file`);
    const storedCrc = data.readUInt32BE(off + 8 + len);
    const actualCrc = crc32(Buffer.concat([data.subarray(off + 4, off + 8), data.subarray(off + 8, off + 8 + len)]));
    if (storedCrc !== actualCrc) fail(`CRC mismatch in chunk ${type}`);
    if (first) {
      if (type !== "IHDR") fail("first chunk is not IHDR");
      if (len !== 13) fail("IHDR length is not 13");
      width = data.readUInt32BE(off + 8);
      height = data.readUInt32BE(off + 12);
      if (width > MAX_SIDE || height > MAX_SIDE) fail(`dimensions ${width}x${height} exceed ${MAX_SIDE}`);
      if (width === 0 || height === 0) fail("zero dimension");
      const bitDepth = data[off + 16];
      const colorType = data[off + 17];
      if (bitDepth !== 8) fail(`bit depth ${bitDepth}, expected 8`);
      if (colorType !== 2) fail(`color type ${colorType}, expected 2 (truecolour RGB)`);
      first = false;
    }
    if (type === "IDAT") sawIdat = true;
    if (type === "IEND") {
      if (chunkEnd !== data.length) fail("trailing bytes after IEND");
      if (len !== 0) fail("IEND length is not 0");
      sawIend = true;
      break;
    }
    off = chunkEnd;
  }
  if (!sawIend) fail("no IEND chunk found");
  if (first) fail("no IHDR chunk found");
  if (!sawIdat) fail("no IDAT chunk found");

  mkdirSync(outDir, { recursive: true });
  copyFileSync(src, dst);

  // Verify the copy byte-for-byte via sha256.
  const srcHash = createHash("sha256").update(data).digest("hex");
  const outHash = createHash("sha256").update(readFileSync(dst)).digest("hex");
  if (srcHash !== outHash) fail(`sha256 mismatch after copy: ${srcHash} vs ${outHash}`);
  const outSize = statSync(dst).size;
  if (outSize !== data.length) fail(`copied size ${outSize} differs from source ${data.length}`);

  console.log(`ok: ${width}x${height} PNG, ${data.length} bytes, sha256 ${srcHash}`);
  console.log(`copied to ${dst}`);
}

main();
