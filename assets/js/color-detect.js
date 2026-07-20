// Live color-recognition camera demo
// Detects red / green / blue regions in the camera feed and draws
// color-coded, labeled bounding boxes around them.

(function () {
  const GRID_W = 64;
  const GRID_H = 48;
  const MIN_BLOB_CELLS = 10;
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

  function isSkinTone(r, g, b) {
    return r > 90 && g > 40 && b > 20 &&
      (Math.max(r, g, b) - Math.min(r, g, b)) > 12 &&
      Math.abs(r - g) > 12 && r > g && r > b;
  }

  function classify(r, g, b) {
    const [h, s, v] = rgbToHsv(r, g, b);

    // green: real-world green objects read as noticeably less saturated
    // and darker than red/blue under normal indoor lighting, so it gets
    // the most forgiving thresholds and the widest hue window.
    if (h >= 80 && h < 170 && s >= 0.22 && v >= 0.16) return 2;

    if (h >= 195 && h < 255 && s >= 0.32 && v >= 0.18) return 3; // blue

    if ((h >= 347 || h < 10) && s >= 0.36 && v >= 0.20) {
      if (isSkinTone(r, g, b)) return 0;
      return 1; // red
    }

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
    const switchBtn = document.getElementById("cam-switch");
    const msgEl = document.getElementById("cam-msg");
    if (!video || !canvas || !startBtn) return;

    const ctx = canvas.getContext("2d");
    const off = document.createElement("canvas");
    off.width = GRID_W;
    off.height = GRID_H;
    const offCtx = off.getContext("2d", { willReadFrequently: true });
    if ("filter" in offCtx) offCtx.filter = "brightness(1.1) saturate(1.15) contrast(1.05)";

    let stream = null;
    let rafId = null;
    let facing = "environment"; // defaults to the rear/world camera
    let switching = false;
    let tracks = []; // smoothed, persisted boxes: {cls, x, y, w, h, misses}

    const SMOOTHING = 0.45;   // higher = snappier, lower = smoother
    const MAX_MISSES = 5;     // frames a track survives with no fresh match

    function iou(a, b) {
      const x1 = Math.max(a.x, b.x), y1 = Math.max(a.y, b.y);
      const x2 = Math.min(a.x + a.w, b.x + b.w), y2 = Math.min(a.y + a.h, b.y + b.h);
      const iw = Math.max(0, x2 - x1), ih = Math.max(0, y2 - y1);
      const inter = iw * ih;
      if (inter <= 0) return 0;
      const union = a.w * a.h + b.w * b.h - inter;
      return union > 0 ? inter / union : 0;
    }

    function updateTracks(rawBoxes) {
      const unmatched = rawBoxes.slice();
      for (const track of tracks) {
        let bestIdx = -1, bestScore = 0.12; // minimum overlap to count as the same object
        for (let i = 0; i < unmatched.length; i++) {
          if (unmatched[i].cls !== track.cls) continue;
          const score = iou(track, unmatched[i]);
          if (score > bestScore) { bestScore = score; bestIdx = i; }
        }
        if (bestIdx >= 0) {
          const raw = unmatched.splice(bestIdx, 1)[0];
          track.x += (raw.x - track.x) * SMOOTHING;
          track.y += (raw.y - track.y) * SMOOTHING;
          track.w += (raw.w - track.w) * SMOOTHING;
          track.h += (raw.h - track.h) * SMOOTHING;
          track.misses = 0;
        } else {
          track.misses += 1;
        }
      }
      tracks = tracks.filter((t) => t.misses <= MAX_MISSES);
      for (const raw of unmatched) {
        tracks.push({ cls: raw.cls, x: raw.x, y: raw.y, w: raw.w, h: raw.h, misses: 0 });
      }
      tracks.sort((a, b) => b.w * b.h - a.w * a.h);
      tracks = tracks.slice(0, MAX_BOXES);
    }

    function applyMirror() {
      const mirrored = facing === "user";
      video.classList.toggle("mirrored", mirrored);
      canvas.classList.toggle("mirrored", mirrored);
    }

    async function detectMultipleCameras() {
      try {
        if (!navigator.mediaDevices.enumerateDevices) return false;
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter((d) => d.kind === "videoinput").length > 1;
      } catch (e) {
        return false;
      }
    }

    function stopStream() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        stream = null;
      }
    }

    async function openCamera() {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      video.muted = true;
      video.playsInline = true;
      video.srcObject = stream;
      await video.play();
      tracks = [];
      applyMirror();
    }

    function tick() {
      if (video.readyState >= 2 && video.videoWidth) {
        offCtx.drawImage(video, 0, 0, GRID_W, GRID_H);
        const frame = offCtx.getImageData(0, 0, GRID_W, GRID_H).data;
        const labels = new Uint8Array(GRID_W * GRID_H);
        for (let i = 0; i < GRID_W * GRID_H; i++) {
          labels[i] = classify(frame[i * 4], frame[i * 4 + 1], frame[i * 4 + 2]);
        }
        const gridBoxes = findBoxes(labels, GRID_W, GRID_H);

        if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
        if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;

        const sx = canvas.width / GRID_W, sy = canvas.height / GRID_H;
        const rawBoxes = gridBoxes.map((box) => ({
          cls: box.cls,
          x: box.minX * sx,
          y: box.minY * sy,
          w: (box.maxX - box.minX + 1) * sx,
          h: (box.maxY - box.minY + 1) * sy,
        }));
        updateTracks(rawBoxes);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const t of tracks) {
          const meta = COLOR_META[t.cls];
          const x = t.x, y = t.y, w = t.w, h = t.h;

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
        await openCamera();
        msgEl.hidden = true;
        startBtn.hidden = true;
        stopBtn.hidden = false;
        if (switchBtn) {
          const canSwitch = await detectMultipleCameras();
          switchBtn.hidden = !canSwitch;
        }
        tick();
      } catch (err) {
        msgEl.hidden = false;
        msgEl.textContent = "Camera access was denied or unavailable. Check your browser's camera permissions and try again.";
      }
    }

    async function switchCamera() {
      if (switching) return;
      switching = true;
      const prevFacing = facing;
      facing = facing === "environment" ? "user" : "environment";
      stopStream();
      try {
        await openCamera();
        tick();
      } catch (err) {
        // Fall back to the previous camera if the switch fails
        facing = prevFacing;
        try {
          await openCamera();
          tick();
        } catch (err2) {
          msgEl.hidden = false;
          msgEl.textContent = "Couldn't switch cameras. Try again, or restart the camera.";
          startBtn.hidden = false;
          stopBtn.hidden = true;
        }
      }
      switching = false;
    }

    function stopCamera() {
      stopStream();
      tracks = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      startBtn.hidden = false;
      stopBtn.hidden = true;
      if (switchBtn) switchBtn.hidden = true;
    }

    startBtn.addEventListener("click", startCamera);
    if (stopBtn) stopBtn.addEventListener("click", stopCamera);
    if (switchBtn) switchBtn.addEventListener("click", switchCamera);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      msgEl.hidden = false;
      msgEl.textContent = "Your browser doesn't support camera access. Try a recent version of Chrome, Safari, or Edge.";
      startBtn.disabled = true;
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
