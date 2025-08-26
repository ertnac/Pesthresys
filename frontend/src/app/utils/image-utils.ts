import * as ort from 'onnxruntime-web';

export async function imageToTensor(
  img: HTMLImageElement
): Promise<ort.Tensor> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 640;
  canvas.height = 640;

  // Resize image
  ctx.drawImage(img, 0, 0, 640, 640);

  const imageData = ctx.getImageData(0, 0, 640, 640);
  const { data } = imageData;

  const float32Data = new Float32Array(3 * 640 * 640);

  for (let i = 0; i < 640 * 640; i++) {
    float32Data[i] = data[i * 4] / 255.0; // R
    float32Data[i + 640 * 640] = data[i * 4 + 1] / 255.0; // G
    float32Data[i + 2 * 640 * 640] = data[i * 4 + 2] / 255.0; // B
  }

  return new ort.Tensor('float32', float32Data, [1, 3, 640, 640]);
}
