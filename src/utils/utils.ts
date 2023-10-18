export function range(start: number, end?: number, step: number = 1): number[] {
  if (end === undefined) {
    end = start;
    start = 0;
  }

  if (step === 0) {
    throw new Error("Step should not be zero.");
  }

  const result: number[] = [];
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      result.push(i);
    }
  }

  return result;
}

/**
 * Processes an image source and calls a callback with the pixel data.
 *
 * @param src - The source URL of the image.
 * @param callback - The callback to be called with the pixel data.
 */
export function processImage(
  src: string,
  callback: (data: Uint8ClampedArray) => void
): void {
  // Create a new image element
  const img = new Image();

  // Ensure cross-origin images can be processed
  img.crossOrigin = "Anonymous";

  img.onload = () => {
    // Create an off-screen canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("Failed to get canvas rendering context.");
      return;
    }

    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0);

    // Get pixel data from canvas
    const pixelData = ctx.getImageData(0, 0, img.width, img.height).data;

    // Call the callback with the pixel data
    callback(pixelData);
  };

  img.onerror = (err: Event | string) => {
    console.error("Error loading image:", err);
  };

  // Set the image source to start loading
  img.src = src;
}
