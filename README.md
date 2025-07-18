# bad-apple-bin

Convert **Bad Apple!!** video into monochrome, 1-bit binary frame data.

## Frame Format

Each frame is stored as a packed 1-bit bitmap:

- Pixels are stored left to right, top to bottom
- 1 = white, 0 = black
- 8 pixels per byte (bit-packed)
- All frames are concatenated in order

## Usage

```
pnpm install               # Install dependencies
./ffmpeg-script.sh         # Extract grayscale frames from video
pnpm run convert           # Convert PNGs to 1-bit binary
./gzip-script.sh           # (Optional) Compress to .gz
```
