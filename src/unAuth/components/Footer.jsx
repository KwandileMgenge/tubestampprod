import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-shell">
      <div className="footer-card">
        <div className="footer-top">
          <div className="footer-brand-block">
            <div className="footer-brand">
              <span className="footer-brand-icon">✦</span>
              <span className="footer-brand-name">TubeStamp</span>
            </div>
            <p className="footer-tagline">
              Turn your videos into clean timestamps, quick summaries, and better publishing workflows.
            </p>
          </div>

          <div className="footer-links-grid">
            <div>
              <h3>PRODUCT</h3>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#how-it-works">How It Works</a>
            </div>
            <div>
              <h3>COMPANY</h3>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="#support">Support</a>
            </div>
            <div>
              <h3>RESOURCES</h3>
              <a href="#faq">FAQ</a>
              <a href="#community">Community</a>
              <a href="#updates">Updates</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} TubeStamp. All rights reserved.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter">
              Twitter
            </a>
            <a href="#" aria-label="LinkedIn">
              LinkedIn
            </a>
            <a href="#" aria-label="Discord">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;