import { useState, useCallback } from "react";
import LandingPanel from "./LandingPanel";
import FormPanel from "./FormPanel";
import DropZone from "./DropZone";
import LicensePreview from "./LicensePreview";
import "./MainPage.css";

const DEFAULT_FORM = {
  speciesName: "",
  commonName: "",
  licenseNo: "",
  dateOfBirth: "",
  habitat: "",
  wingspan: "",
  morph: "",
  flightClass: "Migratory",
  validUntil: "",
  issuedDate: "",
};

function generateLicenseNo() {
  return "BWL-" + Math.floor(100000 + Math.random() * 900000);
}

function freshForm() {
  return {
    ...DEFAULT_FORM,
    licenseNo: generateLicenseNo(),
    issuedDate: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  };
}

export default function MainPage() {
  const [birdImage, setBirdImage] = useState(null);
  const [formData, setFormData] = useState(freshForm);

  const handleImageDrop = useCallback((imgDataUrl) => {
    setBirdImage(imgDataUrl);
  }, []);

  const handleFormChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setBirdImage(null);
    setFormData(freshForm());
  }, []);

  const hasImage = !!birdImage;

  return (
    <main className="main-page">
      {/* LEFT PANEL */}
      <div className="panel panel-left">
        {!hasImage ? (
          <LandingPanel />
        ) : (
          <FormPanel
            formData={formData}
            onChange={handleFormChange}
            onReset={handleReset}
          />
        )}
      </div>

      {/* MOBILE DIVIDER */}
      <div className="divider">
        <div className="divider-line" />
        <div className="divider-icon">✦</div>
        <div className="divider-line" />
      </div>

      {/* RIGHT PANEL */}
      <div className="panel panel-right">
        {!hasImage ? (
          <DropZone onImageDrop={handleImageDrop} />
        ) : (
          <LicensePreview formData={formData} birdImage={birdImage} />
        )}
      </div>
    </main>
  );
}