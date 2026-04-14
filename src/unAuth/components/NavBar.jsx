import "./NavBar.css";

const NavBar = () => {
  return (
    <header className="nav-bar">
      <div className="nav-brand">
        <span className="nav-logo-icon">✦</span>
        TubeStamp
      </div>
      <div className="nav-actions">
        <a
          className="nav-btn-cta"
          href="https://bumpups.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Do More With Video →
        </a>
      </div>
    </header>
  );
};

export default NavBar;