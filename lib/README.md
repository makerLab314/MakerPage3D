# Patched Gaussian Splats 3D Library

This directory contains a patched version of `@mkkellogg/gaussian-splats-3d@0.4.0`.

## Why is this patched?

The original library version 0.4.0 has a bug in the `PlyParserUtils.checkBufferForEndHeader()` function that causes a `RangeError: Invalid typed array length` when parsing PLY files.

## What was fixed?

**File:** `gaussian-splats-3d.module.js` (line 2640-2647)

**Original code:**
```javascript
static checkBufferForEndHeader(buffer, searchOfset, chunkSize, decoder) {
    const endHeaderTestChunk = new Uint8Array(buffer, Math.max(0, searchOfset - chunkSize), chunkSize);
    const endHeaderTestText = decoder.decode(endHeaderTestChunk);
    return PlyParserUtils.checkTextForEndHeader(endHeaderTestText);
}
```

**Problem:** 
When `searchOfset - chunkSize` is negative, `Math.max(0, searchOfset - chunkSize)` returns 0. If the buffer doesn't have `chunkSize` bytes available from offset 0, the `Uint8Array` constructor throws a RangeError.

**Fixed code:**
```javascript
static checkBufferForEndHeader(buffer, searchOfset, chunkSize, decoder) {
    const startOffset = Math.max(0, searchOfset - chunkSize);
    const availableBytes = buffer.byteLength - startOffset;
    const actualChunkSize = Math.min(chunkSize, availableBytes);
    const endHeaderTestChunk = new Uint8Array(buffer, startOffset, actualChunkSize);
    const endHeaderTestText = decoder.decode(endHeaderTestChunk);
    return PlyParserUtils.checkTextForEndHeader(endHeaderTestText);
}
```

**Solution:** 
The fix calculates the available bytes from the start offset and clamps the chunk size to prevent creating an invalid Uint8Array.

## Upstream Issue

This fix should be reported to the upstream repository:
https://github.com/mkkellogg/GaussianSplats3D

## Updating

If a newer version of the library fixes this issue, you can:
1. Update the import map in `index.html` to use the CDN version
2. Remove this patched version from the `lib/` directory
