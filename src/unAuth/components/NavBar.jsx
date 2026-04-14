import "./NavBar.css";

const NavBar = () => {
  return (
    <header className="nav-bar">
      <div className="nav-brand">
        <span className="nav-logo-icon">✦</span>
        TubeStamp
      </div>
      <div className="nav-actions">
        <button className="nav-btn-cta" type="button">Do More With Video →</button>
      </div>
    </header>
  );
};

export default NavBar;