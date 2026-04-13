import "./NavBar.css";

const NavBar = () => {
  return (
    <header className="nav-bar">
      <div className="nav-brand">TubeStamp</div>
      <nav className="nav-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How it works</a>
        <a href="#contact">Contact</a>
      </nav>
      <button className="nav-btn" type="button">
        Get Started
      </button>
    </header>
  );
};

export default NavBar;
