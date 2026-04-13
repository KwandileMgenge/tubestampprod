import "./LandingPage.css";
import NavBar from "./NavBar";
import BumpUps from "./BumpUps";
import Timestamp from "./Timestamp";
import Footer from "./Footer";

const LandingPage = () => {
  return (
    <main className="landing-page">
      <div className="landing-container">
        <NavBar />
        <section className="landing-card">
          <h1>Hello, Landing Page</h1>
          <p>Welcome to TubeStamp. This is your basic landing page.</p>
        </section>
        <BumpUps />
        <Timestamp />
        <Footer />
      </div>
    </main>
  );
};

export default LandingPage;
