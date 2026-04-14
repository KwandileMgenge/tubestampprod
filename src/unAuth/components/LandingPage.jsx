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
        <Timestamp />
        <BumpUps />
        <Footer />
      </div>
    </main>
  );
};

export default LandingPage;
