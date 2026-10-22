export const SCENE_WIDTH = 960;
export const SCENE_HEIGHT = 576;
export const MAX_SCENE_PIXELS = 4000000;
export function sceneResolution(displayWidth, pixelRatio = 1) {
  const width = Number.isFinite(displayWidth) && displayWidth > 0 ? displayWidth : SCENE_WIDTH;
  const density = Number.isFinite(pixelRatio) && pixelRatio > 0 ? Math.min(pixelRatio, 2) : 1;
  const scale = Math.min(width * density / SCENE_WIDTH, Math.sqrt(MAX_SCENE_PIXELS / (SCENE_WIDTH * SCENE_HEIGHT)));
  const bitmapWidth = Math.max(1, Math.floor(SCENE_WIDTH * scale));
  const bitmapHeight = Math.max(1, Math.floor(SCENE_HEIGHT * scale));
  return { width: bitmapWidth, height: bitmapHeight, scaleX: bitmapWidth / SCENE_WIDTH, scaleY: bitmapHeight / SCENE_HEIGHT };
}
export function resizeSceneCanvas(canvas, displayWidth, pixelRatio) {
  const resolution = sceneResolution(displayWidth, pixelRatio);
  if (canvas.width !== resolution.width) canvas.width = resolution.width;
  if (canvas.height !== resolution.height) canvas.height = resolution.height;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(resolution.scaleX, 0, 0, resolution.scaleY, 0, 0);
  ctx.imageSmoothingEnabled = false;
  return resolution;
}
export function scenePoint(clientX, clientY, bounds) {
  if (!(bounds.width > 0 && bounds.height > 0)) return null;
  return { x: (clientX - bounds.left) * SCENE_WIDTH / bounds.width, y: (clientY - bounds.top) * SCENE_HEIGHT / bounds.height };
}
