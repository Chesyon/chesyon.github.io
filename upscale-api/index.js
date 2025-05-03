const express = require('express');
const { createCanvas, loadImage } = require('canvas');

const app = express();
const PORT = process.env.PORT || 3000;

function upscaleImage(img, scaleFactor) {
  const srcCanvas = createCanvas(img.width, img.height);
  const srcCtx = srcCanvas.getContext('2d');
  srcCtx.drawImage(img, 0, 0);

  const srcData = srcCtx.getImageData(0, 0, img.width, img.height);
  const dstCanvas = createCanvas(img.width * scaleFactor, img.height * scaleFactor);
  const dstCtx = dstCanvas.getContext('2d');
  const dstImageData = dstCtx.createImageData(dstCanvas.width, dstCanvas.height);

  for (let y = 0; y < dstCanvas.height; y++) {
    for (let x = 0; x < dstCanvas.width; x++) {
      const srcX = Math.floor(x / scaleFactor);
      const srcY = Math.floor(y / scaleFactor);
      const srcIndex = (srcY * img.width + srcX) * 4;
      const dstIndex = (y * dstCanvas.width + x) * 4;

      dstImageData.data[dstIndex]     = srcData.data[srcIndex];
      dstImageData.data[dstIndex + 1] = srcData.data[srcIndex + 1];
      dstImageData.data[dstIndex + 2] = srcData.data[srcIndex + 2];
      dstImageData.data[dstIndex + 3] = srcData.data[srcIndex + 3];
    }
  }

  dstCtx.putImageData(dstImageData, 0, 0);
  return dstCanvas;
}

app.get('/upscale', async (req, res) => {
  const imgURL = req.query.img;
  if (!imgURL) {
    return res.status(400).send('Missing ?img= query parameter');
  }

  try {
    const response = await fetch(imgURL);
    if (!response.ok) throw new Error('Image fetch failed');
    const buffer = await response.buffer;
    const img = await loadImage(buffer);
    
    const scaleFactor = 13;
    const canvas = upscaleImage(img, scaleFactor);

    res.set('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to process image');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

