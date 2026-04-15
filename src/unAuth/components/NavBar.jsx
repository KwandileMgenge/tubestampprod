import "./NavBar.css";

const NavBar = () => {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo-icon">✦</span>
        TubeStamp
      </div>
      <div className="navbar__actions">
        <a
          className="navbar__cta"
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