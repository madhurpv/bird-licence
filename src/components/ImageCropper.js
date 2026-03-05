import { useState, useRef, useEffect, useCallback } from "react";
import "./ImageCropper.css";

const MIN_CROP = 40; // minimum crop box size in px

export default function ImageCropper({ imageSrc, onConfirm, onCancel }) {
  const canvasRef      = useRef(null);
  const containerRef   = useRef(null);
  const imgRef         = useRef(null);

  // Displayed image dimensions inside the container
  const [imgRect, setImgRect]   = useState(null); // { x, y, w, h } in container coords

  // Crop box in container coords
  const [crop, setCrop] = useState(null);

  // Drag state
  const dragState = useRef(null); // { type, startX, startY, startCrop }

  // ── Load image and fit it into the container ──────────────────
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      imgRef.current = img;
      // Use ResizeObserver so we fit after the container has its real dimensions
      const ro = new ResizeObserver(() => {
        fitImage();
        ro.disconnect(); // only need the first paint
      });
      if (containerRef.current) ro.observe(containerRef.current);
      else fitImage(); // fallback
    };
    img.src = imageSrc;
    // eslint-disable-next-line
  }, [imageSrc]);

  const fitImage = useCallback(() => {
    const container = containerRef.current;
    if (!container || !imgRef.current) return;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const iw = imgRef.current.naturalWidth;
    const ih = imgRef.current.naturalHeight;
    const scale = Math.min(cw / iw, ch / ih);
    const w = iw * scale;
    const h = ih * scale;
    const x = (cw - w) / 2;
    const y = (ch - h) / 2;
    const rect = { x, y, w, h };
    setImgRect(rect);
    // Default crop: centre square taking 80% of the shorter side
    const side = Math.min(w, h) * 0.8;
    setCrop({
      x: x + (w - side) / 2,
      y: y + (h - side) / 2,
      w: side,
      h: side,
    });
    drawCanvas(rect, {
      x: x + (w - side) / 2,
      y: y + (h - side) / 2,
      w: side,
      h: side,
    });
  }, []);

  // ── Draw canvas ───────────────────────────────────────────────
  const drawCanvas = useCallback((rect, cropBox) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !imgRef.current || !rect || !cropBox) return;

    canvas.width  = container.clientWidth;
    canvas.height = container.clientHeight;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the image
    ctx.drawImage(imgRef.current, rect.x, rect.y, rect.w, rect.h);

    // Dim everything outside the crop box
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cut out the crop area (show image underneath)
    ctx.save();
    ctx.beginPath();
    ctx.rect(cropBox.x, cropBox.y, cropBox.w, cropBox.h);
    ctx.clip();
    ctx.drawImage(imgRef.current, rect.x, rect.y, rect.w, rect.h);
    ctx.restore();

    // Crop border
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(cropBox.x, cropBox.y, cropBox.w, cropBox.h);

    // Rule-of-thirds grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      // vertical
      ctx.beginPath();
      ctx.moveTo(cropBox.x + (cropBox.w / 3) * i, cropBox.y);
      ctx.lineTo(cropBox.x + (cropBox.w / 3) * i, cropBox.y + cropBox.h);
      ctx.stroke();
      // horizontal
      ctx.beginPath();
      ctx.moveTo(cropBox.x, cropBox.y + (cropBox.h / 3) * i);
      ctx.lineTo(cropBox.x + cropBox.w, cropBox.y + (cropBox.h / 3) * i);
      ctx.stroke();
    }

    // Corner handles
    const hs = 10; // handle size
    ctx.fillStyle = "#fff";
    const corners = [
      [cropBox.x, cropBox.y],
      [cropBox.x + cropBox.w - hs, cropBox.y],
      [cropBox.x, cropBox.y + cropBox.h - hs],
      [cropBox.x + cropBox.w - hs, cropBox.y + cropBox.h - hs],
    ];
    corners.forEach(([cx, cy]) => ctx.fillRect(cx, cy, hs, hs));

    // Edge midpoint handles
    const mid = [
      [cropBox.x + cropBox.w / 2 - hs / 2, cropBox.y],
      [cropBox.x + cropBox.w / 2 - hs / 2, cropBox.y + cropBox.h - hs],
      [cropBox.x, cropBox.y + cropBox.h / 2 - hs / 2],
      [cropBox.x + cropBox.w - hs, cropBox.y + cropBox.h / 2 - hs / 2],
    ];
    mid.forEach(([mx, my]) => ctx.fillRect(mx, my, hs, hs));
  }, []);

  // Redraw whenever crop or imgRect changes
  useEffect(() => {
    drawCanvas(imgRect, crop);
  }, [imgRect, crop, drawCanvas]);

  // ── Hit-test helpers ──────────────────────────────────────────
  const HANDLE = 18; // px hit radius for handles

  function getHandle(x, y, c) {
    const checks = [
      { id: "nw", px: c.x,           py: c.y            },
      { id: "ne", px: c.x + c.w,     py: c.y            },
      { id: "sw", px: c.x,           py: c.y + c.h      },
      { id: "se", px: c.x + c.w,     py: c.y + c.h      },
      { id: "n",  px: c.x + c.w / 2, py: c.y            },
      { id: "s",  px: c.x + c.w / 2, py: c.y + c.h      },
      { id: "w",  px: c.x,           py: c.y + c.h / 2  },
      { id: "e",  px: c.x + c.w,     py: c.y + c.h / 2  },
    ];
    for (const ch of checks) {
      if (Math.abs(x - ch.px) < HANDLE && Math.abs(y - ch.py) < HANDLE) return ch.id;
    }
    return null;
  }

  function insideCrop(x, y, c) {
    return x > c.x && x < c.x + c.w && y > c.y && y < c.y + c.h;
  }

  // ── Pointer events ────────────────────────────────────────────
  function getPos(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    if (!crop || !imgRect) return;
    const { x, y } = getPos(e);
    const handle = getHandle(x, y, crop);
    if (handle) {
      dragState.current = { type: "resize", handle, startX: x, startY: y, startCrop: { ...crop } };
    } else if (insideCrop(x, y, crop)) {
      dragState.current = { type: "move", startX: x, startY: y, startCrop: { ...crop } };
    }
  }, [crop, imgRect]);

  const onPointerMove = useCallback((e) => {
    e.preventDefault();
    if (!dragState.current || !imgRect) return;
    const { x, y } = getPos(e);
    const ds = dragState.current;
    const dx = x - ds.startX;
    const dy = y - ds.startY;
    const sc = ds.startCrop;
    const ir = imgRect;
    let nx = sc.x, ny = sc.y, nw = sc.w, nh = sc.h;

    if (ds.type === "move") {
      nx = Math.max(ir.x, Math.min(ir.x + ir.w - nw, sc.x + dx));
      ny = Math.max(ir.y, Math.min(ir.y + ir.h - nh, sc.y + dy));
    } else {
      const h = ds.handle;
      if (h.includes("e")) nw = Math.max(MIN_CROP, Math.min(ir.x + ir.w - sc.x, sc.w + dx));
      if (h.includes("s")) nh = Math.max(MIN_CROP, Math.min(ir.y + ir.h - sc.y, sc.h + dy));
      if (h.includes("w")) {
        const newW = Math.max(MIN_CROP, sc.w - dx);
        nx = sc.x + sc.w - newW;
        nx = Math.max(ir.x, nx);
        nw = sc.x + sc.w - nx;
      }
      if (h.includes("n")) {
        const newH = Math.max(MIN_CROP, sc.h - dy);
        ny = sc.y + sc.h - newH;
        ny = Math.max(ir.y, ny);
        nh = sc.y + sc.h - ny;
      }
      // Clamp right/bottom edges inside image
      nw = Math.min(nw, ir.x + ir.w - nx);
      nh = Math.min(nh, ir.y + ir.h - ny);
    }

    const newCrop = { x: nx, y: ny, w: nw, h: nh };
    setCrop(newCrop);
    drawCanvas(imgRect, newCrop);
  }, [imgRect, drawCanvas]);

  const onPointerUp = useCallback(() => {
    dragState.current = null;
  }, []);

  // ── Cursor style based on hover ───────────────────────────────
  const onMouseMove = useCallback((e) => {
    if (!crop || !canvasRef.current) return;
    if (dragState.current) return;
    const { x, y } = getPos(e);
    const handle = getHandle(x, y, crop);
    const cursorMap = { nw: "nw-resize", ne: "ne-resize", sw: "sw-resize", se: "se-resize", n: "n-resize", s: "s-resize", w: "w-resize", e: "e-resize" };
    if (handle) canvasRef.current.style.cursor = cursorMap[handle] || "pointer";
    else if (insideCrop(x, y, crop)) canvasRef.current.style.cursor = "move";
    else canvasRef.current.style.cursor = "default";
  }, [crop]);

  // ── Confirm: extract cropped pixels into a data URL ───────────
  const handleConfirm = useCallback(() => {
    if (!crop || !imgRect || !imgRef.current) return;
    // Map crop box (in display coords) back to natural image coords
    const scaleX = imgRef.current.naturalWidth  / imgRect.w;
    const scaleY = imgRef.current.naturalHeight / imgRect.h;
    const sx = (crop.x - imgRect.x) * scaleX;
    const sy = (crop.y - imgRect.y) * scaleY;
    const sw = crop.w * scaleX;
    const sh = crop.h * scaleY;

    const out = document.createElement("canvas");
    out.width  = Math.round(sw);
    out.height = Math.round(sh);
    out.getContext("2d").drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, out.width, out.height);
    onConfirm(out.toDataURL("image/jpeg", 0.95));
  }, [crop, imgRect, onConfirm]);

  return (
    <div className="cropper-overlay">
      <div className="cropper-modal">
        <div className="cropper-header">
          <h3 className="cropper-title">✂️ Crop Your Bird Photo</h3>
          <p className="cropper-subtitle">Drag the box to move · Drag edges or corners to resize</p>
        </div>

        <div className="cropper-canvas-wrap" ref={containerRef}>
          <canvas
            ref={canvasRef}
            className="cropper-canvas"
            onMouseDown={onPointerDown}
            onMouseMove={(e) => { onPointerMove(e); onMouseMove(e); }}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={onPointerDown}
            onTouchMove={onPointerMove}
            onTouchEnd={onPointerUp}
          />
        </div>

        <div className="cropper-actions">
          <button className="cropper-btn cropper-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="cropper-btn cropper-confirm" onClick={handleConfirm}>
            ✓ Use This Crop
          </button>
        </div>
      </div>
    </div>
  );
}