import ThemeToggle from "./ThemeToggle";
import "./Header.css";

export default function Header({ theme, setTheme }) {
  return (
    <header className="site-header">
      {/* Left: brand */}
      <div className="header-brand">
        <span className="header-logo">🦅</span>
        <div className="header-brand-text">
          <span className="header-title">Bird Flying License</span>
          <span className="header-subtitle">Avian Aviation Authority · Est. 2024</span>
        </div>
      </div>

      {/* Centre: tagline */}
      <div className="header-tagline">
        <span className="header-tag-badge">✦</span>
        <span>Issue official flying licenses for your feathered friends</span>
        <span className="header-tag-badge">✦</span>
      </div>

      {/* Right: theme toggle */}
      <div className="header-actions">
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </header>
  );
}