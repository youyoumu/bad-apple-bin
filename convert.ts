import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { PNG } from "pngjs";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

const WIDTH = parseInt(process.env.WIDTH!);
const HEIGHT = parseInt(process.env.HEIGHT!);
const THRESHOLD = parseInt(process.env.THRESHOLD!);
const FRAME_DIR = process.env.FRAMES_DIR!;
const BIN_OUTPUT = process.env.BIN_OUTPUT!;

function packBits(bits: number[]): Uint8Array {
  const packed = new Uint8Array(Math.ceil(bits.length / 8));
  for (let i = 0; i < bits.length; i++) {
    if (bits[i]) {
      /* 
 *
1 >> 3 same as 1 / Math.floor(1 / 8)

| `1 << N` | Binary result | Decimal |
| -------- | ------------- | ------- |
| `1 << 0` | `00000001`    | `1`     |
| `1 << 1` | `00000010`    | `2`     |
| `1 << 2` | `00000100`    | `4`     |
| `1 << 3` | `00001000`    | `8`     |
| `1 << 4` | `00010000`    | `16`    |
| `1 << 5` | `00100000`    | `32`    |
| `1 << 6` | `01000000`    | `64`    |
| `1 << 7` | `10000000`    | `128`   |

*/
      packed[i >> 3] |= 1 << (7 - (i % 8));
    }
  }
  return packed;
}

const files = readdirSync(FRAME_DIR)
  .filter((f) => f.endsWith(".png"))
  .sort();

const allFrames: Uint8Array[] = [];

for (const file of files) {
  const buffer = readFileSync(join(FRAME_DIR, file));
  const png = PNG.sync.read(buffer);

  const bitsPerFrame: number[] = [];

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const idx = (y * WIDTH + x) << 2; // n << 2 same as n * (2 ** 2), same as n * 4
      const gray = png.data[idx]; // only read R channel
      bitsPerFrame.push(gray > THRESHOLD ? 1 : 0);
    }
  }

  allFrames.push(packBits(bitsPerFrame));
}

const output = Buffer.concat(allFrames);
writeFileSync(BIN_OUTPUT, output);
console.log(
  `✅ Wrote ${files.length} frames to ${BIN_OUTPUT} (${output.length} bytes)`,
);
