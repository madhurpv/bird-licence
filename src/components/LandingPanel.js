import "./LandingPanel.css";

const FEATURES = [
  { icon: "🪶", title: "Official Certification", desc: "Internationally recognized by the Avian Aviation Authority (AAA)" },
  { icon: "🌍", title: "All Species Welcome", desc: "From hummingbirds to albatrosses — every flier deserves a license" },
  { icon: "⚡", title: "Instant Generation", desc: "Fill details and watch your license appear in real time" },
  { icon: "💾", title: "Download & Share", desc: "Save your license as a high-quality PNG to show off" },
];

const FLIGHT_CLASSES = [
  { emoji: "🦅", label: "Class A — Soaring", desc: "Eagles, Hawks, Condors" },
  { emoji: "🦜", label: "Class B — Perching", desc: "Parrots, Finches, Sparrows" },
  { emoji: "🦆", label: "Class C — Waterfowl", desc: "Ducks, Geese, Pelicans" },
  { emoji: "🦉", label: "Class N — Nocturnal", desc: "Owls, Nightjars" },
];

export default function LandingPanel() {
  return (
    <div className="landing">
      {/* Header */}
      <div className="landing-header">
        <div className="landing-badge">
          <span className="badge-dot" />
          Avian Aviation Authority
        </div>
        <h1 className="landing-title">
          Bird <span className="title-accent">Flying</span>
          <br />
          License
          <br />
          <span className="title-sub">Generator</span>
        </h1>
        <p className="landing-desc">
          Issue official-looking flying licenses for your feathered friends.
          Upload a bird photo, fill in the details, and download a beautifully
          crafted license card — perfect for fun, gifts, or digital keepsakes.
        </p>
      </div>

      {/* Features */}
      <div className="landing-features">
        {FEATURES.map((f) => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Flight classes */}
      <div className="landing-classes">
        <div className="classes-label">License Classes</div>
        <div className="classes-grid">
          {FLIGHT_CLASSES.map((c) => (
            <div key={c.label} className="class-chip">
              <span className="class-emoji">{c.emoji}</span>
              <div>
                <div className="class-name">{c.label}</div>
                <div className="class-examples">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer hint */}
      <div className="landing-hint">
        <div className="hint-arrow">→</div>
        <span>Drop your bird's photo on the right to get started</span>
      </div>
    </div>
  );
}
