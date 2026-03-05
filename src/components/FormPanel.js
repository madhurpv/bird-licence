import FormField from "./FormField";
import "./FormPanel.css";

const FLIGHT_CLASSES = [
  "Migratory",
  "Soaring (Class A)",
  "Perching (Class B)",
  "Waterfowl (Class C)",
  "Nocturnal (Class N)",
  "Hovering",
  "Diving",
];

export default function FormPanel({ formData, onChange, onReset }) {
  return (
    <div className="form-panel">
      {/* Header */}
      <div className="fp-header">
        <div className="fp-back" onClick={onReset} title="Start over">
          ← Change Photo
        </div>
        <div className="fp-heading">
          <h2 className="fp-title">License Details</h2>
          <p className="fp-subtitle">Fill in the fields — license updates live</p>
        </div>
      </div>

      {/* Form sections */}
      <div className="fp-sections">

        {/* Identity */}
        <div className="fp-section">
          <div className="fp-section-label">🪪 Identity</div>
          <div className="fp-grid">
            <FormField
              label="Species Name"
              placeholder="e.g. Aquila chrysaetos"
              value={formData.speciesName}
              onChange={(v) => onChange("speciesName", v)}
              hint="Scientific name"
            />
            <FormField
              label="Common Name"
              placeholder="e.g. Golden Eagle"
              value={formData.commonName}
              onChange={(v) => onChange("commonName", v)}
              hint="As known to humans"
            />
          </div>
          <FormField
            label="License Number"
            placeholder="Auto-generated"
            value={formData.licenseNo}
            onChange={(v) => onChange("licenseNo", v)}
            hint="Edit or keep auto-generated"
            mono
          />
        </div>

        {/* Personal Info */}
        <div className="fp-section">
          <div className="fp-section-label">📋 Personal Info</div>
          <div className="fp-grid">
            <FormField
              label="Date of Hatching"
              type="date"
              value={formData.dateOfBirth}
              onChange={(v) => onChange("dateOfBirth", v)}
            />
            <FormField
              label="Habitat"
              placeholder="e.g. North American Forests"
              value={formData.habitat}
              onChange={(v) => onChange("habitat", v)}
            />
          </div>
          <div className="fp-grid">
            <FormField
              label="Wingspan"
              placeholder="e.g. 2.3 m"
              value={formData.wingspan}
              onChange={(v) => onChange("wingspan", v)}
            />
            <FormField
              label="Morph"
              placeholder="e.g. Dark, Light, Intermediate"
              value={formData.morph}
              onChange={(v) => onChange("morph", v)}
              hint="Color morph / variant"
            />
          </div>
        </div>

        {/* Flight Classification */}
        <div className="fp-section">
          <div className="fp-section-label">✈️ Flight Classification</div>
          <FormField
            label="Flight Class"
            type="select"
            options={FLIGHT_CLASSES}
            value={formData.flightClass}
            onChange={(v) => onChange("flightClass", v)}
          />
        </div>

        {/* Validity */}
        <div className="fp-section">
          <div className="fp-section-label">📅 Validity</div>
          <div className="fp-grid">
            <FormField
              label="Date of Issue"
              type="date"
              value={formData.issuedDate}
              onChange={(v) => onChange("issuedDate", v)}
            />
            <FormField
              label="Valid Until"
              type="date"
              value={formData.validUntil}
              onChange={(v) => onChange("validUntil", v)}
            />
          </div>
        </div>
      </div>

      <div className="fp-footer">
        <button className="fp-reset-btn" onClick={onReset}>
          🔄 Start Over
        </button>
        <span className="fp-note">License preview updates automatically →</span>
      </div>
    </div>
  );
}