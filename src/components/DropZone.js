import { useState, useCallback } from "react";
import ImageCropper from "./ImageCropper";
import "./DropZone.css";

export default function DropZone({ onImageDrop }) {
  const [isDragging, setIsDragging]   = useState(false);
  const [error, setError]             = useState("");
  const [cropSrc, setCropSrc]         = useState(null); // raw image waiting to be cropped

  // ── Load raw file into memory, then open cropper ──────────────
  const processFile = useCallback((file) => {
    setError("");
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setCropSrc(e.target.result); // open cropper
    reader.readAsDataURL(file);
  }, []);

  // ── Drag & drop ───────────────────────────────────────────────
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  }, [processFile]);

  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = ()  => setIsDragging(false);

  // ── File input ────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  // ── Cropper callbacks ─────────────────────────────────────────
  const handleCropConfirm = useCallback((croppedDataUrl) => {
    setCropSrc(null);
    onImageDrop(croppedDataUrl);
  }, [onImageDrop]);

  const handleCropCancel = useCallback(() => {
    setCropSrc(null);
  }, []);

  return (
    <>
      {/* Crop modal — shown after a file is chosen */}
      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

      <div
        className={`dropzone ${isDragging ? "dragging" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept=""
          className="dropzone-input"
          onChange={handleFileChange}
          title=""
        />

        <div className="dz-feather dz-feather-1">🪶</div>
        <div className="dz-feather dz-feather-2">🪶</div>
        <div className="dz-feather dz-feather-3">🪶</div>

        <div className="dz-content">
          <div className="dz-bird-icon">
            <div className="dz-bird-ring" />
            <div className="dz-bird-ring dz-ring-2" />
            <span className="dz-bird-emoji">🦚</span>
          </div>

          <h2 className="dz-title">Drop Your Bird Here</h2>
          <p className="dz-subtitle">
            Drag & drop a bird face photo
            <br />
            or <span className="dz-link">tap to browse</span>
          </p>

          <div className="dz-formats">
            <span>JPG</span><span className="dz-dot">·</span>
            <span>PNG</span><span className="dz-dot">·</span>
            <span>WEBP</span><span className="dz-dot">·</span>
            <span>GIF</span>
          </div>

          {error && <div className="dz-error">{error}</div>}

          <div className="dz-tip">💡 You'll be able to crop the photo after selecting</div>
        </div>
      </div>
    </>
  );
}