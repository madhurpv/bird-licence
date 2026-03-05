import { useEffect, useRef } from "react";
import "./LicensePreview.css";

// Canvas is drawn at this resolution (downloaded size)
const W = 2000;
const H = 1260;

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawLicense(canvas, formData, birdImage, isDark) {
  const ctx = canvas.getContext("2d");
  canvas.width = W;
  canvas.height = H;

  // ─────────────────────────────────────────────────────────────
  // LAYOUT CONSTANTS (all in px at W=2000 resolution)
  // ─────────────────────────────────────────────────────────────
  const PAD        = 52;     // outer padding
  const HEADER_H   = 150;    // top blue band height
  const FOOTER_H   = 112;    // bottom band height
  const BODY_Y     = HEADER_H + 20;           // where body content starts
  const BODY_H     = H - HEADER_H - FOOTER_H - 20; // usable body height
  const FOOTER_Y   = H - FOOTER_H;

  // Photo column
  const PHOTO_X    = PAD;
  const PHOTO_W    = 640;  // 2x original 320
  // PHOTO_H is derived from the image's natural aspect ratio so nothing is cropped.
  // If no image yet, use a square placeholder box.
  const imgNatW    = birdImage ? (birdImage.naturalWidth  || birdImage.width)  : 1;
  const imgNatH    = birdImage ? (birdImage.naturalHeight || birdImage.height) : 1;
  const PHOTO_H    = Math.round(PHOTO_W * (imgNatH / imgNatW));
  const PHOTO_Y    = BODY_Y + Math.round((BODY_H - PHOTO_H) / 2); // vertically centered in body
  const PHOTO_R    = 20;

  // Seal sits below photo, centered on it
  const SEAL_X     = PHOTO_X + PHOTO_W / 2;
  const SEAL_R     = 46;
  const SEAL_Y     = PHOTO_Y + PHOTO_H + SEAL_R + 18;

  // Data fields column — shifted right to give photo room
  const DATA_X     = PHOTO_X + PHOTO_W + 80;
  const DATA_END_X = W - PAD;
  const DATA_Y     = BODY_Y + 10;
  const FIELDS     = 9;
  const LINE_H     = Math.floor((BODY_H - 20) / FIELDS); // evenly divide body height
  const LABEL_W    = 480; // px reserved for roman + label text before value

  // ─────────────────────────────────────────────────────────────
  // BACKGROUND
  // ─────────────────────────────────────────────────────────────
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  if (isDark) {
    bgGrad.addColorStop(0,   "#0d1b4b");
    bgGrad.addColorStop(0.5, "#0a1232");
    bgGrad.addColorStop(1,   "#060e22");
  } else {
    bgGrad.addColorStop(0,   "#c8d8ff");
    bgGrad.addColorStop(0.5, "#a8c0f8");
    bgGrad.addColorStop(1,   "#8aacf0");
  }
  drawRoundedRect(ctx, 0, 0, W, H, 28);
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // Cloud blobs
  ctx.fillStyle = isDark ? "rgba(255,255,255,0.022)" : "rgba(255,255,255,0.32)";
  ctx.beginPath();
  ctx.ellipse(480, 520, 680, 380, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(1600, 900, 560, 320, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Diagonal stripes
  ctx.save();
  const stripeColor = isDark ? "rgba(91,140,255,0.03)" : "rgba(48,96,224,0.045)";
  for (let i = -H; i < W + H; i += 68) {
    ctx.strokeStyle = stripeColor;
    ctx.lineWidth   = 28;
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + H, H);
    ctx.stroke();
  }
  ctx.restore();

  // ─────────────────────────────────────────────────────────────
  // CARD BORDER
  // ─────────────────────────────────────────────────────────────
  drawRoundedRect(ctx, 0, 0, W, H, 28);
  const borderGrad = ctx.createLinearGradient(0, 0, W, H);
  if (isDark) {
    borderGrad.addColorStop(0, "rgba(91,140,255,0.7)");
    borderGrad.addColorStop(1, "rgba(167,139,250,0.5)");
  } else {
    borderGrad.addColorStop(0, "rgba(48,96,224,0.8)");
    borderGrad.addColorStop(1, "rgba(124,58,237,0.5)");
  }
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth   = 6;
  ctx.stroke();

  // ─────────────────────────────────────────────────────────────
  // HEADER BAND
  // ─────────────────────────────────────────────────────────────
  const headerGrad = ctx.createLinearGradient(0, 0, W, 0);
  if (isDark) {
    headerGrad.addColorStop(0,   "rgba(91,140,255,0.60)");
    headerGrad.addColorStop(0.5, "rgba(167,139,250,0.50)");
    headerGrad.addColorStop(1,   "rgba(52,211,153,0.32)");
  } else {
    headerGrad.addColorStop(0,   "rgba(48,96,224,0.72)");
    headerGrad.addColorStop(0.5, "rgba(124,58,237,0.58)");
    headerGrad.addColorStop(1,   "rgba(5,150,105,0.36)");
  }
  drawRoundedRect(ctx, 0, 0, W, HEADER_H, 28);
  ctx.fillStyle = headerGrad;
  ctx.fill();
  // Flatten bottom corners
  ctx.fillRect(0, HEADER_H * 0.55, W, HEADER_H * 0.45);

  // Header text
  ctx.fillStyle  = "#ffffff";
  ctx.textAlign  = "center";
  ctx.font       = "bold 38px 'DM Mono', monospace";
  ctx.letterSpacing = "10px";
  ctx.fillText("AVIAN AVIATION AUTHORITY", W / 2, 52);

  ctx.font         = "bold 74px 'Playfair Display', serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("OFFICIAL BIRD FLYING LICENCE", W / 2, 122);
  ctx.letterSpacing = "0px";

  // ─────────────────────────────────────────────────────────────
  // PHOTO BOX
  // ─────────────────────────────────────────────────────────────
  drawRoundedRect(ctx, PHOTO_X, PHOTO_Y, PHOTO_W, PHOTO_H, PHOTO_R);
  ctx.fillStyle   = isDark ? "rgba(0,0,20,0.48)" : "rgba(180,200,255,0.48)";
  ctx.fill();
  ctx.strokeStyle = isDark ? "rgba(91,140,255,0.6)" : "rgba(48,96,224,0.6)";
  ctx.lineWidth   = 4;
  ctx.stroke();

  if (birdImage) {
    ctx.save();
    drawRoundedRect(ctx, PHOTO_X, PHOTO_Y, PHOTO_W, PHOTO_H, PHOTO_R);
    ctx.clip();

    // Box is already sized to the image's natural aspect ratio, so just fill it directly.
    ctx.drawImage(birdImage, PHOTO_X, PHOTO_Y, PHOTO_W, PHOTO_H);

    ctx.restore();
  } else {
    ctx.font      = "160px serif";
    ctx.textAlign = "center";
    ctx.fillText("🦅", PHOTO_X + PHOTO_W / 2, PHOTO_Y + PHOTO_H / 2 + 56);
  }

  // Photo label bar
  ctx.fillStyle = isDark ? "rgba(0,0,20,0.72)" : "rgba(48,96,224,0.72)";
  ctx.fillRect(PHOTO_X, PHOTO_Y + PHOTO_H - 44, PHOTO_W, 44);
  ctx.font      = "bold 30px 'DM Mono', monospace";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText("PHOTO", PHOTO_X + PHOTO_W / 2, PHOTO_Y + PHOTO_H - 12);

  // ─────────────────────────────────────────────────────────────
  // SEAL (only draw if it fits above footer)
  // ─────────────────────────────────────────────────────────────
  if (SEAL_Y + SEAL_R + 24 < FOOTER_Y - 8) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(SEAL_X, SEAL_Y, SEAL_R, 0, Math.PI * 2);
    const sealGrad = ctx.createRadialGradient(SEAL_X, SEAL_Y, 8, SEAL_X, SEAL_Y, SEAL_R);
    if (isDark) {
      sealGrad.addColorStop(0, "rgba(91,140,255,0.55)");
      sealGrad.addColorStop(1, "rgba(52,211,153,0.15)");
    } else {
      sealGrad.addColorStop(0, "rgba(48,96,224,0.42)");
      sealGrad.addColorStop(1, "rgba(5,150,105,0.10)");
    }
    ctx.fillStyle   = sealGrad;
    ctx.fill();
    ctx.strokeStyle = isDark ? "rgba(240,192,64,0.85)" : "rgba(217,119,6,0.85)";
    ctx.lineWidth   = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(SEAL_X, SEAL_Y, SEAL_R - 10, 0, Math.PI * 2);
    ctx.strokeStyle = isDark ? "rgba(240,192,64,0.4)" : "rgba(217,119,6,0.4)";
    ctx.lineWidth   = 2;
    ctx.stroke();

    ctx.font      = "54px serif";
    ctx.textAlign = "center";
    ctx.fillText("🪶", SEAL_X, SEAL_Y + 18);
    ctx.restore();

    ctx.font      = "22px 'DM Mono', monospace";
    ctx.fillStyle = isDark ? "rgba(240,192,64,0.75)" : "rgba(217,119,6,0.9)";
    ctx.textAlign = "center";
    ctx.fillText("A · A · A", SEAL_X, SEAL_Y + SEAL_R + 26);
  }

  // ─────────────────────────────────────────────────────────────
  // DATA FIELDS
  // ─────────────────────────────────────────────────────────────
  const textColor    = isDark ? "#e8eaf6"                   : "#1a1f3a";
  const labelColor   = isDark ? "rgba(140,180,255,0.95)"    : "rgba(48,96,224,0.92)";
  const mutedColor   = isDark ? "#5c6382"                   : "#8890b0";
  const dividerColor = isDark ? "rgba(120,160,255,0.13)"    : "rgba(60,90,200,0.14)";

  const fields = [
    { roman: "I.",    label: "Species / Common Name", value: `${formData.speciesName || "—"} / ${formData.commonName || "—"}` },
    { roman: "II.",   label: "Licence No.",            value: formData.licenseNo || "—", mono: true },
    { roman: "III.",  label: "Date of Hatching",       value: formatDate(formData.dateOfBirth) },
    { roman: "IV.",   label: "Habitat",                value: formData.habitat || "—" },
    { roman: "V.",    label: "Wingspan",               value: formData.wingspan || "—" },
    { roman: "VI.",   label: "Morph",                  value: formData.morph || "—" },
    { roman: "VII.",  label: "Flight Class",           value: formData.flightClass || "—" },
    { roman: "VIII.", label: "Date of Issue",          value: formatDate(formData.issuedDate) },
    { roman: "IX.",   label: "Valid Until",            value: formatDate(formData.validUntil) },
  ];

  fields.forEach((f, i) => {
    const rowY = DATA_Y + i * LINE_H;
    const midY = rowY + LINE_H * 0.62; // text baseline within row

    // Divider line above each row (skip first)
    if (i > 0) {
      ctx.strokeStyle = dividerColor;
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.moveTo(DATA_X, rowY);
      ctx.lineTo(DATA_END_X, rowY);
      ctx.stroke();
    }

    // Roman numeral
    ctx.font      = "28px 'DM Mono', monospace";
    ctx.fillStyle = mutedColor;
    ctx.textAlign = "left";
    ctx.fillText(f.roman, DATA_X, midY);

    // Label
    ctx.font      = "28px 'Syne', sans-serif";
    ctx.fillStyle = labelColor;
    ctx.fillText(f.label.toUpperCase(), DATA_X + 92, midY);

    // Value
    ctx.font      = f.mono
      ? "bold 38px 'DM Mono', monospace"
      : "bold 36px 'Syne', sans-serif";
    ctx.fillStyle = textColor;
    ctx.fillText(f.value, DATA_X + LABEL_W, midY);
  });

  // ─────────────────────────────────────────────────────────────
  // FOOTER BAND
  // ─────────────────────────────────────────────────────────────
  ctx.fillStyle = isDark ? "rgba(0,0,20,0.50)" : "rgba(48,96,224,0.18)";
  ctx.fillRect(0, FOOTER_Y, W, FOOTER_H);

  // Footer accent line
  const flGrad = ctx.createLinearGradient(0, FOOTER_Y, W, FOOTER_Y);
  if (isDark) {
    flGrad.addColorStop(0,   "rgba(91,140,255,0.0)");
    flGrad.addColorStop(0.3, "rgba(91,140,255,0.85)");
    flGrad.addColorStop(0.7, "rgba(167,139,250,0.85)");
    flGrad.addColorStop(1,   "rgba(167,139,250,0.0)");
  } else {
    flGrad.addColorStop(0,   "rgba(48,96,224,0.0)");
    flGrad.addColorStop(0.3, "rgba(48,96,224,0.75)");
    flGrad.addColorStop(0.7, "rgba(124,58,237,0.75)");
    flGrad.addColorStop(1,   "rgba(124,58,237,0.0)");
  }
  ctx.strokeStyle = flGrad;
  ctx.lineWidth   = 3;
  ctx.beginPath();
  ctx.moveTo(0, FOOTER_Y);
  ctx.lineTo(W, FOOTER_Y);
  ctx.stroke();

  // Footer left: issuing authority
  ctx.font      = "26px 'DM Mono', monospace";
  ctx.fillStyle = isDark ? "rgba(255,255,255,0.48)" : "rgba(48,96,224,0.70)";
  ctx.textAlign = "left";
  ctx.fillText("ISSUING AUTHORITY", PAD, FOOTER_Y + 38);

  ctx.font      = "bold 38px 'Syne', sans-serif";
  ctx.fillStyle = isDark ? "#e8eaf6" : "#1a1f3a";
  ctx.fillText("Avian Aviation Authority", PAD, FOOTER_Y + 82);

  // Footer right: signature
  ctx.font      = "26px 'DM Mono', monospace";
  ctx.fillStyle = isDark ? "rgba(255,255,255,0.48)" : "rgba(48,96,224,0.70)";
  ctx.textAlign = "right";
  ctx.fillText("AUTHORISED SIGNATURE", W - PAD, FOOTER_Y + 38);

  // Decorative signature scribble
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.65)" : "rgba(48,96,224,0.85)";
  ctx.lineWidth   = 4;
  ctx.lineJoin    = "round";
  ctx.lineCap     = "round";
  ctx.beginPath();
  const sx = W - 780;
  const sy = FOOTER_Y + 72;
  ctx.moveTo(sx, sy);
  ctx.bezierCurveTo(sx + 80,  sy - 30, sx + 160, sy + 20, sx + 240, sy - 16);
  ctx.bezierCurveTo(sx + 320, sy - 40, sx + 440, sy + 16, sx + 580, sy - 6);
  ctx.stroke();

  // ─────────────────────────────────────────────────────────────
  // WATERMARK
  // ─────────────────────────────────────────────────────────────
  ctx.save();
  ctx.translate(W / 2, H / 2 + 60);
  ctx.rotate(-0.22);
  ctx.font      = "bold 220px 'Playfair Display', serif";
  ctx.fillStyle = isDark ? "rgba(255,255,255,0.018)" : "rgba(48,96,224,0.030)";
  ctx.textAlign = "center";
  ctx.fillText("CERTIFIED", 0, 0);
  ctx.restore();
}

export default function LicensePreview({ formData, birdImage }) {
  const canvasRef = useRef(null);

  const redraw = (canvas) => {
    if (!canvas) return;
    const isDark = document.querySelector(".app")?.classList.contains("dark") ?? true;
    if (birdImage) {
      const img = new window.Image();
      img.onload = () => drawLicense(canvas, formData, img, isDark);
      img.src = birdImage;
    } else {
      drawLicense(canvas, formData, null, isDark);
    }
  };

  useEffect(() => {
    redraw(canvasRef.current);
    // eslint-disable-next-line
  }, [formData, birdImage]);

  useEffect(() => {
    const observer = new MutationObserver(() => redraw(canvasRef.current));
    const appEl = document.querySelector(".app");
    if (appEl)
      observer.observe(appEl, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
    // eslint-disable-next-line
  }, [formData, birdImage]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    const name = formData.commonName || formData.speciesName || "bird";
    link.download = `${name.replace(/\s+/g, "_")}_flying_license.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="license-preview">
      <div className="lp-label">
        <span className="lp-dot" />
        Live Preview
      </div>

      <div className="lp-canvas-wrap">
        <canvas ref={canvasRef} className="lp-canvas" />
      </div>

      <div className="lp-actions">
        <button className="lp-download-btn" onClick={handleDownload}>
          <span className="lp-dl-icon">↓</span>
          Download License
        </button>
        <span className="lp-format-note">Saved as PNG · 2000×1260px</span>
      </div>
    </div>
  );
}