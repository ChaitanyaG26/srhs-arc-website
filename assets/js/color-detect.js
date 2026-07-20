// Live color-recognition camera demo
// Detects red / green / blue regions in the camera feed and draws
// color-coded, labeled bounding boxes around them.

(function () {
  const GRID_W = 64;
  const GRID_H = 48;
  const MIN_BLOB_CELLS = 6;
  const MAX_BOXES = 8;

  const COLOR_META = {
    1: { name: "RED", stroke: "#ef4444" },
    2: { name: "GREEN", stroke: "#22c55e" },
    3: { name: "BLUE", stroke: "#3b82f6" },
  };

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    let h = 0;
    if (d !== 0) {
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
        case g: h = ((b - r) / d + 2); break;
        case b: h = ((r - g) / d + 4); break;
      }
      h *= 60;
    }
    return [h, s, v];
  }

  function classify(r, g, b) {
    const [h, s, v] = rgbToHsv(r, g, b);
    if (s < 0.38 || v < 0.22) return 0;
    if (h >= 345 || h < 12) return 1;   // red
    if (h >= 95 && h < 160) return 2;   // green
    if (h >= 195 && h < 255) return 3;  // blue
    return 0;
  }

  function findBoxes(labels, w, h) {
    const visited = new Uint8Array(w * h);
    const boxes = [];
    const stack = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = y * w + x;
        if (visited[idx] || labels[idx] === 0) continue;
        const cls = labels[idx];
        let minX = x, maxX = x, minY = y, maxY = y, count = 0;
        stack.length = 0;
        stack.push(idx);
        visited[idx] = 1;
        while (stack.length) {
          const cur = stack.pop();
          const cx = cur % w, cy = (cur - cx) / w;
          count++;
          if (cx < minX) minX = cx;
          if (cx > maxX) maxX = cx;
          if (cy < minY) minY = cy;
          if (cy > maxY) maxY = cy;
          if (cx > 0 && !visited[cur - 1] && labels[cur - 1] === cls) { visited[cur - 1] = 1; stack.push(cur - 1); }
          if (cx < w - 1 && !visited[cur + 1] && labels[cur + 1] === cls) { visited[cur + 1] = 1; stack.push(cur + 1); }
          if (cur - w >= 0 && !visited[cur - w] && labels[cur - w] === cls) { visited[cur - w] = 1; stack.push(cur - w); }
          if (cur + w < w * h && !visited[cur + w] && labels[cur + w] === cls) { visited[cur + w] = 1; stack.push(cur + w); }
        }
        if (count >= MIN_BLOB_CELLS) boxes.push({ cls, minX, maxX, minY, maxY, count });
      }
    }
    boxes.sort((a, b) => b.count - a.count);
    return boxes.slice(0, MAX_BOXES);
  }

  function init() {
    const video = document.getElementById("cam-video");
    const canvas = document.getElementById("cam-canvas");
    const startBtn = document.getElementById("cam-start");
    const stopBtn = document.getElementById("cam-stop");
    const msgEl = document.getElementById("cam-msg");
    if (!video || !canvas || !startBtn) return;

    const ctx = canvas.getContext("2d");
    const off = document.createElement("canvas");
    off.width = GRID_W;
    off.height = GRID_H;
    const offCtx = off.getContext("2d", { willReadFrequently: true });

    let stream = null;
    let rafId = null;

    function tick() {
      if (video.readyState >= 2 && video.videoWidth) {
        offCtx.drawImage(video, 0, 0, GRID_W, GRID_H);
        const frame = offCtx.getImageData(0, 0, GRID_W, GRID_H).data;
        const labels = new Uint8Array(GRID_W * GRID_H);
        for (let i = 0; i < GRID_W * GRID_H; i++) {
          labels[i] = classify(frame[i * 4], frame[i * 4 + 1], frame[i * 4 + 2]);
        }
        const boxes = findBoxes(labels, GRID_W, GRID_H);

        if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
        if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const sx = canvas.width / GRID_W, sy = canvas.height / GRID_H;
        for (const box of boxes) {
          const meta = COLOR_META[box.cls];
          const x = box.minX * sx, y = box.minY * sy;
          const w = (box.maxX - box.minX + 1) * sx, h = (box.maxY - box.minY + 1) * sy;

          ctx.lineWidth = Math.max(2, canvas.width * 0.004);
          ctx.strokeStyle = meta.stroke;
          ctx.strokeRect(x, y, w, h);

          const fontSize = Math.max(14, canvas.width * 0.022);
          ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;
          const textW = ctx.measureText(meta.name).width + 12;
          const tagY = Math.max(0, y - fontSize - 6);
          ctx.fillStyle = meta.stroke;
          ctx.fillRect(x, tagY, textW, fontSize + 6);
          ctx.fillStyle = "#070B14";
          ctx.fillText(meta.name, x + 6, tagY + fontSize);
        }
      }
      rafId = requestAnimationFrame(tick);
    }

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        video.srcObject = stream;
        await video.play();
        msgEl.hidden = true;
        startBtn.hidden = true;
        stopBtn.hidden = false;
        tick();
      } catch (err) {
        msgEl.hidden = false;
        msgEl.textContent = "Camera access was denied or unavailable. Check your browser's camera permissions and try again.";
      }
    }

    function stopCamera() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        stream = null;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      startBtn.hidden = false;
      stopBtn.hidden = true;
    }

    startBtn.addEventListener("click", startCamera);
    if (stopBtn) stopBtn.addEventListener("click", stopCamera);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      msgEl.hidden = false;
      msgEl.textContent = "Your browser doesn't support camera access. Try a recent version of Chrome, Safari, or Edge.";
      startBtn.disabled = true;
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
